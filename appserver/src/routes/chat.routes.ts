import { Router } from "express";
import { authRequired } from "../middlewares/auth";
import { postChatQuery } from "../controllers/chat.controller";

const r = Router();
r.use(authRequired);
r.post("/query", postChatQuery);
export default r;
