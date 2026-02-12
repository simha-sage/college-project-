import React from "react";
import { useState } from "react";
const FriendRequestTemplate = ({ name, mutual = "", onAccept, onDelete }) => (
  <div className="bg-white/10 p-4 rounded-2xl mb-4 border border-white/10 hover:bg-white/20 transition flex items-center">
    {/* Avatar */}
    <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
      {name.charAt(0)}
    </p>

    {/* User Info */}
    <div className="ml-4 flex-1">
      <p className="text-white text-sm font-medium">{name}</p>
      {mutual && <p className="text-white/50 text-xs">{mutual}</p>}
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <button
        onClick={onAccept}
        className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg"
      >
        Accept
      </button>

      <button
        onClick={onDelete}
        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg"
      >
        Delete
      </button>
    </div>
  </div>
);

const AddFriendTemplate = ({ name, mutual = "", onAdd }) => {
  const [status, setStatus] = useState("add");

  const handleAdd = () => {
    setStatus("pending");
    onAdd && onAdd();
  };

  return (
    <div className="bg-white/10 p-4 rounded-2xl mb-4 border border-white/10 flex items-center">
      {/* dp */}
      <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
        {name.charAt(0)}
      </p>

      <div className="ml-4 flex-1">
        <p className="text-white text-sm font-medium">{name}</p>
        {mutual && <p className="text-white/50 text-xs">{mutual}</p>}
      </div>

      <button
        onClick={handleAdd}
        disabled={status === "pending"}
        className={`px-4 py-1 text-xs rounded-lg text-white transition
          ${
            status === "pending"
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
      >
        {status === "pending" ? "Pending" : "Add"}
      </button>
    </div>
  );
};

const UserList = ({ chats }) => {
  return (
    <div className="w-1/3 h-full p-6 overflow-y-auto bg-white/5 backdrop-blur-sm border-r border-white/10">
      <section>
        <h3 className="text-white font-semibold mb-4">Friend Requests</h3>
        {/* Map through your group data here */}
        {chats.map((chat) => (
          <FriendRequestTemplate
            key={chat.name}
            name={chat.name}
            lastMessage={chat.lastMessage}
            time={chat.time}
          />
        ))}
      </section>
      <section>
        <h3 className="text-white font-semibold mb-4">Add new friends</h3>
        {/* Map through your group data here */}
        {chats.map((chat) => (
          <AddFriendTemplate
            key={chat.name}
            name={chat.name}
            lastMessage={chat.lastMessage}
            time={chat.time}
          />
        ))}
      </section>
    </div>
  );
};

export default UserList;
