import { Search } from "lucide-react";
import { useState, useEffect, use } from "react";
const ContactTemplete = ({
  friend,
  lastMessage,
  conversationId,
  setConversationId,
  selectedFriend,
  setSelectedFriend,
}) => (
  <div
    className="bg-white/10 p-4 rounded-2xl mb-4 border border-white/10 hover:bg-white/20 transition cursor-pointer flex"
    onClick={() => {
      setSelectedFriend(friend == selectedFriend ? {} : friend);
      setConversationId(conversationId);
    }}
  >
    <p className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-2xl">
      {friend.name.charAt(0)}
    </p>
    <div className="ml-4 flex-1">
      <p className="text-white text-sm font-medium">{friend.name}</p>
      <p className="text-white/50 text-xs truncate">{lastMessage}</p>
    </div>
  </div>
);
const ChatList = ({
  user,
  selectedFriend,
  setSelectedFriend,
  setConversationId,
}) => {
  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/convos/myConversations",
          {
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Fetch convo error:", err);
      }
    };

    fetchConvos();
  }, []);

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
            key={friend._id}
            friend={friend}
            lastMessage={"Say hello!"}
            conversationId={null}
            setConversationId={setConversationId}
            setSelectedFriend={setSelectedFriend}
            selectedFriend={selectedFriend}
          />
        ))}
      </section>
      <section>
        <h3 className="text-white font-semibold mb-4">Conversations</h3>
        {/* Map through your group data here */}
        {conversations.map((convo) => (
          <ContactTemplete
            key={convo._id}
            setConversationId={setConversationId}
            conversationId={convo._id}
            friend={convo.members.find((m) => m._id !== user._id)}
            lastMessage={convo.lastMessage}
            setSelectedFriend={setSelectedFriend}
            selectedFriend={selectedFriend}
          />
        ))}
      </section>
    </div>
  );
};
export default ChatList;
