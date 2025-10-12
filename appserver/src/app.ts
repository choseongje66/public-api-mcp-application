import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error";
import api from "./routes";
import { authOptional } from "./middlewares/auth";

export function buildApp() {
  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use(authOptional); // 헤더에 토큰 있으면만 사용자 주입
  app.use(api); // /conversations, /chat, /auth

  app.use(errorHandler); // 항상 JSON 에러
  return app;
}
