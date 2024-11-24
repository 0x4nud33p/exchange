import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { createPost } from "../controller/post.controller.js";
import { addComment } from "../controller/comment.controller.js";

const router = Router();

//protected-routes
router.post("/posts", verifyJWT, createPost);
router.post("/comments", verifyJWT, addComment);

export default router;
