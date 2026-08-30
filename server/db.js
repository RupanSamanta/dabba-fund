const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "TSBk1p0sZyYqpks@",
    database: "dabbafund",
    connectionLimit: 10,
});

module.exports = db;
