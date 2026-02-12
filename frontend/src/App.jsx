import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Home from "./components/home";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthForm />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
