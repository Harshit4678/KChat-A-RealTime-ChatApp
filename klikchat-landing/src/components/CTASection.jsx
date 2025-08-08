"use client";

import { motion } from "framer-motion";
import Button from "../components/ui/Button";

const CTASection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative py-20 px-6 sm:px-10 md:px-20 bg-base-100 text-center overflow-hidden rounded-3xl"
    >
      {/* Matching subtle glow background like ScreenshotsSection */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent blur-[100px] z-0" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Ready to spark real vibes?
        </h2>

        <p className="text-lg sm:text-xl text-base-content/70 mb-8">
          Dive into real-time conversations that matter. Join{" "}
          <span className="text-base-content font-semibold">KLikChat</span> and
          make every message count.
        </p>

        <Button
          className="text-lg px-6 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
          href="https://app.klikchat.fun"
        >
          Get Started 💬
        </Button>
      </div>
    </motion.section>
  );
};

export default CTASection;
