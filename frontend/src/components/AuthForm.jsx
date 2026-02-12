import { useState } from "react";

export default function AuthForm() {
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
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
  const signUp = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="h-screen flex justify-center items-center bg-linear-to-br from-gray-900 via-black to-gray-900">
      <div className="relative w-200 h-125 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        {/* FORMS */}
        <div className="flex h-full text-white">
          {/* SIGN IN */}
          <div className="w-1/2 flex flex-col justify-center px-16">
            <h2 className="text-3xl font-bold mb-6">Sign In</h2>

            <input
              placeholder="Email"
              className="mb-3 px-4 py-2 rounded bg-white/20 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              className="mb-4 px-4 py-2 rounded bg-white/20 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="bg-blue-500 hover:bg-blue-600 py-2 rounded-full"
              onClick={() => signIn()}
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
            <input
              placeholder="Email"
              className="mb-3 px-4 py-2 rounded bg-white/20 outline-none"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              placeholder="Password"
              type="password"
              className="mb-4 px-4 py-2 rounded bg-white/20 outline-none"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <button
              className="bg-pink-500 hover:bg-pink-600 py-2 rounded-full"
              onClick={() => signUp()}
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
