// ✅ USE THIS MODEL (your existing one)
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    }, // optional in frontend logic
    reason: { type: String, required: true },
    details: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "action_taken"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
