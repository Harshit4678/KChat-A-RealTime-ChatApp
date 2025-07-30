import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // ✅ ACTUAL plugin imported
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",
  plugins: [react()], // ✅ you missed this
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["crypto-js/aes", "crypto-js/enc-utf8"], // ✅ for crypto-js fix
  },
});
