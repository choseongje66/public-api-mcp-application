import { Router } from "express";
import convRoutes from "./conversation.routes";
import chatRoutes from "./chat.routes";
import authRoutes from "./auth.routes";

const api = Router();
api.use("/conversations", convRoutes);
api.use("/chat", chatRoutes);
api.use("/auth", authRoutes);
export default api;
