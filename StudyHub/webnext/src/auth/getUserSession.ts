'use client';
import clientConnectionWithSupabase from '../lib/supabase/client';

export default async function checkUserAuthClient() {
    // console.log("HELOO")
    const supabase = await clientConnectionWithSupabase()
    return supabase.auth.getSession()
}