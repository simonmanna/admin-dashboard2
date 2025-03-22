// File: lib/supabase-auth.js
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "./supabase/server";
import { cookies } from "next/headers";

// This is the implementation of createRouteHandlerClient
export function createRouteHandlerClient({ cookies }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        cookie: cookies().toString(),
      },
    },
  });
}

// Helper function to get server-side Supabase client
export function getServerSupabase() {
  return createServerComponentClient({ cookies });
}
