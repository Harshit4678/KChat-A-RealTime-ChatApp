// components/GlassStatCard.jsx
import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

export default function GlassStatCard({ title, value, icon, color }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (isNaN(end)) return;

    const duration = 1000; // 1 second
    const increment = end / (duration / 16); // ~60fps

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(counter);
        setCount(end);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <Motion.div
      className={`relative p-6 rounded-xl backdrop-blur-lg border border-white/10 shadow-xl transition-transform transform hover:scale-[1.03] bg-white/10 dark:bg-white/5`}
      whileHover={{ boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-white">{title}</div>
        <div className={`w-10 h-10 p-2 rounded-full ${color} `}>{icon}</div>
      </div>

      <div className="text-4xl font-extrabold text-white">{count}</div>
    </Motion.div>
  );
}
