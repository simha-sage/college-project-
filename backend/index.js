import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/authRoutes.js";
import friendSuggestions from "./suggestions/friendSuggestion.js";
import crudFriends from "./friendOperations/crudFriends.js";
import sendMsg from "./messageAPIs/sendMsg.js";
import conversations from "./messageAPIs/conversations.js";
import getChats from "./messageAPIs/getChats.js";
import Conversation from "./models/conversation.js";

dotenv.config();

import { Server } from "socket.io";
import http from "http";
import Message from "./models/message.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join conversation room
  socket.on("joinChat", (conversationId) => {
    socket.join(conversationId);
  });

  // send message
  socket.on("sendMessage", async (data) => {
    const { conversationId, sender, text } = data;

    if (!text?.trim()) return;

    const msg = await Message.create({
      conversationId,
      sender,
      text,
    }).then((m) => m.populate("sender", "_id name"));

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    io.to(conversationId).emit("newMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/show", friendSuggestions);
app.use("/friend", crudFriends);
app.use("/message", sendMsg);
app.use("/convos", conversations);
app.use("/messages", getChats);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

server.listen(5000, () => {
  console.log("Server running");
});
