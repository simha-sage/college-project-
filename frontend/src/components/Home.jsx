import ChatList from "./ChatList";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import SettingsList from "./SettingsList";
import UserList from "./UserList";
import NotificationList from "./NotificationList";
import { useState } from "react";

export const Home = () => {
  const [selectedIcon, setSelectedIcon] = useState("messages");
  const dummyChats = [
    { name: "Alice", lastMessage: "Hey, how are you?", time: "2:30 PM" },
    { name: "Bob", lastMessage: "Let's catch up later.", time: "1:15 PM" },
    { name: "Charlie", lastMessage: "Did you see the game?", time: "12:00 PM" },
  ];
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <>
      <div className="bg-black flex h-screen">
        <Sidebar
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
        {selectedIcon === "messages" && (
          <ChatList
            chats={dummyChats}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        )}
        {selectedIcon === "notifications" && <NotificationList />}
        {selectedIcon === "settings" && <SettingsList />}
        {selectedIcon === "users" && <UserList chats={dummyChats} />}
        {selectedUser !== null ? (
          <ChatWindow selectedUser={selectedUser} />
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
