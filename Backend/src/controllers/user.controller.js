import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";

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

export const sendFriendRequest = asyncHandler(async (req, res, next) => {
    const myId = req.user._id;
    const { id: friendId } = req.params;

    if (myId.toString() === friendId) {
        throw new apiError(400, "You cannot send a friend request to yourself");
    }
    const friend = await User.findById(friendId);
    if (!friend) {
        throw new apiError(404, "User not found");
    }
    if (friend.friends.includes(myId)) {
        throw new apiError(400, "You are already friends with this user");
    }

    const existingRequest = await FriendRequest.findOne({
        $or: [
            { sender: myId, recipient: friendId },
            { sender: friendId, recipient: myId }
        ]
    });
    if (existingRequest) {
        throw new apiError(400, "A friend request already exists between you and this user");
    }
    const friendRequest = new FriendRequest({
        sender: myId,
        recipient: friendId,
    });
    await friendRequest.save();
    return res.status(200).json(new ApiResponse(friendRequest));
});

export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
        throw new apiError(404, "Friend request not found");
    }
    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to accept this friend request");
    }
    friendRequest.status = "accepted";
    await friendRequest.save();
    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { friends: friendRequest.sender }
    });
    await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient }
    });
    return res.status(200).json(new ApiResponse("Friend request accepted successfully"));
});