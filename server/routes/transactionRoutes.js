const express = require("express");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();

const getUserId = (req) => req.body?.userId || req.body?.uid || req.query?.userId || req.query?.uid || null;

const createRequestRow = async (connection, requestId, userId, amount, type = "add_money", description = null, purchaseId = null) => {
    await connection.query(
        "INSERT INTO requests (request_id, uid, amount, type, status, created_at, description, purchase_id) VALUES (?, ?, ?, ?, 'pending', NOW(), ?, ?)",
        [requestId, userId, amount, type, description, purchaseId]
    );
};

const createApprovedTransaction = async (connection, userId, amount, transactionType = "addition") => {
    const transactionId = crypto.randomUUID();

    await connection.query(
        "INSERT INTO transactions (tid, uid, amount, type, created_at) VALUES (?, ?, ?, ?, NOW())",
        [transactionId, userId, amount, transactionType]
    );

    return { transactionId };
};

const getFundBalance = async () => {
    const [rows] = await db.promise().query(`
        SELECT
            COALESCE(SUM(CASE WHEN type = 'addition' THEN amount ELSE 0 END), 0) AS addition_total,
            COALESCE(SUM(CASE WHEN type = 'purchase' THEN amount ELSE 0 END), 0) AS purchase_total,
            COALESCE(SUM(CASE WHEN type = 'withdraw' THEN amount ELSE 0 END), 0) AS withdraw_total
        FROM transactions
    `);

    const row = rows[0] || {};
    const additionTotal = Number(row.addition_total || 0);
    const purchaseTotal = Number(row.purchase_total || 0);
    const withdrawTotal = Number(row.withdraw_total || 0);

    return additionTotal - purchaseTotal - withdrawTotal;
};

