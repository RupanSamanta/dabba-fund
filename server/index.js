const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "TSBk1p0sZyYqpks@",
    database: "dabbafund",
    connectionLimit: 10,
});

const saltRound = 10;

app.post("/auth/signup", (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const id = crypto.randomUUID();

    bcrypt.hash(password, saltRound, (error, hashpassword) => {
        if (error) {
            res.status(500).send(error);
        } else {
            db.query(
                "INSERT INTO users (id, first_name, last_name, email, password, is_admin) VALUES (?, ?, ?, ?, ?, ?)",
                [id, firstname, lastname, email, hashpassword, false],
                (err, result) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.status(201).send({
                            id,
                            firstname,
                            lastname,
                            email,
                            isAdmin: false
                        });
                    }
                },
            );
        }
    });
});

app.post("/auth/signin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            if (result.length < 1) {
                res.status(401).send({ message: "Invalid email or password." });
            } else {
                bcrypt.compare(password, result[0].password, (err, match) => {
                    if (err) {
                        res.status(500).send({ message: err.message });
                    } else if (match) {
                        const user = result[0];
                        res.send({
                            id: user.id,
                            firstname: user.first_name,
                            lastname: user.last_name,
                            email: user.email,
                            isAdmin: Boolean(user.is_admin),
                            createdAt: user.created_at,
                        });
                    } else {
                        res.status(401).send({ message: "Invalid email or password." });
                    }
                });
            }
        }
    });
});

app.get("/api/users", (req, res) => {
    db.query(`SELECT u.id, u.first_name as firstname, u.last_name as lastname, u.email,
            u.is_admin as isAdmin, COALESCE(SUM(t.amount), 0) AS amount
        FROM users u
        LEFT JOIN transactions t
            ON u.id = t.uid
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.is_admin
    `, (err, users) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            res.send(users);
        }
    });
});

app.listen(8888, () => {
    console.log("Server is running on port 8888");
});
