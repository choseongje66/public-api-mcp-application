import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type JwtUser = { id: number; email: string };

export function authOptional(req: Request, _res: Response, next: NextFunction) {
  const raw = req.headers.authorization || "";
  const token = raw.replace(/^Bearer\s+/i, "");
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return next();
  try {
    const payload = jwt.verify(token, secret) as JwtUser;
    // @ts-ignore
    req.user = payload;
  } catch {}
  next();
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (!req.user)
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  next();
}
