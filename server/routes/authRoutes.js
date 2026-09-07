const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();
const saltRound = 10;

router.post("/signup", (req, res) => {
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
                "INSERT INTO users (id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
                [id, firstname, lastname, email, hashpassword],
                (err, result) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        db.query("SELECT created_at, is_admin FROM users WHERE id = ?", [id], (createdAtError, createdAtRows) => {
                            if (createdAtError) {
                                res.status(500).send({ message: createdAtError.message });
                                return;
                            }

                            res.status(201).send({
                                id,
                                firstname,
                                lastname,
                                email,
                                isAdmin: Boolean(createdAtRows[0]?.is_admin),
                                createdAt: createdAtRows[0]?.created_at,
                            });
                        });
                    }
                },
            );
        }
    });
});

router.post("/signin", (req, res) => {
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

module.exports = router;
