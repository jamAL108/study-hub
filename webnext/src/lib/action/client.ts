'use client';
import clientConnectionWithSupabase from "../supabase/client";

export default async function readUserSession() {
    const supabase = await clientConnectionWithSupabase()
    return supabase.auth.getSession();
}