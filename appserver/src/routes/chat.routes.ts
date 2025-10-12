import { Router } from "express";
import { postChatQuery } from "../controllers/chat.controller";

const r = Router();
r.post("/query", postChatQuery);
export default r;
