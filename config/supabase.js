import { createClient } from "@supabase/supabase-js";
import { APP_CONFIG } from "@constants/api";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Supabase configuration helpers
export const supabaseConfig = {
  // Tables
  TABLES: {
    USERS: "users",
    TASKS: "tasks",
    ROOMS: "rooms",
    STAFF: "staff",
    SHIFTS: "shifts",
    MESSAGES: "messages",
  },

  // Real-time subscriptions
  subscribeToTable: (table, callback) => {
    return supabase
      .channel(`public:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, callback)
      .subscribe();
  },

  // Storage buckets
  BUCKETS: {
    AVATARS: "avatars",
    DOCUMENTS: "documents",
    IMAGES: "images",
  },
};
