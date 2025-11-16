import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Defensive initialization: allow app to load even if env vars are missing
let supabase = null;
let supabaseError = null;

if (!supabaseUrl || !supabaseAnonKey) {
  supabaseError = new Error(
    'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
  console.warn('⚠️ Supabase initialization failed:', supabaseError.message);
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    supabaseError = err instanceof Error ? err : new Error(String(err));
    console.error('❌ Failed to initialize Supabase:', supabaseError.message);
  }
}

export { supabase, supabaseError };
export type SupabaseClient = typeof supabase;