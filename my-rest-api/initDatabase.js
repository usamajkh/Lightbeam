const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "superguy1",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise(); // Enable promise-based API

// Function to create the database and tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Create the database
    await connection.query(`CREATE DATABASE IF NOT EXISTS lightbeam`);
    console.log("Database 'lightbeam' created successfully.");

    // Use the newly created database
    await connection.query(`USE lightbeam`);
    console.log("Switched to the 'lightbeam' database.");

    // Create tables
    const tableCreationQueries = [
      `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          birthdate DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS canteen_menu (
          id INT AUTO_INCREMENT PRIMARY KEY,
          date DATE NOT NULL,
          menu TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
      )`,
      `CREATE TABLE IF NOT EXISTS event (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          description TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by INT,
          FOREIGN KEY (created_by) REFERENCES users(id)
      )`,
      `CREATE TABLE IF NOT EXISTS meetings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          agenda TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by INT,
          FOREIGN KEY (created_by) REFERENCES users(id)
      )`,
    ];

    // Execute each table creation query separately
    for (const query of tableCreationQueries) {
      await connection.query(query);
      console.log("Table created or already exists.");
    }

    // Release the connection
    connection.release();
  } catch (err) {
    console.error("Error initializing the database:", err);
  } finally {
    // Close the pool to end all connections
    pool.end();
  }
}

// Run the initialization
initializeDatabase();

//Run this command in Terminal to create database and tables: node initDatabase.js
