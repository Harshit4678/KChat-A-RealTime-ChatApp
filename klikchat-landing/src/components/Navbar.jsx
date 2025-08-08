"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how" },
  { name: "FAQ", href: "#faqs" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/70 shadow backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="#home" className="relative group">
            <div className="relative flex items-center space-x-1">
              <div className="relative">
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white text-lg sm:text-xl font-black bg-gradient-to-br from-violet-600 via-sky-500 to-cyan-400 shadow-lg z-10">
                  K
                </span>
                <span className="absolute inset-0 rounded-full animate-ping bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 opacity-50 blur-md scale-110 z-0" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                LikChat
              </span>
              <span className="absolute -top-1 -right-6 text-base sm:text-lg font-bold bg-gradient-to-r from-violet-900 via-sky-600 to-cyan-400 bg-clip-text text-transparent animate-bounce">
                💬
              </span>
              <div className="absolute inset-0 rounded-xl blur-lg opacity-15 z-0 bg-gradient-to-br from-violet-500 via-sky-500 to-cyan-400 scale-125 shadow-md" />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary hover:underline underline-offset-4 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Link href="https://app.klikchat.fun/">
              <button className="text-sm px-5 py-2 rounded-full font-semibold bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Try Now
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white/90 backdrop-blur shadow-inner rounded-b-xl overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-gray-800 hover:text-primary transition duration-200"
                >
                  {link.name}
                </a>
              ))}
              <Link href="https://app.klikchat.fun/">
                <button className="mt-3 w-full text-sm px-5 py-2 rounded-full font-semibold bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow hover:shadow-md transition-all duration-300 hover:scale-105">
                  Try Now
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
