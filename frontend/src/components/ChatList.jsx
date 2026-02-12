import { Search } from "lucide-react";
import { useState, useEffect } from "react";
const ContactTemplete = ({
  name,
  lastMessage,
  time,
  setSelectedUser,
  selectedUser,
}) => (
  <div
    className="bg-white/10 p-4 rounded-2xl mb-4 border border-white/10 hover:bg-white/20 transition cursor-pointer flex"
    onClick={() => setSelectedUser(name == selectedUser ? null : name)}
  >
    <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
      {name.charAt(0)}
    </p>
    <div className="ml-4 flex-1">
      <p className="text-white text-sm font-medium">{name}</p>
      <p className="text-white/50 text-xs truncate">{lastMessage}</p>
    </div>
  </div>
);
const ChatList = ({ setSelectedUser, selectedUser }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("http://localhost:5000/friend/friends", {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setFriends([]);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="w-1/3 h-full p-6 overflow-y-auto bg-white/5 backdrop-blur-sm border-r border-white/10">
      <div className="relative mb-6">
        <input
          className="w-full bg-white/10 rounded-xl py-2 px-10 text-white placeholder-white/40 focus:outline-none"
          placeholder="Search"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
      </div>

      <section>
        <h3 className="text-white font-semibold mb-4">Friends</h3>
        {/* Map through your group data here */}
        {friends.map((friend) => (
          <ContactTemplete
            key={friend.name}
            name={friend.name}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        ))}
      </section>
    </div>
  );
};
export default ChatList;
