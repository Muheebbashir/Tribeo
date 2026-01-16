import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export const signupUser = asyncHandler(async (req, res,next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    throw new apiError(400, "Full name, email, and password are required");
  }
  if (password.length < 6) {
    throw new apiError(400, "Password must be at least 6 characters long");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new apiError(400, "Invalid email format");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new apiError(400, "Email is already in use");
  }
  const index = Math.floor(Math.random() * 100) + 1;
  const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
  const newUser = await User.create({
    fullName,
    email,
    password,
    profilePic: randomAvatar,
  });

  await upsertStreamUser({
    id: newUser._id.toString(),
    name: newUser.fullName,
    image: newUser.profilePic || ""
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxage: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(201).json(new ApiResponse(201,"User registered successfully", { token, newUser }));
    
});

export const loginUser = asyncHandler(async (req, res,next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new apiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(401, "Invalid email or password");
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new apiError(401, "Invalid email or password");
  }

   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxage: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json(new ApiResponse(200,"User logged in successfully", { token, user }));

});

export const logoutUser = asyncHandler(async (req, res,next) => {
  res.clearCookie("jwt");
  return res.status(200).json(new ApiResponse(200,"User logged out successfully"));
});
