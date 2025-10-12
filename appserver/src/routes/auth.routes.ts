import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";

const r = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

r.post("/register", async (req, res) => {
  const { email, password } = LoginSchema.parse(req.body ?? {});
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists)
    return res
      .status(409)
      .json({ ok: false, error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName: email.split("@")[0] },
  });
  res.json({
    ok: true,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  });
});

r.post("/login", async (req, res) => {
  const { email, password } = LoginSchema.parse(req.body ?? {});
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({ ok: false, error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return res.status(401).json({ ok: false, error: "Invalid credentials" });

  const secret = process.env.JWT_SECRET || "devsecret";
  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "7d",
  });
  res.json({
    ok: true,
    token,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  });
});

r.get("/me", (req, res) => {
  // @ts-ignore
  const u = req.user;
  if (!u) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: u });
});

export default r;
