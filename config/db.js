const mysql = require("mysql2");

const db = mysql.createConnection(process.env.MYSQL_URL || {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

db.connect((err) => {
  if (err) {
    console.log("DB error: ", err);
  } else {
    console.log("DB Connected");
  }
});

module.exports = db;