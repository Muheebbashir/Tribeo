import express from "express";
import { jwtVerify } from "../middleware/auth.middleware.js";
import { getRecommendedUsers, getFriendsList,sendFriendRequest,acceptFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();

router.use(jwtVerify);

router.route("/").get(getRecommendedUsers);
router.route("/friends").get(getFriendsList);
router.route("/friend-request/:id").post(sendFriendRequest); 
router.route("/friend-request/:id/accept").put(acceptFriendRequest);

export default router;