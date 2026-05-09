const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bank_sampah"
});

db.connect((err) => {
    if (err) {
        console.log("database error: ", err);
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;