import { Router } from "express";
import pool from "../../db/pool";

const router = Router();

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

export default router;
