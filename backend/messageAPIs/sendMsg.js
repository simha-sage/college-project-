import express from "express";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/:receiverId", auth, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;
    const { text } = req.body;

    if (!text) return res.status(400).json({ msg: "Text required" });

    let convo = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const message = await Message.create({
      conversationId: convo._id,
      sender: senderId,
      text,
    });

    convo.lastMessage = text;
    convo.lastMessageAt = new Date();
    await convo.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ msg: "Send failed" });
  }
});

export default router;
