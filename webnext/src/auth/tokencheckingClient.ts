'use client';
import readUserSession from '@/lib/action/client';

export default async function checkUserAuthClient() {
    const { data } = await readUserSession()
    if (!data.session) {
        const result ={
            userExist:false
        }
        return result;
    }else{
        const result ={
            userExist:true
        }
        return result;
    }
}