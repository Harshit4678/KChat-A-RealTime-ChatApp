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
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showActionBar, setShowActionBar] = useState(false);
  const [reportInfo, setReportInfo] = useState({ open: false });
  const [touchTimer, setTouchTimer] = useState(null);
  const [imageViewer, setImageViewer] = useState({ open: false, src: "" });
  const messageEndRef = useRef();
  const secretKey = "shared-key-for-this-chat";
  const [longPressTriggered, setLongPressTriggered] = useState(false);

  const decryptedMessages = messages.map((message) => ({
    ...message,
    text: message.text ? decryptMessage(message.text, secretKey) : "",
    image: message.image ? decryptMessage(message.image, secretKey) : null,
  }));

  const showNoMessages = decryptedMessages.length === 0;
  const userName = selectedUser?.fullName || "this user";

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

  useEffect(() => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !selectedUser) return;

    const handleShowTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) setOtherUserTyping(true);
    };
    const handleHideTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) setOtherUserTyping(false);
    };

    socket.on("showTyping", handleShowTyping);
    socket.on("hideTyping", handleHideTyping);

    return () => {
      socket.off("showTyping", handleShowTyping);
      socket.off("hideTyping", handleHideTyping);
    };
  }, [selectedUser]);

  useEffect(() => {
    const input = document.getElementById("message-input");
    if (!input) return;
    const handler = () => {
      setTimeout(() => {
        input.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleLongPress = (message) => {
    if (message.senderId !== authUser._id) {
      setSelectedMsg(message);
      setShowActionBar(true);
      setLongPressTriggered(true);
    }
  };

  let pressTimer = null;
  const handleTouchStart = (message) => {
    setLongPressTriggered(false);
    pressTimer = setTimeout(() => handleLongPress(message), 600);
    setTouchTimer(pressTimer);
  };
  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
    setTimeout(() => setLongPressTriggered(false), 200);
  };
  const handleMouseDown = (message) => {
    setLongPressTriggered(false);
    pressTimer = setTimeout(() => handleLongPress(message), 600);
    setTouchTimer(pressTimer);
  };
  const handleMouseUp = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
    setTimeout(() => setLongPressTriggered(false), 200);
  };

  const handleCopy = () => {
    if (selectedMsg?.text) navigator.clipboard.writeText(selectedMsg.text);
    setShowActionBar(false);
    setSelectedMsg(null);
  };
  const handleReport = () => {
    setReportInfo({
      open: true,
      type: "message",
      targetId: selectedMsg._id,
      content: selectedMsg,
    });
    setShowActionBar(false);
    setSelectedMsg(null);
  };
  const handleSaveImage = () => {
    if (selectedMsg?.image) {
      const link = document.createElement("a");
      link.href = selectedMsg.image;
      link.download = "chat-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowActionBar(false);
    setSelectedMsg(null);
  };

  const handleImageClick = (src) => {
    if (longPressTriggered) return;
    setImageViewer({ open: true, src });
    setShowActionBar(false);
    setSelectedMsg(null);
  };
  const handleCloseImageViewer = () => {
    setImageViewer({ open: false, src: "" });
  };

  useEffect(() => {
    if (!showActionBar) return;
    const handleClickOutside = (e) => {
      const actionBar = document.querySelector(".action-bar-selector");
      if (actionBar && !actionBar.contains(e.target)) {
        setShowActionBar(false);
        setSelectedMsg(null);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowActionBar(false);
        setSelectedMsg(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showActionBar]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-200 rounded-xl shadow-inner">
        <ChatHeader />
        <MessageSkeleton />
        <div className="sticky bottom-0 bg-base-100" id="message-input">
          <MessageInput />
        </div>
      </div>
    );
  }

  return (
    <div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full bg-base-200 rounded-xl shadow-lg overflow-hidden"
      id="main-chat-container"
    >
      {showActionBar && selectedMsg && (
        <div className="absolute top-0 left-0 w-full z-30 flex justify-center bg-base-100/90 border-b border-base-300 py-2 gap-3 shadow rounded-t-xl action-bar-selector backdrop-blur-md">
          {selectedMsg.text && (
            <button className="btn btn-xs btn-ghost" onClick={handleCopy}>
              Copy
            </button>
          )}
          {selectedMsg.image && (
            <button className="btn btn-xs btn-ghost" onClick={handleSaveImage}>
              Save Image
            </button>
          )}
          <button className="btn btn-xs btn-error" onClick={handleReport}>
            Report
          </button>
        </div>
      )}

      {imageViewer.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative">
            <img
              src={imageViewer.src}
              alt="Full"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 shadow"
              onClick={handleCloseImageViewer}
            >
              <span className="text-lg font-bold text-gray-700">✕</span>
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-base-100/95 backdrop-blur border-b border-base-300 rounded-t-xl">
        <ChatHeader />
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {showLiveIndicator && (
          <div className="flex justify-center">
            <span className="px-3 py-1 bg-primary text-white rounded-full text-xs animate-pulse">
              New Message
            </span>
          </div>
        )}

        {otherUserTyping && (
          <div className="px-4 pb-1">
            <span className="text-xs text-base-content/60 bg-base-100 px-3 py-1 rounded-full shadow animate-pulse">
              {userName} is typing...
            </span>
          </div>
        )}

        {showNoMessages ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-base-content/60 select-none pt-12">
            <img
              src="/avatar.png"
              alt="Start Chat"
              className="w-20 h-20 opacity-30 mb-4"
              draggable={false}
            />
            <h2 className="text-lg font-semibold mb-2">No messages yet</h2>
            <p className="text-sm">
              Start a conversation with{" "}
              <span className="font-bold text-primary">{userName}</span>
            </p>
          </div>
        ) : (
          decryptedMessages.map((message, idx) => (
            <div
              key={message._id}
              className={`chat group ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              } ${
                selectedMsg?._id === message._id ? "ring-2 ring-primary/60" : ""
              }`}
              ref={idx === decryptedMessages.length - 1 ? messageEndRef : null}
              onTouchStart={() => handleTouchStart(message)}
              onTouchEnd={handleTouchEnd}
              onMouseDown={() => handleMouseDown(message)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              tabIndex={0}
              style={{
                outline: "none",
                userSelect: "text",
                cursor:
                  message.image && message.senderId !== authUser._id
                    ? "zoom-in"
                    : "default",
              }}
            >
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div
                className={`chat-bubble flex flex-col transition-all duration-300 ease-in animate-fade-in relative group-hover:shadow-md ${
                  message.senderId !== authUser._id
                    ? "hover:ring-2 hover:ring-primary/30"
                    : ""
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="rounded-md mb-2 max-w-[220px] max-h-[260px] cursor-zoom-in"
                    onClick={() => handleImageClick(message.image)}
                    draggable={false}
                    style={{ objectFit: "cover" }}
                  />
                )}
                {message.text && (
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {message.text}
                  </p>
                )}
                {message.senderId === authUser._id && (
                  <span className="ml-auto mt-1 text-xs text-gray-400 select-none">
                    {message.seen ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div
        className="sticky bottom-0 bg-base-100 rounded-b-xl shadow"
        id="message-input"
      >
        <MessageInput />
      </div>

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
