import nodemailer from "nodemailer";

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
