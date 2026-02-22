// In your AuthContext.js
export const AuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL, { query: { userId: user._id } });
      setSocket(newSocket); // Store the actual socket instance here

      newSocket.on("getOnlineUsers", (users) => setOnlineUsers(users));

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, socket, onlineUsers }}>
      {children}
    </AuthContext.Provider>
  );
};
