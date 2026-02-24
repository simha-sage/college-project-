import React from "react";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_server || "http://localhost:5000";

const FriendRequestTemplate = ({
  name,
  email,
  profilePic,
  senderId,
  setRequests,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (type) => {
    setLoading(true);
    const endpoint = type === "accept" 
      ? `${API_URL}/friend/add/${senderId}` 
      : `${API_URL}/friend/delete/${senderId}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        // Optimistically remove from list
        setRequests((prev) => prev.filter((req) => req.sender._id !== senderId));
      }
    } catch (err) {
      console.error(`Error during ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl mb-3 border border-white/10 hover:bg-white/10 transition flex items-center group">
      {/* Profile Image / Fallback */}
      <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-white/20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {profilePic ? (
          <img
            src={profilePic}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-lg">
            {name?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info - min-w-0 and truncate prevents layout breaking */}
      <div className="ml-4 flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">
          {name}
        </p>
        {email && <p className="text-white/40 text-xs truncate">{email}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 ml-4">
        <button
          onClick={() => handleAction("accept")}
          disabled={loading}
          className="px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-green-900/20"
        >
          {loading ? "..." : "Accept"}
        </button>

        <button
          onClick={() => handleAction("reject")}
          disabled={loading}
          className="px-4 py-1.5 bg-white/10 hover:bg-red-500/20 hover:text-red-500 disabled:opacity-50 text-white/70 text-xs font-bold rounded-xl transition-all border border-white/10"
        >
          {loading ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

const AddFriendTemplate = ({ name, email, id, profilePic }) => {
  const [status, setStatus] = useState("add");

  const handleAdd = async () => {
    // Prevent multiple clicks
    if (status === "pending") return;

    setStatus("pending");
    try {
      const res = await fetch(`${API_URL}/friend/request/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      console.log("Friend request sent:", data);
    } catch (err) {
      console.error(err);
      setStatus("add"); // Re-enable if it fails
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl mb-3 border border-white/10 flex items-center hover:bg-white/10 transition-colors">
      {/* Profile Picture / Initials */}
      <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border border-white/20">
        {profilePic ? (
          <img
            src={profilePic}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-lg">
            {name?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* User Info */}
      <div className="ml-4 flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </p>
        <p className="text-white/40 text-xs truncate">{email}</p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAdd}
        disabled={status === "pending"}
        className={`ml-4 px-5 py-1.5 rounded-xl text-xs font-bold transition-all transform active:scale-95
          ${
            status === "pending"
              ? "bg-white/10 text-white/50 cursor-not-allowed border border-white/5"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
          }`}
      >
        {status === "pending" ? (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></span>
            Pending
          </span>
        ) : (
          "Add Friend"
        )}
      </button>
    </div>
  );
};

const UserList = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/friend/requests`, {
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
  }, [requests.length]);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`${API_URL}/show/suggestions`, {
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
            senderId={request.sender._id}
            email={request.sender.email}
            profilePic={request.sender.profilePic}
            requests={requests}
            setRequests={setRequests}
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
            profilePic={person.profilePic}
            id={person._id}
            email={person.email}
          />
        ))}
      </section>
    </div>
  );
};

export default UserList;
