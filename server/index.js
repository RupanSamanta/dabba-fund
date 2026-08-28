const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

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

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRound, (error, hashpassword) => {
        if (error) {
            req.send(error);
        } else {
            db.query("INSERT INTO users VALUES (?, ?, ?)", [username, email, hashpassword], (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ username: username });
                }
            });
        }
    });
});

app.post("/signin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            res.send(err.message);
        } else {
            if (result.length < 1 || result == undefined) {
                res.send("user with email doesn't exist");
            } else {
                bcrypt.compare(password, result[0].password, (err, match) => {
                    if (match) {
                        res.send({ result })
                    } else {
                        res.send("password doesn't match");
                    }
                });
            }
        }
    });
});

app.listen(8888, () => {
    console.log("Server is running on port 8888");
});
