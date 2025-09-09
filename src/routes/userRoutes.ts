import { Router } from "express";
import pool from "../../db/pool";

const router = Router();

// fetch all users
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, createdAt, updatedAt FROM User"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// fetch single user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id, name, email, createdAt, updatedAt FROM User WHERE id = ?",
      [id]
    );
    const user = (rows as any[])[0];
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// fetch the most recent workout
router.get("/:id/last-workout", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Workout WHERE userId = ? ORDER BY createdAt DESC LIMIT 1",
      [id]
    );
    const workout = (rows as any[])[0];
    if (!workout)
      return res.status(404).json({ error: "No workouts found for this user" });
    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// create a new template
router.post("/:id/templates", async (req, res) => {
  try {
    const { id } = req.params; // user ID
    const { name, exercises } = req.body;

    if (!name || !exercises) {
      return res.status(400).json({ error: "Name and exercises are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO Template (userId, name, exercises) VALUES (?, ?, ?)",
      [id, name, JSON.stringify(exercises)]
    );

    const insertId = (result as any).insertId;
    const [rows] = await pool.query("SELECT * FROM Template WHERE id = ?", [
      insertId,
    ]);

    res.status(201).json((rows as any[])[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// fetch all templates for a user
router.get("/:id/templates", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM Template WHERE userId = ?", [
      id,
    ]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// fetch full workout history for a user
router.get("/:id/workouts", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Workout WHERE userId = ? ORDER BY createdAt DESC",
      [id]
    );

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "No workouts found for this user" });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

export default router;
