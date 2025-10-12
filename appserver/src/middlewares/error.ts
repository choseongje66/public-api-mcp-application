import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[server error]", err);
  if (err?.issues) {
    return res
      .status(400)
      .json({ ok: false, error: "Invalid request", details: err.issues });
  }
  res.status(500).json({ ok: false, error: "Internal Server Error" });
}
