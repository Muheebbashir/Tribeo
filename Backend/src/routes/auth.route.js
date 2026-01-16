import express from "express";
import { signupUser,loginUser,logoutUser,onBoardUser } from "../controllers/auth.controller.js";
import { jwtVerify } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/onboarding").post(jwtVerify,onBoardUser);
router.route("/me").get(jwtVerify, (req, res) => {
    return res.status(200).json({ user: req.user });
});

export default router;