import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "../store/useAuthStore";
import { decryptMessage } from "../lib/encryption.js";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

export default function ReportModal({
  isOpen,
  onClose,
  type,
  targetId,
  content,
}) {
  const [reason, setReason] = useState("");
  const { authUser } = useAuthStore.getState();
  const socket = useAuthStore((state) => state.socket);
  const { selectedUser, messages } = useChatStore();

  const secretKey = "shared-key-for-this-chat"; // TODO: Use per-chat key in production

  const handleSubmit = () => {
    if (!reason.trim()) return;
    if (!socket) {
      console.error("Socket not connected");
      return;
    }

    if (type === "message") {
      const reportedUserId =
        content?.senderId || content?.userId || selectedUser?._id || "";

      // Decrypt text & image of reported message
      const decryptedText = content?.text
        ? decryptMessage(content.text, secretKey)
        : "";
      const decryptedImage = content?.image
        ? decryptMessage(content.image, secretKey)
        : "";

      // Last 5 decrypted messages (from this chat)
      const last5 = (messages || []).slice(-5).map((msg) => ({
        text: msg.text ? decryptMessage(msg.text, secretKey) : "",
        image: msg.image ? decryptMessage(msg.image, secretKey) : "",
        createdAt: msg.createdAt,
      }));

      socket.emit("report-message", {
        reportedUserId,
        messageId: targetId,
        reason,
        details: JSON.stringify({
          text: decryptedText,
          image: decryptedImage,
          last5,
        }),
        reportedBy: authUser._id,
      });
      toast.success("Message reported");
    } else if (type === "user") {
      const last5 = (messages || []).slice(-5).map((msg) => ({
        text: msg.text ? decryptMessage(msg.text, secretKey) : "",
        image: msg.image ? decryptMessage(msg.image, secretKey) : "",
        createdAt: msg.createdAt,
      }));

      socket.emit("report-user", {
        reportedUserId: targetId,
        messageId: null,
        reason,
        details: JSON.stringify({ last5 }),
        reportedBy: authUser._id,
      });
      toast.success("User reported");
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">
          Report {type === "user" ? "User" : "Message"}
        </h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for reporting"
          className="w-full h-24 border rounded px-3 py-2 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-sm btn-error" onClick={handleSubmit}>
            Report
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
