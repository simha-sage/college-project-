import { Smile, Send } from "lucide-react";

const Message = ({ text, time, isMe }) => (
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
      <p className="text-[10px] opacity-70 mt-1 text-right">{time}</p>
    </div>
  </div>
);
const dummyMessages = [
  { id: 1, text: "Hey bro!", time: "10:00 AM", isMe: false },
  { id: 2, text: "Hello!", time: "10:01 AM", isMe: true },
  { id: 3, text: "How are you?", time: "10:02 AM", isMe: false },
  {
    id: 4,
    text: "I'm good. Working on chat UI 😄",
    time: "10:03 AM",
    isMe: true,
  },
  { id: 5, text: "Nice!", time: "10:04 AM", isMe: false },
];
const ChatWindow = ({ selectedUser }) => (
  <div className="flex-1 h-full flex flex-col p-6 relative">
    {/* Header*/}
    <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
          {selectedUser.charAt(0)}
        </p>
        <div>
          <h4 className="text-white font-bold">{selectedUser}</h4>
          <p className="text-green-400 text-xs">Online</p>
        </div>
      </div>
      <div className="flex gap-4 text-white/70"></div>
    </div>
    {/* Messages Area */}
    <div className="flex-1 overflow-y-auto py-8 space-y-4 px-4">
      {dummyMessages.map((msg) => (
        <Message key={msg.id} text={msg.text} time={msg.time} isMe={msg.isMe} />
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
      />
      <button className="bg-white/20 p-2 rounded-xl text-white">
        <Send size={20} />
      </button>
    </div>
  </div>
);
export default ChatWindow;
