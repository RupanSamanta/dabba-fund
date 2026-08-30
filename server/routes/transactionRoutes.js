const express = require("express");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();

const getUserId = (req) => req.body?.userId || req.body?.uid || req.query?.userId || req.query?.uid || null;

const createFundRequestRow = async (connection, requestId, userId, amount) => {
    await connection.query(
        "INSERT INTO fund_requests (rt_id, uid, amount, status, created_at, description) VALUES (?, ?, ?, 'pending', NOW(), NULL)",
        [requestId, userId, amount]
    );
};

const createApprovedTransaction = async (connection, userId, amount) => {
    const transactionId = crypto.randomUUID();

    await connection.query(
        "INSERT INTO transactions (tid, uid, amount, type, created_at) VALUES (?, ?, ?, 'addition', NOW())",
        [transactionId, userId, amount]
    );

    return { transactionId };
};

router.get("/transactions", (req, res) => {
    db.query(`SELECT u.first_name as name, t.tid as id, t.amount, t.type, t.created_at as time
            FROM transactions t
            INNER JOIN users u
            ON t.uid = u.id
            ORDER BY t.created_at DESC;`,
        (err, transactions) => {
            if (err) {
                res.status(500).send({ message: err.message });
            } else {
                res.send(transactions);
            }
        });
});

router.get("/fund-requests", async (req, res) => {
    const isAdmin = String(req.query.isAdmin || "false") === "true";
    const adminId = req.query.userId || req.query.adminId;

    if (!isAdmin || !adminId) {
        return res.status(403).send({ message: "Admin access required." });
    }

    try {
        const [adminUser] = await db.promise().query("SELECT id, is_admin FROM users WHERE id = ?", [adminId]);

        if (!adminUser.length || !Boolean(adminUser[0].is_admin)) {
            return res.status(403).send({ message: "Admin access required." });
        }

        const [rows] = await db.promise().query(
            `SELECT rt_id as requestId, uid as userId, amount, status, created_at as createdAt, description
             FROM fund_requests
             WHERE status = 'pending'
             ORDER BY created_at DESC`
        );

        return res.send(rows);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post("/fund-requests", async (req, res) => {
    const amount = Number(req.body.amount);
    const userId = getUserId(req);
    const isAdminRequest = String(req.body.isAdmin || "false") === "true";

    if (!userId) {
        return res.status(400).send({ message: "User id is required." });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).send({ message: "Valid amount is required." });
    }

    const requestId = crypto.randomUUID();

    try {
        const connection = await db.promise().getConnection();

        try {
            await connection.beginTransaction();

            await createFundRequestRow(connection, requestId, userId, amount);

            if (isAdminRequest) {
                const [userRows] = await connection.query("SELECT id, is_admin FROM users WHERE id = ?", [userId]);
                if (!userRows.length || !Boolean(userRows[0].is_admin)) {
                    await connection.rollback();
                    return res.status(403).send({ message: "Only admins can submit immediate approvals." });
                }

                await createApprovedTransaction(connection, userId, amount);

                await connection.query(
                    "UPDATE fund_requests SET status = 'approved' WHERE rt_id = ?",
                    [requestId]
                );
            }

            await connection.commit();
            return res.status(201).send({
                message: isAdminRequest ? "Fund request approved immediately." : "Fund request submitted for approval.",
                requestId,
                status: isAdminRequest ? "approved" : "pending",
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.post("/fund-requests/:requestId/decision", async (req, res) => {
    const { requestId } = req.params;
    const { adminId, action } = req.body;
    const decision = String(action || "").toLowerCase();

    if (!adminId) {
        return res.status(400).send({ message: "Admin id is required." });
    }

    if (!["approve", "reject"].includes(decision)) {
        return res.status(400).send({ message: "Action must be approve or reject." });
    }

    try {
        const [adminRows] = await db.promise().query("SELECT id, is_admin FROM users WHERE id = ?", [adminId]);

        if (!adminRows.length || !Boolean(adminRows[0].is_admin)) {
            return res.status(403).send({ message: "Admin access required." });
        }

        const [requestRows] = await db.promise().query(
            "SELECT uid, amount FROM fund_requests WHERE rt_id = ? LIMIT 1",
            [requestId]
        );

        if (!requestRows.length) {
            return res.status(404).send({ message: "Fund request not found." });
        }

        const request = requestRows[0];
        const connection = await db.promise().getConnection();

        try {
            await connection.beginTransaction();

            if (decision === "approve") {
                await createApprovedTransaction(connection, request.uid, request.amount);
            }

            const statusValue = decision === "approve" ? "approved" : "rejected";
            await connection.query(
                "UPDATE fund_requests SET status = ? WHERE rt_id = ?",
                [statusValue, requestId]
            );

            await connection.commit();
            return res.send({
                requestId,
                status: statusValue,
                message: decision === "approve" ? "Fund request approved." : "Fund request rejected.",
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

module.exports = router;