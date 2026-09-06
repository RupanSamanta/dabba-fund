const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/users", (req, res) => {
    db.query(`SELECT u.id, u.first_name as firstname, u.last_name as lastname, u.email, u.created_at as createdAt,
            u.is_admin as isAdmin,
            FLOOR(COALESCE(SUM(CASE WHEN t.type = 'addition' THEN t.amount ELSE 0 END), 0)
                - COALESCE((
                    SELECT SUM(CASE WHEN shared.type IN ('purchase', 'withdraw') THEN shared.amount ELSE 0 END)
                    FROM transactions shared
                ) / NULLIF((SELECT COUNT(*) FROM users), 0), 0)) AS amount
        FROM users u
        LEFT JOIN transactions t
            ON u.id = t.uid
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.created_at, u.is_admin
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
