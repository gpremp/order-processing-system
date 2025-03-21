const express = require('express');
const router = express.Router();
const {verifyJWT} = require('../middlewares/auth.middleware')
const {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword} = require('../controllers/users.controller');

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

module.exports = router;