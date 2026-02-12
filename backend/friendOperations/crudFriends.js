import express from "express";
import User from "../models/userModels.js";
import FriendRequest from "../models/friendRequest.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add/:userId", auth, async (req, res) => {
  try {
    const myId = req.user.id;
    const friendId = req.params.userId;

    if (myId === friendId)
      return res.status(400).json({ msg: "Cannot add yourself" });

    // check request exists
    const request = await FriendRequest.findOne({
      sender: friendId,
      receiver: myId,
      status: "pending",
    });

    if (!request) return res.status(400).json({ msg: "No request found" });

    // update both users
    await User.findByIdAndUpdate(myId, {
      $addToSet: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: myId },
    });

    request.status = "accepted";
    await request.save();

    res.json({ msg: "Friend added" });
  } catch (err) {
    res.status(500).json({ msg: "Error adding friend" });
  }
});

router.delete("/remove/:userId", auth, async (req, res) => {
  try {
    const myId = req.user.id;
    const friendId = req.params.userId;

    await User.findByIdAndUpdate(myId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: myId },
    });

    res.json({ msg: "Friend removed" });
  } catch {
    res.status(500).json({ msg: "Error removing friend" });
  }
});

router.post("/request/:userId", auth, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    if (senderId === receiverId)
      return res.status(400).json({ msg: "Cannot send to yourself" });

    // check already friends
    const sender = await User.findById(senderId);
    if (sender.friends.includes(receiverId))
      return res.status(400).json({ msg: "Already friends" });

    // check existing request
    const exists = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
      status: "pending",
    });

    if (exists) return res.status(400).json({ msg: "Request already exists" });

    // create request
    await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.json({ msg: "Request sent" });
  } catch {
    res.status(500).json({ msg: "Error sending request" });
  }
});

export default router;
