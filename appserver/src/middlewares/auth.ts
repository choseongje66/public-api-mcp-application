import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type JwtUser = { id: number; email?: string };

export function authOptional(req: Request, _res: Response, next: NextFunction) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return next();
  try {
    const payload = jwt.verify(token, secret) as JwtUser;
    // @ts-ignore
    req.user = payload;
  } catch {
    /* 무시하고 비로그인 취급 */
  }
  next();
}
