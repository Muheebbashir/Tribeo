import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createStreamToken } from "../lib/stream.js";


export const getStreamToken = asyncHandler(async (req, res, next) => {
    const token=createStreamToken(req.user._id.toString());
    return res.status(200).json(new ApiResponse( { token }));
});