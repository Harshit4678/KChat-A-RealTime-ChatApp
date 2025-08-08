"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is KLikChat free to use?",
    answer:
      "Yes! KLikChat is completely free with ads, no subscriptions, and no hidden charges.",
  },
  {
    question: "Are my messages private?",
    answer:
      "Absolutely. All chats and video calls are end-to-end encrypted. We can’t see your data — only you and the person you chat with can.",
  },
  {
    question: "Do I need to verify my email?",
    answer:
      "Yes. To maintain a safe community, we verify all users using OTP sent to their email during signup.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes. You have full control — you can delete your account and chat history at any time.",
  },
  {
    question: "Will there be a mobile app?",
    answer:
      "Yes! Our PWA works great on mobile, and a native mobile app is coming soon.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-base-100 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* FAQs */}
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-base-300 rounded-xl bg-base-200 shadow-md overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-base-content">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${
                    activeIndex === i ? "rotate-180 text-accent" : "rotate-0"
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-4 text-base-content/70"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
