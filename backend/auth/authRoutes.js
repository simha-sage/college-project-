import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import auth from "../middleware/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

import { upload } from "../cloudinary.js";

router.put(
  "/updateProfile",
  auth,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { name, bio, gender, password } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Use an object to track only fields that are actually sent
      const updateData = {};
      if (name) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio; // bio can be an empty string
      if (gender) updateData.gender = gender;

      // 1. Handle Cloudinary/Local Image
      if (req.file) {
        updateData.profilePic = req.file.path;
      }

      // 2. Hash password only if it's new and not empty
      if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      // 3. Update Database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true },
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

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
      httpOnly: true,
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
      httpOnly: true,
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
    httpOnly: true,
    sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    secure: process.env.PRODUCTION === "true",
  });

  res.json({ msg: "Logged out" });
});

export default router;
