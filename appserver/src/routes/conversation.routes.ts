import { Router } from "express";
import { authRequired } from "../middlewares/auth";
import {
  getConversations,
  postConversation,
  removeConversation,
  getMessages,
} from "../controllers/conversation.controller";

const r = Router();
r.use(authRequired); // 이 라우터 전체 보호
r.get("/", getConversations);
r.post("/", postConversation);
r.delete("/:id", removeConversation);
r.get("/:id/messages", getMessages);
export default r;
