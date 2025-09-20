import { Request, Response, NextFunction } from "express";
import { requireAuth } from "@clerk/express";

export function clerkAuth() {
  return [
    requireAuth(),
    (req: Request, res: Response, next: NextFunction) => {
      const clerkId = (req as any).auth?.userId;
      if (!clerkId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      (req as any).clerkId = clerkId;
      next();
    },
  ];
}
