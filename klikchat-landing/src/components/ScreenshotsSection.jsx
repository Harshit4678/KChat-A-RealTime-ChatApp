"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ScreenshotsSection() {
  return (
    <section className="py-16 bg-base-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent blur-[120px] z-0" />

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            See KLikChat in Action
          </h2>
          <p className="mt-4 text-lg text-base-content/70 max-w-xl mx-auto">
            A quick glimpse into the KLikChat experience — modern, real-time and
            private.
          </p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-14">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="w-full bg-base-200 rounded-2xl border border-base-300 shadow-md overflow-hidden"
            >
              <div className="relative w-full pb-[177.78%] ">
                {/* 9/16 aspect ratio */}
                <Image
                  src={`/demo/img-${i}.png`}
                  alt={`LikChat screenshot ${i}`}
                  fill
                  className="object-contain bg-base-200 rounded-2xl border border-base-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i === 1} // Add priority to the first image
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
