const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/users", (req, res) => {
    db.query(`SELECT u.id, u.first_name as firstname, u.last_name as lastname, u.email,
            u.is_admin as isAdmin, COALESCE(SUM(t.amount), 0) AS amount
        FROM users u
        LEFT JOIN transactions t
            ON u.id = t.uid
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.is_admin
        ORDER BY u.first_name
    `, (err, users) => {
        if (err) {
            res.status(500).send({ message: err.message });
        } else {
            res.send(users);
        }
    });
});

module.exports = router;
