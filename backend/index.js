import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./auth/authRoutes.js";
import friendSuggestions from "./suggestions/friendSuggestion.js";
import crudFriends from "./friendOperations/crudFriends.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/auth", authRoutes);
app.use("/show", friendSuggestions);
app.use("/friend", crudFriends);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.listen(5000, () => console.log("Server running on 5000"));
