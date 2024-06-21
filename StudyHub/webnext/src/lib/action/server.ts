'use server';
import { createSupabaseServerComponentClient } from '../supabase/server'

export default async function readUserSession() {
    const supabase = await createSupabaseServerComponentClient()
    return supabase.auth.getSession();
}