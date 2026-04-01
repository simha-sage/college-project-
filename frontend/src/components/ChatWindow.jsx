import { Smile, Send, Sparkles } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import EmojiPicker from "emoji-picker-react";

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
  const [showToneMenu, setShowToneMenu] = useState(false);

  const tones = [
    { label: "Brief", value: "short", icon: "📏" },
    { label: "Professional", value: "professional", icon: "💼" },
    { label: "Funny", value: "funny", icon: "😂" },
    { label: "Casual", value: "casual", icon: "✌️" },
  ];

  const handleToneChange = async (selectedTone) => {
    if (!text.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/ai/refineTone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      // In our backend, we called the field 'refinedText'
      setText(data.refinedText);
      setShowToneMenu(false);
    } catch (err) {
      console.error("Tone change failed:", err);
      // Optional: Show a small toast or error message to the user
    }
  };

  const toneMenuRef = useRef(null); // 1. Create the ref

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 2. Check if the menu is open and if the click was OUTSIDE the menu
      if (toneMenuRef.current && !toneMenuRef.current.contains(event.target)) {
        setShowToneMenu(false);
      }
    };

    // 3. Attach the listener to the whole document
    document.addEventListener("mousedown", handleClickOutside);

    // 4. Cleanup when the component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showToneMenu]); // Re-run when state changes

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    // Optional: Keep picker open or close it
    // setShowEmojiPicker(false);
  };
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const { user, socket, onlineUsers } = useContext(AuthContext);

  // Derive online status
  const isOnline = onlineUsers?.includes(selectedFriend?._id);

  const fetchSuggestions = async (lastMessage, isOwnMessage) => {
    try {
      const response = await fetch(`${API_URL}/ai/generate-replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: lastMessage, isOwnMessage }),
      });
      const data = await response.json();
      setSuggestions(data); // Assuming you have a state for suggestions
      console.log("AI Suggestions:", data);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    }
  };
  useEffect(() => {
    console.log(messages);
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender._id === user._id) {
      fetchSuggestions(lastMsg.text, true);
    } else {
      fetchSuggestions(lastMsg.text, false);
    }
  }, [messages]);

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
  const sendMsg = (msg) => {
    let messageToSend = msg || text;
    if (!messageToSend.trim() || !socket) return;

    socket.emit("sendMessage", {
      conversationId,
      sender: user._id,
      text: messageToSend,
    });
    setText("");
  };

  return (
    <div className="flex-1 h-full flex flex-col p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-white/20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {selectedFriend?.profilePic ? (
                <img
                  src={selectedFriend.profilePic}
                  alt={selectedFriend.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {selectedFriend?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
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
      <div className="mt-auto flex flex-col gap-3 relative">
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-20 left-0 z-50 shadow-2xl animate-in fade-in slide-in-from-bottom-4"
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={onEmojiClick}
              autoFocusSearch={false}
              width={300}
              height={400}
            />
          </div>
        )}
        {/* AI Suggestions Bar */}
        {suggestions.length > 0 && (
          <div className="flex gap-2 px-2 overflow-x-auto no-scrollbar animate-fade-in">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  // Logic: Set the text and immediately trigger send
                  sendMsg(suggestion);
                  setSuggestions([]); // Clear after clicking
                }}
                className="whitespace-nowrap bg-white/10 border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-sm hover:bg-white/20 hover:border-white/40 transition-all active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Your Original Input Bar */}
        <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/20 shadow-lg backdrop-blur-sm">
          {showToneMenu && (
            <div
              ref={toneMenuRef}
              className="absolute bottom-16 right-0 bg-zinc-900 border border-white/20 rounded-xl p-2 flex flex-col gap-1 shadow-2xl z-50"
            >
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleToneChange(t.value)}
                  className="text-white/80 hover:bg-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          )}
          <Smile
            size={20}
            className={`${showEmojiPicker ? "text-yellow-400" : "text-white/70"} cursor-pointer hover:text-white transition-colors`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          <input
            className="flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
            placeholder="Type your message here..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.length > 0) setSuggestions([]); // Hide AI when user types
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
          />
          {/* The Tone Changer Trigger */}
          {text.length > 3 && (
            <Sparkles
              size={20}
              className={`cursor-pointer transition-colors ${showToneMenu ? "text-yellow-400" : "text-white/50 hover:text-white"}`}
              onClick={() => setShowToneMenu(!showToneMenu)}
            />
          )}
          <button
            className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-colors"
            onClick={() => sendMsg()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
