import ChatList from "./ChatList";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import SettingsList from "./SettingsList";
import UserList from "./UserList";
import NotificationList from "./NotificationList";
import { useState } from "react";

const Home = () => {
  const [selectedIcon, setSelectedIcon] = useState("messages");
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
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        )}
        {selectedIcon === "notifications" && <NotificationList />}
        {selectedIcon === "settings" && <SettingsList />}
        {selectedIcon === "users" && <UserList />}
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

export default Home;