const getPurchaseVoteSummary = async (purchaseId, queryExecutor = db.promise()) => {
    const [voteRows] = await queryExecutor.query(
        "SELECT vote, COUNT(*) AS total FROM purchase_votes WHERE purchase_id = ? GROUP BY vote",
        [purchaseId]
    );

    const summary = { yes: 0, no: 0 };
    voteRows.forEach((voteRow) => {
        if (voteRow.vote === "yes") summary.yes = Number(voteRow.total);
        if (voteRow.vote === "no") summary.no = Number(voteRow.total);
    });

    const [userRows] = await queryExecutor.query("SELECT COUNT(*) AS total_users FROM users");
    const totalUsers = Number(userRows[0]?.total_users || 0);
    const totalVotes = summary.yes + summary.no;

    return {
        ...summary,
        totalUsers,
        totalVotes,
        allVotesCast: totalVotes >= totalUsers && totalUsers > 0,
    };
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

router.get("/fund-balance", async (req, res) => {
    try {
        const balance = await getFundBalance();
        return res.send({ balance });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

router.get("/fund-requests", async (req, res) => {
    const isAdmin = String(req.query.isAdmin || "false") === "true";
    const userId = req.query.userId || req.query.uid || req.query.id || null;
    const adminId = req.query.adminId || null;
    const typeFilter = String(req.query.type || "add_money").toLowerCase();

    if (!userId && (!isAdmin || !adminId)) {
        return res.status(403).send({ message: "User or admin access required." });
    }

    if (!['add_money', 'purchase', 'all'].includes(typeFilter) && typeFilter) {
        return res.status(400).send({ message: "Type must be add_money, purchase, or all." });
    }

    try {
        if (typeFilter === "purchase") {
            if (isAdmin) {
                if (!adminId) {
                    return res.status(403).send({ message: "Admin access required." });
                }

                const [adminUser] = await db.promise().query("SELECT id, is_admin FROM users WHERE id = ?", [adminId]);
                if (!adminUser.length || !Boolean(adminUser[0].is_admin)) {
                    return res.status(403).send({ message: "Admin access required." });
                }
            }

            const [rows] = await db.promise().query(
                `SELECT request_id as requestId, uid as userId, amount, type, status, created_at as createdAt, description, purchase_id as purchaseId,
                    (SELECT COUNT(*) FROM purchase_votes WHERE purchase_id = requests.request_id AND vote = 'yes') as yesVotes,
                    (SELECT COUNT(*) FROM purchase_votes WHERE purchase_id = requests.request_id AND vote = 'no') as noVotes
                 FROM requests
                 WHERE type = 'purchase'
                 ${isAdmin ? "AND status = 'pending'" : ""}
                 ORDER BY created_at DESC`
            );

            return res.send(rows);
        }

        if (isAdmin) {
            if (!adminId) {
                return res.status(403).send({ message: "Admin access required." });
            }

            const [adminUser] = await db.promise().query("SELECT id, is_admin FROM users WHERE id = ?", [adminId]);

            if (!adminUser.length || !Boolean(adminUser[0].is_admin)) {
                return res.status(403).send({ message: "Admin access required." });
            }

            const [rows] = await db.promise().query(
                `SELECT request_id as requestId, uid as userId, amount, type, status, created_at as createdAt, description, purchase_id as purchaseId
                 FROM requests
                 WHERE type = 'add_money' AND status = 'pending'
                 ORDER BY created_at DESC`
            );

            return res.send(rows);
        }

        if (!userId) {
            return res.status(403).send({ message: "User access required." });
        }

        const [userRows] = await db.promise().query("SELECT id FROM users WHERE id = ? LIMIT 1", [userId]);

        if (!userRows.length) {
            return res.status(404).send({ message: "User not found." });
        }

        const [rows] = await db.promise().query(
            `SELECT request_id as requestId, uid as userId, amount, type, status, created_at as createdAt, description, purchase_id as purchaseId
             FROM requests
             WHERE type = 'add_money' AND uid = ?
             ORDER BY created_at DESC`,
            [userId]
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
    const requestType = String(req.body.type || "add_money").toLowerCase();
    const description = req.body.description || null;

    if (!userId) {
        return res.status(400).send({ message: "User id is required." });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).send({ message: "Valid amount is required." });
    }

    if (!['add_money', 'purchase'].includes(requestType)) {
        return res.status(400).send({ message: "Request type must be add_money or purchase." });
    }

    if (requestType === "purchase" && (!description || String(description).trim().length === 0)) {
        return res.status(400).send({ message: "Purchase description is required." });
    }

    const requestId = crypto.randomUUID();

    try {
        const connection = await db.promise().getConnection();

        try {
            await connection.beginTransaction();

            if (requestType === "purchase") {
                const balance = await getFundBalance();
                if (amount >= balance) {
                    await connection.rollback();
                    return res.status(400).send({ message: "Purchase amount must be less than the current fund balance." });
                }
            }

            const purchaseId = requestType === "purchase" ? requestId : null;
            await createRequestRow(connection, requestId, userId, amount, requestType, description, purchaseId);

            if (isAdminRequest && requestType === "add_money") {
                const [userRows] = await connection.query("SELECT id, is_admin FROM users WHERE id = ?", [userId]);
                if (!userRows.length || !Boolean(userRows[0].is_admin)) {
                    await connection.rollback();
                    return res.status(403).send({ message: "Only admins can submit immediate approvals." });
                }

                await createApprovedTransaction(connection, userId, amount, "addition");

                await connection.query(
                    "UPDATE requests SET status = 'approved' WHERE request_id = ?",
                    [requestId]
                );
            }

            await connection.commit();
            return res.status(201).send({
                message: isAdminRequest && requestType === "add_money" ? "Fund request approved immediately." : "Request submitted for approval.",
                requestId,
                status: isAdminRequest && requestType === "add_money" ? "approved" : "pending",
                type: requestType,
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

router.post("/fund-requests/:requestId/vote", async (req, res) => {
    const { requestId } = req.params;
    const { uid, vote } = req.body;
    const normalizedVote = String(vote || "").toLowerCase();

    if (!uid) {
        return res.status(400).send({ message: "User id is required." });
    }

    if (!["yes", "no"].includes(normalizedVote)) {
        return res.status(400).send({ message: "Vote must be yes or no." });
    }

    try {
        const [requestRows] = await db.promise().query(
            "SELECT request_id, uid, amount, type, status FROM requests WHERE request_id = ? LIMIT 1",
            [requestId]
        );

        if (!requestRows.length) {
            return res.status(404).send({ message: "Request not found." });
        }

        const request = requestRows[0];
        if (request.type !== "purchase") {
            return res.status(400).send({ message: "Votes are only allowed for purchase requests." });
        }

        if (request.status === "approved" || request.status === "rejected") {
            return res.status(400).send({ message: "This purchase request is already finalized." });
        }

        const [userRows] = await db.promise().query("SELECT id FROM users WHERE id = ? LIMIT 1", [uid]);
        if (!userRows.length) {
            return res.status(404).send({ message: "User not found." });
        }

        const [existingVoteRows] = await db.promise().query(
            "SELECT vote_id FROM purchase_votes WHERE purchase_id = ? AND uid = ? LIMIT 1",
            [requestId, uid]
        );

        if (existingVoteRows.length) {
            return res.status(409).send({ message: "You have already voted on this purchase request." });
        }

        const connection = await db.promise().getConnection();

        try {
            await connection.beginTransaction();

            const voteId = crypto.randomUUID();
            await connection.query(
                "INSERT INTO purchase_votes (vote_id, purchase_id, uid, vote, created_at) VALUES (?, ?, ?, ?, NOW())",
                [voteId, requestId, uid, normalizedVote]
            );

            const summary = await getPurchaseVoteSummary(requestId, connection);

            if (summary.allVotesCast) {
                const finalStatus = summary.yes > summary.no ? "approved" : "rejected";
                await connection.query(
                    "UPDATE requests SET status = ? WHERE request_id = ?",
                    [finalStatus, requestId]
                );

                if (finalStatus === "approved") {
                    await createApprovedTransaction(connection, request.uid, request.amount, "purchase");
                }
            }

            await connection.commit();
            const finalStatus = summary.allVotesCast ? (summary.yes > summary.no ? "approved" : "rejected") : "pending";
            return res.send({
                requestId,
                status: finalStatus,
                vote: normalizedVote,
                summary,
                message: summary.allVotesCast ? `Purchase request ${finalStatus}.` : "Vote recorded. Waiting for all users to vote.",
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
            "SELECT uid, amount, type FROM requests WHERE request_id = ? LIMIT 1",
            [requestId]
        );

        if (!requestRows.length) {
            return res.status(404).send({ message: "Request not found." });
        }

        const request = requestRows[0];
        const connection = await db.promise().getConnection();

        try {
            await connection.beginTransaction();

            if (decision === "approve" && request.type === "add_money") {
                await createApprovedTransaction(connection, request.uid, request.amount, "addition");
            }

            if (decision === "approve" && request.type === "purchase") {
                await createApprovedTransaction(connection, request.uid, request.amount, "purchase");
            }

            const statusValue = decision === "approve" ? "approved" : "rejected";
            await connection.query(
                "UPDATE requests SET status = ? WHERE request_id = ?",
                [statusValue, requestId]
            );

            await connection.commit();
            return res.send({
                requestId,
                status: statusValue,
                type: request.type,
                message: decision === "approve" ? "Request approved." : "Request rejected.",
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