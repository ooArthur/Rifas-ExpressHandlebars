const mysql2 = require('mysql2');

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mercadinho"
});

module.exports = conn;