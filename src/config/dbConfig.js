const mysql2 = require('mysql2');
require("dotenv").config();

const conn = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

module.exports = conn;