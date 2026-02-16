import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return user ? <Home /> : <AuthForm />;
}

export default App;
