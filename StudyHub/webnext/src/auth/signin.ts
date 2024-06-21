'use server';

import createSupabaseServerClient from '../lib/supabase/server'

const signinWithEmailPassword = async (formdata: any) => {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
        email: formdata.email,
        password: formdata.password
    })
    if (error !== null) {
        return JSON.stringify({ success: false, error: error.message })
    } else if (data !== null) {
        return JSON.stringify({ success: true })
    }
}

export default signinWithEmailPassword