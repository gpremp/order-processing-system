const userSchema = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger.js");

/**
 * Generate access and refresh tokens for a user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<{accessToken: string, refreshToken: string}>} - The generated tokens.
 */
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await userSchema.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        logger.error(`Error generating tokens for user ${userId}:`, error);
        throw new ApiError(500, "Failed to generate access and refresh tokens");
    }
};

/**
 * Register a new user.
 * @param {Object} userData - The user's data (name, email, password).
 * @returns {Promise<Object>} - The created user (without sensitive fields).
 */
const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Validate required fields
    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await userSchema.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    // Create new user
    const user = await userSchema.create({ name, email, password });

    // Fetch the created user without sensitive fields
    const createdUser = await userSchema.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Failed to register user");
    }

    return createdUser;
};

/**
 * Login a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>} - The logged-in user and tokens.
 */
const loginUser = async (email, password) => {
    // Validate required fields
    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Find user by email
    const user = await userSchema.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Fetch user without sensitive fields
    const loggedInUser = await userSchema.findById(user._id).select("-password -refreshToken");

    return { user: loggedInUser, accessToken, refreshToken };
};

/**
 * Logout a user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<void>}
 */
const logoutUser = async (userId) => {
    await userSchema.findByIdAndUpdate(
        userId,
        { $unset: { refreshToken: 1 } }, // Remove refreshToken
        { new: true }
    );
};

/**
 * Refresh access token.
 * @param {string} incomingRefreshToken - The refresh token.
 * @returns {Promise<{accessToken: string, refreshToken: string}>} - The new tokens.
 */
const refreshAccessToken = async (incomingRefreshToken) => {
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await userSchema.findById(decodedToken?._id);

        if (!user || incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        logger.error("Error refreshing access token:", error);
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
};

/**
 * Change a user's password.
 * @param {string} userId - The user's ID.
 * @param {string} oldPassword - The old password.
 * @param {string} newPassword - The new password.
 * @returns {Promise<void>}
 */
const changeCurrentPassword = async (userId, oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new passwords are required");
    }

    const user = await userSchema.findById(userId);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
};

module.exports = {
    generateAccessAndRefreshTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
};