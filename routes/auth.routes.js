const { Router } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = Router();
//This Code for Authentication and Registration
// /api/auth/register
router.post(
  "/register",
  [
    check("email", "Invalid Email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid registration data",
        });
      }

      const { email, password, firstName, lastName, dateOfBirth } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with provided Email is alredy exist" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dateOfBirth,
      });
      await user.save();

      res.status(201).json({ message: "User successfully created" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something goes wrong,please try again" });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    check("email", "Please enter a valid Email").normalizeEmail().isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message:
            "Oops! The email or password you entered does not match our records. Please double-check and try again.",
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message:
            "Oops! The email or password you entered does not match our records. Please double-check and try again.",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message:
            "Oops! The email or password you entered does not match our records. Please double-check and try again.",
        });
      }

      const token = jwt.sign({ userid: user.id }, config.get("jwtSecret"), {
        expiresIn: "2h",
      });
      res.json({ token, userId: user.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something goes wrong,please try again" });
      console.log("Error", e);
    }
  }
);
module.exports = router;
