import { Smile, Send } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
const API_URL = import.meta.env.VITE_server || "http://localhost:5000";

import { useRef } from "react";

const ChatContainer = ({ messages, user }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto py-8 space-y-4 px-4">
      {messages.map((msg) => (
        <Message
          key={msg._id}
          text={msg.text}
          time={msg.createdAt}
          isMe={msg?.sender?._id.toString() === user._id}
        />
      ))}

      {/* 1. This empty div acts as the anchor for the bottom */}
      <div ref={scrollRef} />
    </div>
  );
};

const Message = ({ text, time, isMe }) => {
  const formattedTime = new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm
        ${
          isMe
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-white/10 text-white rounded-bl-md"
        }`}
      >
        <p>{text}</p>
        <p className="text-[10px] opacity-70 mt-1 text-right">
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

const ChatWindow = ({ selectedFriend, conversationId }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const { user, socket, onlineUsers } = useContext(AuthContext);

  // Derive online status
  const isOnline = onlineUsers?.includes(selectedFriend?._id);

  // 1. Join conversation room
  useEffect(() => {
    if (conversationId && socket) {
      socket.emit("joinChat", conversationId);
    }
  }, [conversationId, socket]);

  // 2. Fetch message history
  useEffect(() => {
    const fetchMsgs = async () => {
      if (!conversationId) return;
      try {
        const res = await fetch(`${API_URL}/messages/${conversationId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchMsgs();
  }, [conversationId]);

  // 3. Listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, socket]);

  // 4. Send message handler
  const sendMsg = () => {
    if (!text.trim() || !socket) return;

    socket.emit("sendMessage", {
      conversationId,
      sender: user._id,
      text: text,
    });
    setText("");
  };

  return (
    <div className="flex-1 h-full flex flex-col p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
              {selectedFriend?.name?.charAt(0)}
            </p>
            {/* Online indicator dot */}
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"></span>
            )}
          </div>
          <div>
            <h4 className="text-white font-bold">{selectedFriend?.name}</h4>
            <p
              className={`${isOnline ? "text-green-400" : "text-white/40"} text-xs uppercase tracking-wider`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ChatContainer messages={messages} user={user} />

      {/* Input Area */}
      <div className="mt-auto flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/20">
        <Smile
          size={20}
          className="text-white/70 cursor-pointer hover:text-white"
        />
        <input
          className="flex-1 bg-transparent text-white outline-none"
          placeholder="Type your message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        />
        <button
          className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-colors"
          onClick={sendMsg}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
