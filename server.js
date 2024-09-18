//db connection
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apidb",
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connect to database");
});

module.exports = connection;
