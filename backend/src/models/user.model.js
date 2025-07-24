import mongoose from "mongoose";

const unreadMessageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },

    unreadMessages: [unreadMessageSchema], // <-- Add this line
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
