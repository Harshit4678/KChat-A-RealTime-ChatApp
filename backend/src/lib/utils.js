import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: isProduction, // ✅ Only true in production
    sameSite: isProduction ? "None" : "Lax", // ✅ Smart SameSite
  });

  return token;
};

export const sendEmail = async (to, subject, html) => {
  // Use your SMTP config here
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"KLikChat" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};
