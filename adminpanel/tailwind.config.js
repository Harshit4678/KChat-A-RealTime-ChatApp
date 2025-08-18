/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a78bfa", // Cyan
        secondary: "#2563eb", // Lighter blue (than before)
        accent: "#00ffff", // Lighter violet for softer glow
        danger: "#EF4444",
      },

      animation: {
        fadeIn: "fadeIn 0.4s ease-in-out",
        "bounce-pulse": "bounce 2s infinite, pulse 2s infinite",
        "slow-spin": "spin 3s linear infinite",
        "spin-slow": "spin 2s linear infinite",
      },
      blur: {
        "3xl": "64px",
      },

      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
      },
      backgroundImage: {
        glass:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 100%)",
      },
    },
  },
  plugins: [],
};
