import express from "express";
import User from "../models/userModels.js";
import FriendRequest from "../models/friendRequest.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/suggestions", auth, async (req, res) => {
  try {
    const myId = req.user.id;

    // Me
    const me = await User.findById(myId);

    // Friends list
    const friendsIds = me.friends || [];

    // Pending requests
    const pending = await FriendRequest.find({
      $or: [{ sender: myId }, { receiver: myId }],
      status: "pending",
    });

    const pendingIds = pending.map((r) =>
      r.sender.toString() === myId ? r.receiver : r.sender,
    );

    // Exclude list
    const excludeIds = [myId, ...friendsIds, ...pendingIds];

    // Query suggestions
    const users = await User.find({
      _id: { $nin: excludeIds },
    })
      .select("name email profilePic")
      .limit(30);

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error loading users" });
  }
});

export default router;
