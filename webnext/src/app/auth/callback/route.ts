'use server';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {

  const requestURL = new URL(request.url)
  const { searchParams } = requestURL
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  // const origin ='https://thevotum.com'
  const origin = 'https://vidchat-ai.vercel.app'
  console.log(origin)

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    const { data, error }: any = await supabase.auth.exchangeCodeForSession(code)
    console.log(data)
    console.log("MEOW")
    // data.session.user.id
    if (!error) {
      const booluuu = true
      const email = data.user.user_metadata.email
      const name = data.user.user_metadata.full_name
      let { data: userFindData, error: userFindError }: any = await supabase
        .from('vidchatUser')
        .select("*")
        .eq('id', data.session.user.id)
      ///avatar_url
      if (userFindData.length === 0) {
        const { data: userCreatedData, error: userCreatedError } = await supabase
          .from('vidchatUser')
          .insert([
            { id: data.session.user.id, email: email, name: name },
          ])
          .select()
        if (userCreatedData !== null) {
          return NextResponse.redirect(`${origin}/home/chat`)
        } else {
          return NextResponse.redirect(`${origin}/auth/sign-in`)
        }
      }
      return NextResponse.redirect(`${origin}/home/chat`)
    } else {
      return NextResponse.redirect(`${origin}/auth/sign-in`)
    }
  }
}
