import { Router } from "express";
import pool from "../../db/pool";

const router = Router();

// fetch a single template
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM Template WHERE id = ?", [
      id,
    ]);

    const template = (rows as any[])[0];

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

export default router;
