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
        url: "https://www.klikchat.fun/preview1.png",
        width: 400,
        height: 300,
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
    images: ["/preview1.png"],
    creator: "@klikchat",
  },
  icons: {
    icon: "/fevicon.ico",
    shortcut: "/fevicon.ico",
    apple: "/fevicon.ico",
  },
  themeColor: "#4f46e5",
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
