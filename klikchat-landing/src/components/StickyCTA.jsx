"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Lottie from "lottie-react";

const StickyCTA = () => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <motion.div
      drag
      dragElastic={0.3}
      whileDrag={{ scale: 1.1, rotate: 5 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="fixed bottom-6 right-6 z-50 animate-bounce"
    >
      <div className="w-20 h-20 sm:w-28 sm:h-28">
        <Lottie
          animationData={require("../../public/animations/robot2.json")}
          loop={true}
        />
      </div>

      <Link href="https://app.klikchat.fun/">
        <motion.button
          onClick={() => setIsClicked(true)}
          onAnimationComplete={() => setIsClicked(false)}
          whileTap={{
            scale: 0.95,
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
          }}
          animate={{
            y: [0, -20, 0], // bounce up and down
            boxShadow: isClicked
              ? "0 0 30px rgba(0, 255, 255, 0.6)"
              : "0 0 10px rgba(0, 255, 255, 0.2)",
          }}
          transition={{
            y: {
              repeat: Infinity,
              repeatDelay: 1, // 1 second pause after each bounce
              duration: 0.1, // fast bounce
              ease: "easeInOut",
            },
            boxShadow: { duration: 0.3 },
          }}
          className="px-5 py-3 sm:px-6 sm:py-4 md:px-7 md:py-5 bg-gradient-to-r from-primary to-accent text-white rounded-full text-xs sm:text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] hover:bg-gradient-to-bl hover:from-accent hover:to-primary"
        >
          Try Now 💬
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default StickyCTA;
