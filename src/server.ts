import express from "express";
import userRoutes from "./routes/userRoutes";
import templateRoutes from "./routes/templateRoutes";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", userRoutes);
app.use("/templates", templateRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
