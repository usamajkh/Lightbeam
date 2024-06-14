const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import your database connection module

// POST Route to Add a Canteen Menu
router.post("/", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { date, menu } = req.body;

    // Input Validation
    if (!date || !menu) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ error: "Missing required fields: date, menu" });
    }

    // Insert Canteen Menu into Database
    const [result] = await pool.query(
      "INSERT INTO canteen_menu (date, menu) VALUES (?, ?)",
      [date, menu]
    );

    console.log("Canteen menu created successfully with ID:", result.insertId);
    res.status(201).json({
      message: "Canteen menu created successfully",
      menuId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating canteen menu:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while creating the canteen menu" });
  }
});

// GET Route to Fetch All Canteen Menus
router.get("/", async (req, res) => {
  try {
    const [canteenMenus] = await pool.query("SELECT * FROM canteen_menu");
    res.status(200).json(canteenMenus);
  } catch (error) {
    console.error("Error fetching canteen menus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching canteen menus" });
  }
});

// GET Route to Fetch a Canteen Menu by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [canteenMenus] = await pool.query(
      "SELECT * FROM canteen_menu WHERE id = ?",
      [id]
    );
    if (canteenMenus.length === 0) {
      return res.status(404).json({ error: "Canteen menu not found" });
    }
    res.status(200).json(canteenMenus[0]);
  } catch (error) {
    console.error("Error fetching canteen menu by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the canteen menu" });
  }
});

// PUT Route to Update a Canteen Menu
router.put("/:id", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { date, menu } = req.body;
    const { id } = req.params;

    // Input Validation
    if (!date || !menu) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ error: "Missing required fields: date, menu" });
    }

    // Update Canteen Menu in Database
    const [result] = await pool.query(
      "UPDATE canteen_menu SET date = ?, menu = ? WHERE id = ?",
      [date, menu, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Canteen menu not found" });
    }

    console.log("Canteen menu updated successfully with ID:", id);
    res.status(200).json({ message: "Canteen menu updated successfully" });
  } catch (error) {
    console.error("Error updating canteen menu:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while updating the canteen menu" });
  }
});

// DELETE Route to Delete a Canteen Menu
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete Canteen Menu from Database
    const [result] = await pool.query("DELETE FROM canteen_menu WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Canteen menu not found" });
    }

    console.log("Canteen menu deleted successfully with ID:", id);
    res.status(200).json({ message: "Canteen menu deleted successfully" });
  } catch (error) {
    console.error("Error deleting canteen menu:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "An error occurred while deleting the canteen menu" });
  }
});

module.exports = router;
