"use client";

import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: any = null;

export default function clientConnectionWithSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return supabaseInstance;
}
