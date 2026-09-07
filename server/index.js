const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.send({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", transactionRoutes);

const port = Number(process.env.PORT || 8888);
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
});
