import { useContext, useState, useRef } from "react";
import { AuthContext } from "../AuthContext";

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);

  // States for all fields
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || null);

  const fileInputRef = useRef(null);

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      // Using FormData because we are sending a file (profilePic)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("gender", gender);
      if (password) formData.append("password", password); // Only send if changed
      if (profilePic) formData.append("profilePic", profilePic);

      const res = await fetch(
        `${import.meta.env.VITE_server}/auth/updateProfile`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        },
      );

      // --- THE FIX ---
      // 1. Read the raw text of the response first
      const responseText = await res.text();

      // 2. Safely parse the text into JSON if it exists, otherwise use an empty object
      const data = responseText ? JSON.parse(responseText) : {};

      if (res.ok) {
        // Only update user if the backend actually returned user data
        if (data.user) {
          setUser(data.user);
        }
        alert("Profile updated successfully!");
        setPassword(""); // Clear password field after success
      } else {
        alert(data.message || `Update failed with status: ${res.status}`);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("An error occurred while saving. Please check the console.");
    }
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_server}/auth/logout`, {
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <div className="w-1/3 h-full p-6 overflow-y-auto bg-white/5 backdrop-blur-sm border-r border-white/10 text-white">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div
          className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-3xl font-bold overflow-hidden border-2 border-blue-500 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            user?.name?.charAt(0)
          )}
        </div>
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="text-xs text-blue-400 hover:underline"
        >
          Change Photo
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {/* Name */}
        <div>
          <label className="text-sm text-white/70">Full Name</label>
          <input
            type="text"
            className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm text-white/70">Gender</label>
          <select
            className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-blue-500"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" className="bg-gray-800">
              Select Gender
            </option>
            <option value="male" className="bg-gray-800">
              Male
            </option>
            <option value="female" className="bg-gray-800">
              Female
            </option>
            <option value="other" className="bg-gray-800">
              Other
            </option>
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm text-white/70">Bio</label>
          <textarea
            className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-blue-500"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Password Change */}
        <div>
          <label className="text-sm text-white/70">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl transition-colors font-semibold"
        >
          Save Changes
        </button>

        <button
          onClick={logout}
          className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-500 py-3 rounded-xl transition-colors font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
