import { motion as Motion } from "framer-motion";

export default function Settings() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-2"
      >
        ⚙️ Admin Panel Settings
      </Motion.h2>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-md"
      >
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            👤 Profile Info
          </h3>
          <ul className="text-gray-600 space-y-2">
            <li>
              <strong>Name:</strong> Admin User
            </li>
            <li>
              <strong>Email:</strong> admin@example.com
            </li>
            <li>
              <strong>Role:</strong> Super Admin
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            🛡️ Security
          </h3>
          <p className="text-gray-600">
            Your password is securely stored and cannot be changed via the
            panel. Please contact support for changes.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            ⚡ Activity Preferences
          </h3>
          <ul className="text-gray-600 list-disc list-inside space-y-1">
            <li>Receive weekly usage reports</li>
            <li>Enable login alerts</li>
            <li>Theme: Dark Mode</li>
          </ul>
        </section>
      </Motion.div>
    </div>
  );
}
