import { Router } from "express";
import {
  getConversations,
  postConversation,
  removeConversation,
  getMessages,
} from "../controllers/conversation.controller";

const r = Router();
r.get("/", getConversations);
r.post("/", postConversation);
r.delete("/:id", removeConversation);
r.get("/:id/messages", getMessages);
export default r;
