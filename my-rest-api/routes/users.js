const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST route to create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, birthdate } = req.body;

    if (!name || !email || !birthdate) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, email, birthdate" });
    }

    const [result] = await pool.query(
      "INSERT INTO users (name, email, birthdate) VALUES (?, ?, ?)",
      [name, email, birthdate]
    );

    res
      .status(201)
      .json({ message: "User created successfully", userId: result.insertId });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
});

// GET route to fetch all users
router.get("/", async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

// PUT Route to Update a User
router.put("/:id", async (req, res) => {
  try {
    console.log("Received request to update user:", req.body);
    const { name, email, birthdate } = req.body;
    const { id } = req.params;

    if (!name || !email || !birthdate) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ error: "Missing required fields: name, email, birthdate" });
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      console.log("Invalid user ID");
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ?, birthdate = ? WHERE id = ?",
      [name, email, birthdate, parsedId]
    );

    if (result.affectedRows === 0) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User updated successfully with ID:", parsedId);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
});
// GET route to fetch a user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
});

// DELETE route to delete a user
router.delete("/:id", async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const { id } = req.params;
    console.log(`Attempting to delete user with id: ${id}`);

    // Delete related records in the event table
    const [eventResult] = await connection.query(
      "DELETE FROM event WHERE created_by = ?",
      [id]
    );
    console.log(`Deleted related events:`, eventResult);

    // Delete the user
    const [userResult] = await connection.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    console.log(`Delete result:`, userResult);

    if (userResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    await connection.commit();
    res
      .status(200)
      .json({ message: "User and related events deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  } finally {
    connection.release();
  }
});

module.exports = router;

module.exports = (req, res, next) => {
  // Wrap the router in a middleware function
  router(req, res, next);
};
