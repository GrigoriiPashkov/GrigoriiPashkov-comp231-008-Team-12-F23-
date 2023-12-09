const { Router } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../middlware/auth.middleware");
const router = Router();

// GET /api/user/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});
router.put("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, dateOfBirth } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});
module.exports = router;
