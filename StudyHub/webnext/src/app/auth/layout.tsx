import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex-1 min-h-[100vh] h-[100vh] overflow-y-auto flex'>
            <div className='w-[42.5%] h-full border-r py-4 flex flex-col'>
                <Link href={'/'}>
                    <Image src='/images/vidchat.png' alt='qwerty' width={130} height={25} className='select-none mx-4' />
                </Link>
                <div className='w-full flex-1 py-10 px-10 flex justify-center items-center'>
                    {children}
                </div>
            </div>
            <div className='w-[57.5%] h-full  bg-accent/40 flex flex-col'>
                meow
            </div>
        </div>
    );
}