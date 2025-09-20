import { Router, Request, Response } from "express";
import pool from "../../db/pool";
import { clerkAuth } from "../middleware/clerkAuth";

const router = Router();

/**
 * ---------------------------
 * PROFILE
 * GET /api/users -> current user's profile
 * ---------------------------
 */
router.get("/", clerkAuth(), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).clerkId;

    const [rows] = await pool.query(
      "SELECT id, name, email, createdAt, updatedAt FROM `User` WHERE id = ?",
      [userId]
    );

    const user = (rows as any[])[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

/**
 * ---------------------------
 * WORKOUTS
 * GET /api/users/workouts -> workout history
 * ---------------------------
 */
router.get("/workouts", clerkAuth(), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).clerkId;

    const [rows] = await pool.query(
      "SELECT * FROM Workout WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: "No workouts found for this user" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching workouts:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

/**
 * ---------------------------
 * WORKOUTS - last
 * GET /api/users/last-workout -> most recent workout
 * ---------------------------
 */
router.get(
  "/last-workout",
  clerkAuth(),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).clerkId;

      const [rows] = await pool.query(
        "SELECT * FROM Workout WHERE userId = ? ORDER BY createdAt DESC LIMIT 1",
        [userId]
      );

      const workout = (rows as any[])[0];
      if (!workout) {
        return res
          .status(404)
          .json({ error: "No workouts found for this user" });
      }

      res.json(workout);
    } catch (err) {
      console.error("Error fetching last workout:", err);
      res.status(500).json({ error: "Database query failed" });
    }
  }
);

/**
 * ---------------------------
 * TEMPLATES
 * POST /api/users/templates -> create template
 * ---------------------------
 */
router.post("/templates", clerkAuth(), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).clerkId;
    const { name, exercises } = req.body;

    if (!name || !exercises) {
      return res.status(400).json({ error: "Name and exercises are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO Template (userId, name, exercises) VALUES (?, ?, ?)",
      [userId, name, JSON.stringify(exercises)]
    );

    const insertId = (result as any).insertId;
    const [rows] = await pool.query("SELECT * FROM Template WHERE id = ?", [
      insertId,
    ]);

    res.status(201).json((rows as any[])[0]);
  } catch (err) {
    console.error("Error inserting template:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

/**
 * ---------------------------
 * TEMPLATES
 * GET /api/users/templates -> fetch all templates
 * ---------------------------
 */
router.get("/templates", clerkAuth(), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).clerkId;

    const [rows] = await pool.query("SELECT * FROM Template WHERE userId = ?", [
      userId,
    ]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

export default router;
