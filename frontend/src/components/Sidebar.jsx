import { UserPlus, Bell, MessageSquare, Settings, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useState } from "react";
const Sidebar = ({ selectedIcon, setSelectedIcon }) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="w-20 h-full flex flex-col items-center py-8 bg-white/10 backdrop-blur-md border-r border-white/20">
      <div className="relative mb-10">
        <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
          {user?.name.charAt(0).toUpperCase() || "U"}
        </p>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
      </div>
      <div className="flex flex-col gap-8 text-white/60">
        <button
          className={`hover:text-white px-2 ${selectedIcon === "messages" ? "text-blue-500 bg-white/20 p-2 rounded-lg" : ""}`}
          onClick={() => setSelectedIcon("messages")}
        >
          <MessageSquare size={24} strokeWidth={1.5} />
        </button>
        <button
          className={`hover:text-white px-2 ${selectedIcon === "notifications" ? "text-blue-500 bg-white/20 p-2 rounded-lg" : ""}`}
          onClick={() => setSelectedIcon("notifications")}
        >
          <Bell size={24} strokeWidth={1.5} />
        </button>
        <button
          className={`hover:text-white px-2 ${selectedIcon === "users" ? "text-blue-500 bg-white/20 p-2 rounded-lg" : ""}`}
          onClick={() => setSelectedIcon("users")}
        >
          <UserPlus size={24} strokeWidth={1.5} />
        </button>
        <button
          className={`hover:text-white px-2 ${selectedIcon === "settings" ? "text-blue-500 bg-white/20 p-2 rounded-lg" : ""}`}
          onClick={() => setSelectedIcon("settings")}
        >
          <Settings size={24} strokeWidth={1.5} />
        </button>
      </div>
      <button
        className="mt-auto text-white/60 hover:text-red-400"
        onClick={() => window.confirm("Are you sure you want to log out?")}
      >
        <LogOut size={24} strokeWidth={1.5} />
      </button>
    </div>
  );
};
export default Sidebar;
