import express from "express";
import auth from "../middleware/auth.js";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const router = express.Router();

router.get("/myConversations", auth, async (req, res) => {
  try {
    const myId = req.user.id;
    const convos = await Conversation.find({
      members: myId,
    })
      .populate("members", "name profilePic email")
      .sort({ lastMessageAt: -1 })
      .limit(20);
    res.json(convos);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch conversations" });
  }
});

export default router;
