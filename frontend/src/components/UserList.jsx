import React from "react";
import { useState, useEffect } from "react";
const FriendRequestTemplate = ({ name, email, profilePic, id }) => {
  const onAccept = async () => {
    try {
      const res = await fetch(`http://localhost:5000/friend/add/${id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };
  const onDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/friend/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white/10 p-4 rounded-2xl mb-4 border border-white/10 hover:bg-white/20 transition flex items-center">
      {/* Avatar */}
      <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
        {name.charAt(0).toUpperCase()}
      </p>

      {/* User Info */}
      <div className="ml-4 flex-1">
        <p className="text-white text-sm font-medium">{name}</p>
        {email && <p className="text-white/50 text-xs">{email}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="px-3 py-1  bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Accept
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1  bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const AddFriendTemplate = ({ name, email, id }) => {
  const [status, setStatus] = useState("add");

  const handleAdd = async () => {
    setStatus("pending");
    try {
      const res = await fetch(`http://localhost:5000/friend/request/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
      setStatus("add");
    }
  };

  return (
    <div className="bg-white/10 p-4 rounded-2xl mb-4 border border-white/10 flex items-center">
      {/* dp */}
      <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
        {name.charAt(0).toUpperCase()}
      </p>

      <div className="ml-4 flex-1">
        <p className="text-white text-sm font-medium">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </p>
        <p className="text-white/50 text-xs">{email}</p>
      </div>

      <button
        onClick={handleAdd}
        disabled={status === "pending"}
        className={`px-4 py-1  rounded-lg text-white transition
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
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/friend/requests", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      console.log("Requests:", data);
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch("http://localhost:5000/show/suggestions", {
        method: "GET",
        credentials: "include", // ✅ send cookie
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      console.log("Suggestions:", data);

      return data;
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };
  useEffect(() => {
    const load = async () => {
      const data = await fetchSuggestions();
      if (data) setSuggestions(data);
    };

    load();
  }, []);

  return (
    <div className="w-1/3 h-full p-6 overflow-y-auto bg-white/5 backdrop-blur-sm border-r border-white/10">
      <section>
        <h3 className="text-white font-semibold mb-4">Friend Requests</h3>
        {/* Map through your group data here */}
        {requests.map((request) => (
          <FriendRequestTemplate
            key={request._id}
            name={request.sender.name}
            id={request.sender._id}
            email={request.sender.email}
            profilePic={request.sender.profilePic}
          />
        ))}
      </section>
      <section>
        <h3 className="text-white font-semibold mb-4">Add new friends</h3>
        {/* Map through your group data here */}
        {suggestions.map((person) => (
          <AddFriendTemplate
            key={person._id}
            name={person.name}
            id={person._id}
            email={person.email}
          />
        ))}
      </section>
    </div>
  );
};

export default UserList;
