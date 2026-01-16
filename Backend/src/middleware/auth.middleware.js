import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/ApiError.js";    

export const jwtVerify= asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new apiError(401, "Authentication token is missing");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
        throw new apiError(401, "User not found");
    }
    req.user = user;
    next();
});

