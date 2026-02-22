import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import auth from "../middleware/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: process.env.PRODUCTION === "true",
      secure: process.env.PRODUCTION === "true",
      sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    });

    res.json({ msg: "Login success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: process.env.PRODUCTION === "true",
      secure: process.env.PRODUCTION === "true",
      sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    });

    res.json({ msg: "Signup success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: process.env.PRODUCTION === "true",
    sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    secure: process.env.PRODUCTION === "true",
  });

  res.json({ msg: "Logged out" });
});

export default router;
