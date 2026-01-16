import express from "express";
import { signupUser,loginUser,logoutUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/register").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;