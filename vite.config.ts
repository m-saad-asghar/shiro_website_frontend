import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true, // فتح التحليل تلقائياً بعد البناء
      filename: "stats.html", // اسم ملف التحليل
      gzipSize: true, // عرض حجم الملفات بعد الضغط
      brotliSize: true, // عرض حجم Brotli
      template: "treemap", // نوع العرض: treemap, sunburst, network
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React Core
          vendor: ["react", "react-dom"],

          // Routing
          router: ["react-router-dom"],

          // UI & Animation
          ui: ["framer-motion", "react-icons", "lucide-react"],

          // State Management & API
          query: ["@tanstack/react-query", "axios"],

          // Forms
          forms: ["formik", "yup", "react-phone-number-input"],

          // UI Components
          radix: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-hover-card",
          ],

          // i18n
          i18n: ["i18next", "react-i18next"],

          // Utils
          utils: ["date-fns", "clsx", "tailwind-merge", "js-cookie"],

          // Carousel & Sliders
          carousel: ["embla-carousel-react"],
        },
      },
    },
    // تقليل حد التحذير (يمكن زيادته حسب الحاجة)
    chunkSizeWarningLimit: 500,

    // تفعيل minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // حذف console.log من الإنتاج
        drop_debugger: true, // حذف debugger
      },
    },

    // تحسين Source maps
    sourcemap: false, // إيقاف source maps في الإنتاج لتقليل الحجم
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
