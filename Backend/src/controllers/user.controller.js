import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.model.js";

export const getRecommendedUsers = asyncHandler(async (req, res, next) => {
  // Logic to get recommended users
  const currentUserId = req.user._id;
  const currentUser = await User.findById(currentUserId);
  const recommendedUsers = await User.find({
    $and: [
      { _id: { $ne: currentUserId } },
      { _id: { $nin: currentUser.friends } },
      { isOnBoarded: true }
    ],
  }).limit(10);

  return res.status(200).json(new ApiResponse( { recommendedUsers }));
});

export const getFriendsList = asyncHandler(async (req, res, next) => {
  // Logic to get friends list
  const user = await User.findById(req.user._id).populate(
    "friends",
    "fullName profilePic nativeLanguage learningLanguages"
  );
    return res.status(200).json(new ApiResponse(  user.friends ));
});
