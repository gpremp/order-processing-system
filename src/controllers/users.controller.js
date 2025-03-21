const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const userService = require("../services/user.service.js");

/**
 * Register a new user.
 */
const registerUser = asyncHandler(async (req, res) => {
    const userData = req.body;
    const createdUser = await userService.registerUser(userData);

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

/**
 * Login a user.
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.loginUser(email, password);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

/**
 * Logout a user.
 */
const logoutUser = asyncHandler(async (req, res) => {
    await userService.logoutUser(req.user._id);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

/**
 * Refresh access token.
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    const { accessToken, refreshToken } = await userService.refreshAccessToken(incomingRefreshToken);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
            )
        );
});

/**
 * Change a user's password.
 */
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await userService.changeCurrentPassword(req.user._id, oldPassword, newPassword);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
};