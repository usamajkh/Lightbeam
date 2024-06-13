const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import your database connection module

// POST Route to Add an Event
router.post("/", async (req, res) => {
  try {
    console.log("Received request body for /events:", req.body);
    const { title, date, description, created_by } = req.body;

    // Input Validation
    if (!title || !date || !description || !created_by) {
      console.log("Missing required fields for /events");
      return res.status(400).json({
        error: "Missing required fields: title, date, description, created_by",
      });
    }

    // Insert Event into Database
    const [result] = await pool.query(
      "INSERT INTO event (title, date, description, created_by) VALUES (?, ?, ?, ?)",
      [title, date, description, created_by]
    );

    console.log("Event created successfully with ID:", result.insertId);
    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating event:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while creating the event" });
  }
});

// GET Route to Fetch All Events
router.get("/", async (req, res) => {
  try {
    const [events] = await pool.query("SELECT * FROM event"); // Changed to `event`
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "An error occurred while fetching events" });
  }
});

// GET Route to Fetch an Event by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [events] = await pool.query("SELECT * FROM event WHERE id = ?", [id]);
    if (events.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(events[0]);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the event" });
  }
});

// PUT Route to Update an Event
router.put("/:id", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { title, date, description, created_by } = req.body;
    const { id } = req.params;

    // Input Validation
    if (!title || !date || !description || !created_by) {
      console.log("Missing required fields for /events");
      return res.status(400).json({
        error: "Missing required fields: title, date, description, created_by",
      });
    }

    // Update Event in Database
    const [result] = await pool.query(
      "UPDATE event SET title = ?, date = ?, description = ?, created_by = ? WHERE id = ?",
      [title, date, description, created_by, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    console.log("Event updated successfully with ID:", id);
    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while updating the event" });
  }
});

// DELETE Route to Delete an Event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete Event from Database
    const [result] = await pool.query("DELETE FROM event WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    console.log("Event deleted successfully with ID:", id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while deleting the event" });
  }
});

module.exports = router;
