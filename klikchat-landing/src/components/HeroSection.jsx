"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Lottie from "lottie-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 bg-base-100 overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full blur-2xl" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/20 to-transparent rounded-tr-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-accent/20 to-transparent rounded-tl-full blur-2xl" />
        <div className="absolute inset-4 border border-white/10 rounded-3xl blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl gap-10">
        {/* LEFT Animation (Desktop Only) */}
        <div className="hidden lg:flex flex-1 justify-center ">
          <Lottie
            animationData={require("../../public/animations/chat-bubbles.json")}
            loop={true}
            className="w-60 h-60"
          />
        </div>

        {/* CONTENT CENTER */}
        <div className="flex flex-col items-center gap-4 sm:gap-10 text-center lg:flex-[2] w-full">
          {/* Mobile: Chat bubble ABOVE logo */}
          <div className="lg:hidden ">
            <Lottie
              animationData={require("../../public/animations/chat-bubbles.json")}
              loop={true}
              className="w-36 h-36"
            />
          </div>

          {/* Logo + Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center pt-1 sm:pt-10 gap-2 sm:gap-1 relative"
          >
            <div className="relative z-10 group flex items-center gap-2 transform transition-all duration-500 hover:scale-125 animate-pulse">
              {/* Glowing K Circle */}
              <span className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-violet-600 via-sky-500 to-cyan-300 text-white font-black text-4xl sm:text-5xl leading-none shadow-lg transition-all group-hover:scale-110 animate-bounce-pulse">
                K
              </span>

              {/* Glowing LikChat + 💬 */}
              <span className="relative text-5xl sm:text-6xl font-bold bg-gradient-to-r from-violet-500 via-sky-500 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-150">
                LikChat
                <span className="absolute -top-2 text-2xl sm:text-3xl font-bold animate-bounce">
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
            className="text-base sm:text-xl text-stone-400 font-medium"
          >
            Spark real vibes with a{" "}
            <span className="relative font-semibold bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 bg-clip-text text-transparent animate-pulse">
              KLik
            </span>
          </motion.p>

          {/* Mobile: Typing cartoon BELOW slogan */}
          <div className="lg:hidden">
            <Lottie
              animationData={require("../../public/animations/something.json")}
              loop={true}
              className="w-40 h-40"
            />
          </div>

          {/* Headline */}

          <motion.h1
            initial="hidden"
            animate="visible"
            className="text-2xl sm:text-5xl gap-2 sm:gap-4 font-extrabold text-base-content max-w-3xl leading-tight text-slate-800"
          >
            {"Private Chatting, Secure Video Calls, and Real-Time Vibes."
              .split("")
              .map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  transition={{ delay: i * 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
          </motion.h1>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link
              href="https://app.klikchat.fun/"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-white text-lg font-semibold bg-gradient-to-r from-primary to-accent shadow-lg hover:scale-105 transition-transform hover:animate-bounce-pulse"
            >
              Start Secure Chatting with KLikChat
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT Animation (Desktop Only) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <Lottie
            animationData={require("../../public/animations/something.json")}
            loop={true}
            className="w-72 h-72"
          />
        </div>
      </div>
    </section>
  );
}
