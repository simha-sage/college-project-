import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client"; // Make sure to install socket.io-client

const API_URL = import.meta.env.VITE_server || "http://localhost:5000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null); // Add socket state

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Socket Logic: Connect when user exists, disconnect when they leave
  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL, {
        query: {
          userId: user._id,
        },
      });

      setSocket(newSocket);

      // Listen for the list of online users from the server
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkAuth,
        onlineUsers,
        setOnlineUsers,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
