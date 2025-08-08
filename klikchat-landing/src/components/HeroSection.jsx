"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[100vh] flex items-center justify-center px-4 bg-base-100 overflow-hidden">
      {/* Glow corners like NoChatSelected */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full blur-2xl" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/20 to-transparent rounded-tr-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-accent/20 to-transparent rounded-tl-full blur-2xl" />
        <div className="absolute inset-4 border border-white/10 rounded-3xl blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-5xl text-center flex flex-col items-center gap-12 px-6 py-16 md:py-28 -pulse">
        <div className="flex flex-col items-center gap-2">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="relative z-10 group flex items-center gap-2 transform transition-all duration-500 hover:scale-125 animate-pulse">
              {/* Glowing K Circle */}
              <span className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-violet-600 via-sky-500 to-cyan-300 text-white font-black text-4xl sm:text-5xl leading-none shadow-lg transition-all group-hover:scale-110 animate-bounce-pulse">
                K
              </span>

              {/* Glowing LikChat + 💬 */}
              <span className="relative text-5xl sm:text-6xl font-bold bg-gradient-to-r from-violet-500 via-sky-500 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-150 ">
                LikChat
                <span className="absolute -top-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-900 via-sky-600 to-cyan-400 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-110 animate-bounce-pulse] animate-bounce">
                  💬
                </span>
              </span>

              {/* Glowing Aura Background */}
              <div className="absolute inset-0 rounded-xl blur-lg opacity-20 z-0 bg-gradient-to-br from-violet-500 via-sky-500 to-cyan-400 scale-125 shadow-md" />
            </div>
          </motion.div>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-xl text-stone-400 font-medium mt-1 sm:mt-2 text-center sm:text-start"
          >
            Spark real vibes with a{" "}
            <span
              className="relative font-semibold bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 bg-clip-text text-transparent 
               animate-pulse transition-all duration-300"
            >
              KLik
              <span
                className="absolute -inset-0.5 rounded-lg blur-sm opacity-5  
                bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500"
                aria-hidden="true"
              />
            </span>
          </motion.p>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-3xl sm:text-5xl font-extrabold text-base-content max-w-3xl leading-tight"
        >
          Private Chatting, Secure Video Calls, and Real-Time Vibes.
        </motion.h1>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Link
            href="https://klikchat-2025.vercel.app/"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-white text-lg font-semibold bg-gradient-to-r from-primary to-accent shadow-lg hover:scale-105 transition-transform hover:animate-bounce-pulse "
          >
            Start with one KLik
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
