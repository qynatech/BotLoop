const mysql = require("mysql2");

const db = mysql.createConnection(process.env.MYSQL_URL || {
  host: "localhost",
  user: "root",
  password: "",
  database: "bank_sampah",
  port:3306,
}
);

db.connect((err) => {
  if (err) {
    console.log("DB error: ", err);
  } else {
    console.log("DB Connected");
  }
});

module.exports = db;