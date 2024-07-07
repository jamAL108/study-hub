'use server';

import createSupabaseServerClient from '../lib/supabase/server'
import { extractEmailInputPrefix } from '@/utils'

const signupWithEmailPassword = async (formdata: any) => {
    const supabase = await createSupabaseServerClient()
    const result: any = await supabase.auth.signUp({
        email: formdata.email,
        password: formdata.password,
        options: {
            data: {
                name: extractEmailInputPrefix(formdata.email),
            },
        },
    })
    const User = result.data;
    // console.log(User)
    if (result.data.user !== null) {
        console.log(result.data.user.id);
        const { data, error } = await supabase
            .from('vidchatUser')
            .insert([
                { id: result.data.user.id, name: extractEmailInputPrefix(formdata.email), email: formdata.email },
            ])
            .select()

        if (data !== null) {
            return JSON.stringify({ success: true })
        } else {
            const { data: d, error: e } = await supabase.auth.admin.deleteUser(
                result.data.user.id
            )
            return JSON.stringify({ sucess: false, error: error.message })
        }

    } else if (result.data.user === null) {
        return JSON.stringify({ success: false, error: result.error.message })
    }
}

export default signupWithEmailPassword