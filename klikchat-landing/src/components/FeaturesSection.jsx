"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Video,
  Users,
  Brush,
  Trash2,
  AlertTriangle,
  RefreshCcw,
  UserCheck,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "End-to-End Encryption",
    desc: "All your messages and calls are completely secure. No one can read them — not even us.",
  },
  {
    icon: <Video className="w-7 h-7" />,
    title: "Video Calling",
    desc: "Face-to-face conversations made simple, encrypted, and high-quality.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Real-time Interaction",
    desc: "See who’s online instantly and connect without delay.",
  },
  {
    icon: <Brush className="w-7 h-7" />,
    title: "Theme Customization",
    desc: "Switch between light & dark modes effortlessly to match your vibe.",
  },
  {
    icon: <Trash2 className="w-7 h-7" />,
    title: "Clear Chat History",
    desc: "Wipe chats with one click while keeping your connection intact.",
  },
  {
    icon: <AlertTriangle className="w-7 h-7" />,
    title: "User Reporting",
    desc: "Instantly report users who misbehave. We take your safety seriously.",
  },
  {
    icon: <RefreshCcw className="w-7 h-7" />,
    title: "OTP Verified Signup",
    desc: "Stay protected from fake users with secure email + OTP verification.",
  },
  {
    icon: <UserCheck className="w-7 h-7" />,
    title: "Profile & Account Control",
    desc: "Update your info, delete your account — you’re always in control.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Everything You Need to Connect
          </h2>
          <p className="mt-4 text-lg text-base-content/70 max-w-2xl mx-auto">
            KLikChat combines speed, privacy, and simplicity — built for the
            modern communicator.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-base-200 dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-base-300/60 hover:scale-[1.02] transition-all group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white mb-4 shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2 group-hover:text-accent transition">
                {feature.title}
              </h3>
              <p className="text-base text-base-content/70">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
