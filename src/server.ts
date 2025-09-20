import express from "express";
import userRoutes from "./routes/userRoutes";
import templateRoutes from "./routes/templateRoutes";
import { requireAuth } from "@clerk/express";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhookRoutes from "./routes/clerkWebhooks";

const app = express();
app.use(express.json());

app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/protected", requireAuth(), (req, res) => {
  res.json({
    message: "You accessed a protected route 🎉",
    userId: (req as any).auth.userId,
  });
});

app.get("/ping", (_req, res) => {
  res.json({ message: "pong 🏓", time: new Date() });
});

app.use("/users", userRoutes);
app.use("/templates", templateRoutes);

app.use("/webhooks", express.json({ type: "*/*" }), clerkWebhookRoutes);

const PORT = Number(process.env.PORT) || 4000;
const HOST = "0.0.0.0"; // allow external devices to connect

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});
