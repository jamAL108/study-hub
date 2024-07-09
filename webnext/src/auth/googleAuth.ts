'use client';
import clientConnectionWithSupabase from '@/lib/supabase/client'
const googleAuth = async () => {
    const supabase = clientConnectionWithSupabase()
    const URL = 'https://www.study-hub.xyz'
    // const URL ='http://localhost:3000'
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${URL}/auth/callback`
        },
    })
}

export default googleAuth
