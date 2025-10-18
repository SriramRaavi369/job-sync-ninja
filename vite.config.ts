import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_FIREBASE_API_KEY": JSON.stringify(env.VITE_FIREBASE_API_KEY),
      "import.meta.env.VITE_FIREBASE_AUTH_DOMAIN": JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      "import.meta.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      "import.meta.env.VITE_FIREBASE_STORAGE_BUCKET": JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
      "import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      "import.meta.env.VITE_FIREBASE_APP_ID": JSON.stringify(env.VITE_FIREBASE_APP_ID),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const parts = id.split('node_modules/')[1].split('/');
              const packageName = parts[0];

              // Specific rules for large or commonly grouped libraries
              if (packageName === 'firebase') {
                return 'vendor_firebase';
              }
              if (packageName === 'react' || packageName === 'react-dom' || packageName === 'react-router-dom') {
                return 'vendor_react';
              }
              if (packageName.startsWith('@radix-ui')) {
                return 'vendor_radix-ui';
              }
              if (packageName === 'lucide-react') {
                return 'vendor_lucide-react';
              }
              if (packageName === 'html2canvas') {
                return 'vendor_html2canvas';
              }
              if (packageName === 'jspdf') {
                return 'vendor_jspdf';
              }
              if (packageName === 'pdfjs-dist') {
                return 'vendor_pdfjs-dist';
              }
              if (packageName === 'recharts') {
                return 'vendor_recharts';
              }
              if (packageName === 'zod') {
                return 'vendor_zod';
              }
              if (packageName === 'date-fns') {
                return 'vendor_date-fns';
              }
              if (packageName === 'embla-carousel-react') {
                return 'vendor_embla-carousel-react';
              }
              if (packageName === 'react-day-picker') {
                return 'vendor_react-day-picker';
              }
              if (packageName === 'react-dropzone') {
                return 'vendor_react_dropzone';
              }
              if (packageName === 'react-hook-form') {
                return 'vendor_react-hook-form';
              }
              if (packageName === 'react-resizable-panels') {
                return 'vendor_react_resizable_panels';
              }
              if (packageName === 'vaul') {
                return 'vendor_vaul';
              }
              if (packageName === 'cmdk') {
                return 'vendor_cmdk';
              }
              if (packageName === 'sonner') {
                return 'vendor_sonner';
              }
              if (packageName === 'tailwind-merge') {
                return 'vendor_tailwind-merge';
              }
              if (packageName === 'class-variance-authority') {
                return 'vendor_class-variance-authority';
              }
              if (packageName === 'clsx') {
                return 'vendor_clsx';
              }
              if (packageName === 'next-themes') {
                return 'vendor_next-themes';
              }
              if (packageName === 'input-otp') {
                return 'vendor_input-otp';
              }
              if (packageName.startsWith('@tanstack')) {
                return 'vendor_tanstack';
              }
              if (packageName.startsWith('@hookform')) {
                return 'vendor_hookform';
              }
              if (packageName === 'tailwindcss-animate') {
                return 'vendor_tailwindcss-animate';
              }

              // Aggressive chunking: put every other top-level node_module into its own chunk
              return `vendor_${packageName}`;
            }
          },
        },
      },
    },
  };
});
