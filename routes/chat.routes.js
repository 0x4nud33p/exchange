import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { saveMessage, getMessages } from "../controller/chat.controller.js";

const router = express.Router();

//chat-service with protected-routes
router.post("/saveMessage", verifyJWT, saveMessage);
router.get("/getMessages", verifyJWT, getMessages);

export default router;
