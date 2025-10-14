import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const VITE_SUPABASE_URL = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const VITE_SUPABASE_PUBLISHABLE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

  // Fallbacks for preview environments where .env may not be injected
  const FALLBACK_SUPABASE_URL = "https://asobjhczlorpqqbpldvw.supabase.co";
  const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzb2JqaGN6bG9ycHFxYnBsZHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODE3NTcsImV4cCI6MjA3NTc1Nzc1N30.6EajPZXr9C5INQDMTxphG57FgT2baFzCr_pv7DjP4cw";

  const EFFECTIVE_SUPABASE_URL = VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const EFFECTIVE_SUPABASE_PUBLISHABLE_KEY = VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_PUBLISHABLE_KEY;
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
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(EFFECTIVE_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(EFFECTIVE_SUPABASE_PUBLISHABLE_KEY),
    },
  };
});
