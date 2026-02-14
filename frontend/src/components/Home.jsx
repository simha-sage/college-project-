import ChatList from "./ChatList";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import SettingsList from "./SettingsList";
import UserList from "./UserList";
import NotificationList from "./NotificationList";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const Home = () => {
  const [selectedFriend, setSelectedFriend] = useState({});
  const [selectedIcon, setSelectedIcon] = useState("messages");
  const [conversationId, setConversationId] = useState(null);
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="bg-black flex h-screen">
        <Sidebar
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
        {selectedIcon === "messages" && (
          <ChatList
            user={user}
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
            conversationId={conversationId}
            setConversationId={setConversationId}
          />
        )}
        {selectedIcon === "notifications" && <NotificationList />}
        {selectedIcon === "settings" && <SettingsList />}
        {selectedIcon === "users" && <UserList />}
        {Object.keys(selectedFriend).length > 0 ? (
          <ChatWindow
            selectedFriend={selectedFriend}
            conversationId={conversationId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white">
            <h2 className="text-2xl font-semibold">
              Tap a contact to start messaging
            </h2>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
