const dummyFeedback = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    message: "Great app! Just wanted to say thanks!",
    createdAt: "2025-07-20",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    message: "I found a bug while reporting a user.",
    createdAt: "2025-07-21",
  },
];

export default function Feedback() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📬 User Feedback</h2>

      <div className="space-y-4">
        {dummyFeedback.map((fb) => (
          <div
            key={fb.id}
            className="border rounded p-4 shadow bg-white hover:bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">{fb.name}</p>
                <p className="text-sm text-gray-500">{fb.email}</p>
              </div>
              <span className="text-xs text-gray-400">{fb.createdAt}</span>
            </div>
            <p className="mb-2">{fb.message}</p>
            <div className="flex gap-2">
              <button className="text-blue-600 hover:underline text-sm">
                Reply
              </button>
              <button className="text-yellow-600 hover:underline text-sm">
                Archive
              </button>
              <button className="text-red-600 hover:underline text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
