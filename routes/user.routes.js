import { Router } from "express";
import verifyJWT from '../middlewares/verifyJWT.js'
import { signIn, signUp } from "../controller/auth.controller.js";
import { createPost, getPosts } from "../controller/post.controller.js";
import { addComment } from "../controller/comment.controller.js";

const router = Router();

//authentication-routes
router.post("/signup", signUp);
router.post("/signin", signIn);

//protected-routes
router.post("/posts",verifyJWT,createPost);
router.post("/comments",verifyJWT, addComment);

//public-routes
router.get("/posts", getPosts);

export default router;
