const express = require("express");
const router = express.Router();
const { login, logout, register, getUserProfile } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/profile/:role/:userId", getUserProfile);

module.exports = router;