import express from "express";
import { signup } from "../controllers/auth.controller.js";
import e from "express";

const router = express.Router();

router.route("/register").post(signup);

export default router;