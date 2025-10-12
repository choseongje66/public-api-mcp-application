import { Router } from "express";
import { LoginSchema } from "../schemas/auth.schema";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";

const r = Router();

// 간단 로그인(stub): 이메일/패스워드로 사용자 조회 or 생성 후 JWT 발급
r.post("/login", async (req, res) => {
  const { email, password } = LoginSchema.parse(req.body ?? {});
  // TODO: 비밀번호 해싱/검증(bcrypt) - 지금은 데모용으로 생략
  let user = await prisma.user.findFirst({ where: { email } });
  if (!user)
    user = await prisma.user.create({
      data: { email, displayName: email.split("@")[0] },
    });

  const secret = process.env.JWT_SECRET || "devsecret";
  const token = jwt.sign(
    { id: user.id, email: user.email ?? undefined },
    secret,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  });
});

r.get("/me", (req, res) => {
  // authOptional 미들웨어로 req.user가 있으면 반환
  // @ts-ignore
  const u = req.user;
  if (!u) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: u });
});

export default r;
