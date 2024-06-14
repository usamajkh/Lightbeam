const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import your database connection module

// POST Route to Add a Meeting
router.post("/", async (req, res) => {
  try {
    console.log("Received request body for /meetings:", req.body);
    const { title, date, agenda, created_by } = req.body;

    // Input Validation
    if (!title || !date || !agenda || !created_by) {
      console.log("Missing required fields for /meetings");
      return res.status(400).json({
        error: "Missing required fields: title, date, agenda, created_by",
      });
    }

    // Insert Meeting into Database
    const [result] = await pool.query(
      "INSERT INTO meetings (title, date, agenda, created_by) VALUES (?, ?, ?, ?)",
      [title, date, agenda, created_by]
    );

    console.log("Meeting created successfully with ID:", result.insertId);
    res.status(201).json({
      message: "Meeting created successfully",
      meetingId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating meeting:", error); // Log the error for debugging
    console.error("Error details:", error); // Log the error details for more insight
    res
      .status(500)
      .json({ error: "An error occurred while creating the meeting" });
  }
});

// GET Route to Fetch All Meetings
router.get("/", async (req, res) => {
  try {
    const [meetings] = await pool.query("SELECT * FROM meetings");
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching meetings" });
  }
});

// GET Route to Fetch a Meeting by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [meetings] = await pool.query("SELECT * FROM meetings WHERE id = ?", [
      id,
    ]);
    if (meetings.length === 0) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.status(200).json(meetings[0]);
  } catch (error) {
    console.error("Error fetching meeting by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the meeting" });
  }
});

// PUT Route to Update a Meeting
router.put("/:id", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { title, date, agenda, created_by } = req.body;
    const { id } = req.params;

    // Input Validation
    if (!title || !date || !agenda || !created_by) {
      console.log("Missing required fields for /meetings");
      return res.status(400).json({
        error: "Missing required fields: title, date, agenda, created_by",
      });
    }

    // Update Meeting in Database
    const [result] = await pool.query(
      "UPDATE meetings SET title = ?, date = ?, agenda = ?, created_by = ? WHERE id = ?",
      [title, date, agenda, created_by, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    console.log("Meeting updated successfully with ID:", id);
    res.status(200).json({ message: "Meeting updated successfully" });
  } catch (error) {
    console.error("Error updating meeting:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while updating the meeting" });
  }
});

// DELETE Route to Delete a Meeting
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete Meeting from Database
    const [result] = await pool.query("DELETE FROM meetings WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    console.log("Meeting deleted successfully with ID:", id);
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while deleting the meeting" });
  }
});

module.exports = router;
