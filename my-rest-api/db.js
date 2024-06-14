const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "superguy1",
    database: "lightbeam",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise(); // Enable promise-based API

// Test the connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to the MySQL database.");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the MySQL database:", err);
  });

module.exports = pool;
