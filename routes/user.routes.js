import { Router } from "express";
import verifyJWT from '../middlewares/verifyJWT.js'
import { signIn, signUp } from "../controller/auth.controller.js";
import { getPosts } from "../controller/post.controller.js";


const router = Router();

//authentication-routes
router.post("/signup", signUp);
router.post("/signin", signIn);

//public-routes
router.get("/posts", getPosts);

export default router;
