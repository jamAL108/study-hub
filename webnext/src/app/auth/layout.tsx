import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GlobeDemo } from './globe'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex-1 min-h-[100vh] h-[100vh] overflow-y-auto flex'>
            <div className='base:w-full bl:w-[42.5%] h-full border-r base:py-8 bl:py-4 flex flex-col'>
                <Link href={'/'}>
                    <Image src='/images/logoStud.png' alt='qwerty' width={130} height={25} className='select-none mx-4 ' />
                </Link>
                <div className='w-full flex-1 py-10 base:px-4 bl:px-10 flex justify-center items-center'>
                    {children}
                </div>
            </div>
            <div className='w-[57.5%] h-full overflow-hidden bg-accent/40 base:hidden bl:flex flex-col'>
                <GlobeDemo/>
            </div>
        </div>
    );
}