import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    hashedPassword: String,
    otp: String,
    otpExpiry: Date,
    verificationToken: String,
    verificationTokenExpiry: Date,
  },
  { timestamps: true }
);

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
