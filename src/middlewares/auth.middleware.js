const ApiError = require("../utils/ApiError");
const  asyncHandler  = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/user.model");

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user and exclude sensitive fields
        const user = await userSchema.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

module.exports = { verifyJWT };