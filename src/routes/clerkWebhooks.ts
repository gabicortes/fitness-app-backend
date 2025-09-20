import { Router } from "express";
import pool from "../../db/pool";

const router = Router();

router.post("/clerk", async (req, res) => {
  const event = req.body;

  try {
    if (event.type === "user.created") {
      const { id, email_addresses, first_name, last_name } = event.data;

      const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();
      const email = email_addresses[0]?.email_address;

      await pool.query(
        "INSERT INTO User (id, name, email, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
        [id, name, email]
      );

      console.log(`✅ Synced user ${id} into DB`);
    }

    if (event.type === "user.deleted") {
      const { id } = event.data;

      await pool.query("DELETE FROM User WHERE id = ?", [id]);

      console.log(`🗑️ Deleted user ${id} from DB`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ error: "Webhook handling failed" });
  }
});

export default router;
