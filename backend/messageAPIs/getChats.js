import express from "express";
import auth from "../middleware/auth.js";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const router = express.Router();

router.get("/:conversationId", auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const myId = req.user.id;

    console.log("Fetching messages:", conversationId);
    const convo = await Conversation.findById(conversationId);

    if (!convo) return res.status(404).json({ msg: "Conversation not found" });

    if (!convo.members.includes(myId))
      return res.status(403).json({ msg: "Not allowed" });

    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const msgs = await Message.find({
      conversationId,
    })
      .populate("sender", "name profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(msgs.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching messages" });
  }
});

export default router;
