import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";

const Settings = () => {
  const { user } = useContext(AuthContext);

  const [bio, setBio] = useState(user?.bio || "");
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();
      console.log(data);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      credentials: "include",
    });
    window.location.href = "/login";
  };

  return (
    <div className="w-1/3 h-full p-6 overflow-y-auto bg-white/5 backdrop-blur-sm border-r border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-white">Settings</h2>

      {/* Profile */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-white">{user?.name}</p>
          <p className="text-sm text-white/60">{user?.email}</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <label className="text-sm text-white/70">Bio</label>

        <textarea
          className="w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
        >
          Save Changes
        </button>

        <button
          onClick={logout}
          className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
