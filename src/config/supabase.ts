import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Key is missing in environment variables.");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
