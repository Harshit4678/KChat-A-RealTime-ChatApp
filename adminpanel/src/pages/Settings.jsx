import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("🔧 Settings updated (not yet connected to backend)");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">⚙️ Admin Settings</h2>

      <form
        onSubmit={handleUpdate}
        className="space-y-6 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            className="w-full border p-2 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
