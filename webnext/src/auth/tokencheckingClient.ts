'use client';
import readUserSession from '@/lib/action/client';

export default async function checkUserAuthClient() {
    // console.log("HELOO")
    const { data } = await readUserSession()
    // console.log(data)
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