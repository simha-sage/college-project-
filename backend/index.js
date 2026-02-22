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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} is online.`);
  }

  // 3. Tell everyone who is currently online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("joinChat", (conversationId) => {
    socket.join(conversationId);
  });

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
    // 4. Clean up the map when they leave
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User ${userId} went offline.`);
      // 5. Broadcast the updated list
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
