"use client";
import { motion } from "framer-motion";

const Button = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={`relative inline-flex items-center justify-center px-6 py-3 font-semibold rounded-2xl text-white 
      bg-gradient-to-r from-primary to-accent shadow-md shadow-accent/30 
      hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 
      active:scale-95 ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
