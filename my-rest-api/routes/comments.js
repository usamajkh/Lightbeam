const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import your database connection module

// POST Route to Add a Comment
router.post("/", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { content, user_id } = req.body;

    // Input Validation
    if (!content || !user_id) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ error: "Missing required fields: content, user_id" });
    }

    // Insert Comment into Database
    const [result] = await pool.query(
      "INSERT INTO comments (content, user_id) VALUES (?, ?)",
      [content, user_id]
    );

    console.log("Comment created successfully with ID:", result.insertId);
    res.status(201).json({
      message: "Comment created successfully",
      commentId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating comment:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment" });
  }
});

// GET Route to Fetch All Comments
router.get("/", async (req, res) => {
  try {
    const [comments] = await pool.query("SELECT * FROM comments");
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching comments" });
  }
});

// GET Route to Fetch a Comment by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [comments] = await pool.query("SELECT * FROM comments WHERE id = ?", [
      id,
    ]);
    if (comments.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json(comments[0]);
  } catch (error) {
    console.error("Error fetching comment by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the comment" });
  }
});

// PUT Route to Update a Comment
router.put("/:id", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { content, user_id } = req.body;
    const { id } = req.params;

    // Input Validation
    if (!content || !user_id) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ error: "Missing required fields: content, user_id" });
    }

    // Update Comment in Database
    const [result] = await pool.query(
      "UPDATE comments SET content = ?, user_id = ? WHERE id = ?",
      [content, user_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    console.log("Comment updated successfully with ID:", id);
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while updating the comment" });
  }
});

// DELETE Route to Delete a Comment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete Comment from Database
    const [result] = await pool.query("DELETE FROM comments WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    console.log("Comment deleted successfully with ID:", id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment" });
  }
});

module.exports = router;
