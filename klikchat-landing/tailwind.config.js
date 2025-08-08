/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a78bfa", // Cyan
        secondary: "#2563eb", // Lighter blue (than before)
        accent: "#00ffff", // Lighter violet for softer glow
      },

      backgroundImage: {
        "glow-gradient": "linear-gradient(135deg, #00ffff, #3b82f6, #7c3aed)",
      },
      boxShadow: {
        glow: "0 0 15px #00b4ff, 0 0 30px #00b4ff",
      },
      animation: {
        "bounce-pulse": "bounce 2s infinite, pulse 3s infinite",
        "slow-spin": "spin 3s linear infinite",
        "spin-slow": "spin 2s linear infinite",
        "fade-in-up": "fadeInUp 0.1s ease-out both",
      },
      blur: {
        "3xl": "64px",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
