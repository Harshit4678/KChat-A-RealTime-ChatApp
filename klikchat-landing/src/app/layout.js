import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KLikChat💬 - Spark real vibes with a KLik",
  description:
    "KLikChat is a real-time encrypted chat and video calling app with modern UI and blazing-fast performance. Join now and spark real vibes with a KLik!",
  keywords: [
    "KLikChat",
    "chat app",
    "video calling app",
    "real-time messaging",
    "encrypted chat app",
    "React chat app",
    "Next.js SEO landing page",
    "MERN chat app",
    "WebRTC app",
    "secure chat platform",
    "private messaging",
    "group chat",
    "voice call app",
    "video call app",
    "online chat app",
    "instant messaging",
    "chat application",
    "secure communication",
    "mobile chat app",
    "web chat app",
    "real-time chat platform",
    "peer-to-peer chat",
    "encrypted video calls",
    "fast messaging app",
    "chat app with encryption",
    "multi-device chat",
    "cross-platform chat app",
    "chat app for businesses",
    "secure video conferencing",
    "modern chat UI",
    "low latency chat",
  ],
  metadataBase: new URL("https://www.klikchat.fun"),
  alternates: {
    canonical: "https://www.klikchat.fun",
  },
  openGraph: {
    title: "KLikChat💬 - Spark real vibes with a KLik",
    description:
      "A secure, stylish real-time chat and video calling app made for modern connections.",
    url: "https://www.klikchat.fun",
    siteName: "KLikChat",
    images: [
      {
        url: "https://www.klikchat.fun/preview2.jpg",
        width: 1200,
        height: 630,
        alt: "KLikChat Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KLikChat💬 - Spark real vibes with a KLik",
    description:
      "End-to-end encrypted real-time messaging & video calling app. Try KLikChat now!",
    images: ["https://www.klikchat.fun/preview1.png"],
    creator: "@klikchat",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// ✅ Theme color yahan shift karo
export const viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="likchat">
      <head>
        <link rel="icon" href="/fevicon.ico" type="image/png" />
        <link rel="shortcut icon" href="/fevicon.ico" type="image/png" />
        <link rel="apple-touch-icon" href="/fevicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
