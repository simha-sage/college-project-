import { io } from "socket.io-client";
const API_URL = import.meta.env.VITE_server || "http://localhost:5000";

export const socket = io(API_URL, { withCredentials: true });
