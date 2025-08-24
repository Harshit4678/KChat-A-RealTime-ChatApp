import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { Image, X, Smile, SendHorizonal } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { encryptMessage } from "../lib/encryption.js";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, socket, currentChatUser, authUser } = useChatStore();
  const secretKey = "shared-key-for-this-chat";

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No file selected");
    if (!file.type.startsWith("image/"))
      return toast.error("Please select an image file");

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch {
      toast.error("Failed to process image");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const emitTyping = (isTyping = true) => {
    if (socket && currentChatUser && authUser) {
      socket.emit("typing", {
        senderId: authUser._id,
        receiverId: currentChatUser._id,
        isTyping,
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      const encryptedText = text ? encryptMessage(text.trim(), secretKey) : "";
      const encryptedImage = imagePreview
        ? encryptMessage(imagePreview, secretKey)
        : null;

      await sendMessage({ text: encryptedText, image: encryptedImage });

      setText("");
      setImagePreview(null);
      emitTyping(false); // Stop typing indicator

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (textareaRef.current) textareaRef.current.focus();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(), 1500);
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(), 1500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!socket || !currentChatUser) return;

    const handleTypingStatus = ({ from, isTyping }) => {
      if (from === currentChatUser._id) setOtherUserTyping(isTyping);
    };

    socket.on("typing", handleTypingStatus);
    return () => socket.off("typing", handleTypingStatus);
  }, [socket, currentChatUser]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [text]);

  return (
    <div className="px-4 pt-2 pb-4 backdrop-blur-md bg-white/70 dark:bg-zinc-900/60 border-t border-gray-200 dark:border-zinc-700 shadow-inner">
      {otherUserTyping && (
        <div className="text-xs text-primary mb-1 px-1 animate-pulse font-medium">
          {currentChatUser?.name || "User"} is typing...
        </div>
      )}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-zinc-400 shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-end gap-2 relative"
      >
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            className="w-full rounded-lg resize-none max-h-40 overflow-y-auto pr-12 pl-3 py-2 border focus:outline-none focus:ring-2 transition-colors
              bg-white text-black border-gray-300 focus:ring-primary 
              dark:bg-zinc-900 dark:text-white dark:border-zinc-700"
            placeholder="Type a message..."
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className="absolute bottom-2.5 right-10 btn btn-circle btn-xs text-gray-600 dark:text-gray-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={16} />
          </button>

          <button
            type="button"
            className="absolute bottom-2.5 right-2 btn btn-circle btn-xs text-gray-600 dark:text-gray-300"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={16} />
          </button>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1 px-2 py-2 rounded-full text-white bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md dark:from-blue-400 dark:to-indigo-500 disabled:opacity-40  animate-bounce-pulse"
          disabled={!text.trim() && !imagePreview}
        >
          <SendHorizonal size={24} className="mt-[1px]" />
        </button>
      </form>

      {showEmojiPicker && (
        <div
          className={`absolute z-50 ${
            window.innerWidth <= 640
              ? "bottom-0 left-0 w-full h-[40vh] overflow-y-scroll bg-white shadow-lg rounded-t-xl"
              : "bottom-24 right-6"
          }`}
          ref={emojiPickerRef}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
