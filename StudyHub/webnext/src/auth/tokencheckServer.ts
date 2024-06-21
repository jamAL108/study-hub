'use server';
import readUserSession from '@/lib/action/server'
import { redirect } from 'next/navigation'

export async function sendItToSignup() {
    const { data } = await readUserSession()
    if (!data.session) {
        return redirect('/auth/signup')
    }
}

export async function senditToMain(){
    const { data } = await readUserSession()
    if (data.session) {
        return redirect('/home/dashboard')
    }
}

export async function tokenCheckServerSide(){
    const { data } = await readUserSession()
    return data
}