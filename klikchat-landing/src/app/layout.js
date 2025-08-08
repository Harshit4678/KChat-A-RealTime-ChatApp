import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://klikchat.app"),
  title: {
    default: "KLikChat💬 - Spark real vibes with a KLik",
    template: "%s | KLikChat",
  },
  description:
    "Real-time chat & video call app with modern UI, end-to-end encryption, and blazing fast performance. Try KLikChat now!",
  keywords: [
    "KLikChat",
    "chat app",
    "video calling app",
    "real-time chat",
    "WebRTC app",
    "MERN chat app",
    "chat app with themes",
    "end to end encrypted chat",
    "React chat app",
    "Next.js SEO landing page",
  ],
  openGraph: {
    title: "KLikChat💬 - Spark real vibes with a KLik",
    description:
      "A secure, stylish real-time chat and video calling app made for modern connections.",
    url: "https://klikchat-2025.vercel.app",
    siteName: "KLikChat",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "KLikChat Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KLikChat💬 - Spark real vibes with a KLik",
    description: "Chat, call, connect — in style. Try KLikChat now.",
    images: ["/preview.png"],
  },
  icons: {
    icon: "/chat-icon.png",
    shortcut: "/chat-icon.png",
    apple: "/chat-icon.png",
  },
  themeColor: "#4f46e5",
  robots: "index, follow",
  alternates: {
    canonical: "https://klikchat-2025.vercel.app/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="likchat">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
