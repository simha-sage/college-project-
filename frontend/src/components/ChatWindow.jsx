import { Smile, Send } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";

import { socket } from "../socket";


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
  const { user } = useContext(AuthContext);

  useEffect(()=>{
  if(conversationId){
    socket.emit("joinChat", conversationId);
  }
},[conversationId]);

useEffect(()=>{
  socket.on("newMessage",(msg)=>{
    setMessages(prev => [...prev,msg]);
  });

  return ()=>{
    socket.off("newMessage");
  };
},[]);



  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        console.log("Fetching messages for convo with", conversationId);
        const res = await fetch(
          `http://localhost:5000/messages/${conversationId}`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        console.log(
          "Fetched messages for convo with",
          selectedFriend.name,
          ":",
          data,
        );
        console.log(data);
        setMessages(data);
      } catch (err) {
        console.error("Fetch convo error:", err);
      }
    };

    fetchMsgs();
  }, []);
  const sendMsg = async () => {
    socket.emit("sendMessage",{
    conversationId,
    sender:user._id,
    text:text
  });
  setText("");
  };

  return (
    <div className="flex-1 h-full flex flex-col p-6 relative">
      {/* Header*/}
      <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
            {selectedFriend?.name.charAt(0)}
          </p>
          <div>
            <h4 className="text-white font-bold">{selectedFriend?.name}</h4>
            <p className="text-green-400 text-xs">Online</p>
          </div>
        </div>
        <div className="flex gap-4 text-white/70"></div>
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-8 space-y-4 px-4">
        
        {messages.map((msg) => (
          <Message
            key={msg._id}
            text={msg.text}
            time={msg.createdAt}
            isMe={msg?.sender?._id.toString() === user._id}
          />
        ))}
      </div>

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
        />
        <button
          className="bg-white/20 p-2 rounded-xl text-white"
          onClick={() => sendMsg()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
export default ChatWindow;
