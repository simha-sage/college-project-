import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
const API_URL = import.meta.env.VITE_server || "http://localhost:5000";

export default function AuthForm() {
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState("");
  const [signUpEmail, setSignupEmail] = useState("");
  const [signUpPass, setSignupPass] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const signIn = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      window.location.href = "/";
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };
  const signUp = async (email, password, name) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      console.log(email, password, name);
      const data = await res.json();
      window.location.href = "/";
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const validate = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return "Invalid email";

    if (password.length < 6) return "Password must be 6+ chars";

    return "";
  };

  const handleLogin = () => {
    const err = validate(email, password);
    if (err) {
      setError(err);
      return;
    }

    setError("");
    signIn(email, password);
  };
  const handleSignup = () => {
    const err = validate(signUpEmail, signUpPass);
    if (err) {
      setError(err);
      return;
    }

    setError("");
    signUp(signUpEmail, signUpPass, name);
  };
  return (
    <div className="h-screen flex justify-center items-center bg-linear-to-br from-gray-900 via-black to-gray-900">
      <div className="relative w-200 h-125 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        {/* FORMS */}
        <div className="flex h-full text-white">
          {/* SIGN IN */}
          <div className="w-1/2 flex flex-col justify-center px-16">
            <h2 className="text-3xl font-bold mb-6">Sign In</h2>

            {/* Email */}
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 px-4 py-2 rounded bg-white/20 outline-none text-white"
            />

            {/* Password */}
            <div className="relative mb-3">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/20 outline-none text-white"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-white/70"
              >
                {!showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

            {/* Button */}
            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-600 py-2 rounded-full text-white"
            >
              SIGN IN
            </button>
          </div>

          {/* SIGN UP */}
          <div className="w-1/2 flex flex-col justify-center px-16">
            <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
            <input
              placeholder="Name"
              className="mb-3 px-4 py-2 rounded bg-white/20 outline-none"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            {/* Email */}
            <input
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="mb-3 px-4 py-2 rounded bg-white/20 outline-none text-white"
            />

            {/* Password */}
            <div className="relative mb-3">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={signUpPass}
                onChange={(e) => setSignupPass(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/20 outline-none text-white"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-white/70"
              >
                {!showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

            {/* Button */}
            <button
              className="bg-pink-500 hover:bg-pink-600 py-2 rounded-full"
              onClick={() => handleSignup()}
            >
              SIGN UP
            </button>
          </div>
        </div>

        {/* OVERLAY PANEL */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-linear-to-br from-pink-600 to-purple-700
 backdrop-blur-xl text-white flex flex-col justify-center items-center text-center px-12 transition-all duration-700 ease-in-out
          ${signup ? "translate-x-full" : "translate-x-0"}`}
        >
          {signup ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="mb-6 text-white/80">Already have an account?</p>

              <button
                onClick={() => setSignup(false)}
                className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition"
              >
                SIGN IN
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Hello, Friend</h2>
              <p className="mb-6 text-white/80">
                Create an account to get started
              </p>

              <button
                onClick={() => setSignup(true)}
                className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition"
              >
                SIGN UP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
