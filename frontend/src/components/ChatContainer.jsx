import { useEffect, useRef, useState } from "react";
import ReportModal from "./ReportModal.jsx";
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import { decryptMessage } from "../lib/encryption.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const [showLiveIndicator, setShowLiveIndicator] = useState(false);
  const messageEndRef = useRef();
  const [reportInfo, setReportInfo] = useState({ open: false });
  const [touchTimer, setTouchTimer] = useState(null);
  const secretKey = "shared-key-for-this-chat"; // Replace with per-chat key in production

  useEffect(() => {
    const handler = () => {
      setShowLiveIndicator(true);
      setTimeout(() => setShowLiveIndicator(false), 1500);
    };
    window.addEventListener("show-live-indicator", handler);
    return () => window.removeEventListener("show-live-indicator", handler);
  }, []);

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const decryptedMessages = messages.map((message) => ({
    ...message,
    text: message.text ? decryptMessage(message.text, secretKey) : "",
    image: message.image ? decryptMessage(message.image, secretKey) : null,
  }));

  const handleReport = (message) => {
    setReportInfo({
      open: true,
      type: "message",
      targetId: message._id,
      content: message.text,
    });
  };

  const handleTouchStart = (message) => {
    const timer = setTimeout(() => {
      handleReport(message);
    }, 600); // Long-press time in ms
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-base-100 opacity-90 border-b border-base-300">
        <ChatHeader />
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        {showLiveIndicator && (
          <div className="flex justify-center mb-2">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs animate-pulse transition-all duration-300">
              New Message
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {decryptedMessages.map((message) => (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
              onDoubleClick={() => handleReport(message)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleReport(message);
              }}
              onTouchStart={() => handleTouchStart(message)}
              onTouchEnd={handleTouchEnd}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col transition-all duration-300 ease-in animate-fade-in relative">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
                {message.senderId === authUser._id && (
                  <span className="ml-auto mt-1 text-xs text-gray-400 select-none">
                    {message.seen ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0">
        <MessageInput />
      </div>

      {/* Report Modal */}
      {reportInfo.open && (
        <ReportModal
          isOpen={reportInfo.open}
          onClose={() => setReportInfo({ open: false })}
          type={reportInfo.type}
          targetId={reportInfo.targetId}
          content={reportInfo.content}
        />
      )}
    </div>
  );
};

export default ChatContainer;
