import { Router } from "express";
import verifyJWT from '../middlewares/verifyJWT.js'
import { signIn, signUp } from "../controller/auth.controller.js";

const router = Router();

//authentication routes
router.post("/signup", signUp);
router.post("/signin", signIn);

export default router;
