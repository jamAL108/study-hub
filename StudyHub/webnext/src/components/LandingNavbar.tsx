'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Router, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation';
const Navbar = () => {
    const router = useRouter()
    return (
        <div className='w-full flex justify-center'>
            <div className='w-[min(90vw,1400px)] py-2 flex justify-between items-center'>
                <Image src='/images/vidchat.png' alt='qwerty' width={160} height={32} className='select-none' />
                <div className='flex justify-center pl-[100px] text-sm items-center gap-10 font-[450]'>
                    <h2>Product</h2>
                    <h2>About</h2>
                    <h2>Communtiy</h2>
                    <h2>Privacy</h2>
                </div>
                <div className='flex items-center justify-center gap-4'>
                    <Button className='text-white bg-accent border rounded-xl transition duration-300 ease-in max-h-[100px] py-5 hover:bg-background' >
                        <Star className='mr-1 h-4 w-4' />
                        Star
                        <Badge className='ml-3 px-1 rounded-md'>24.1k</Badge>
                    </Button>
                    <Button onClick={(e: any) => {
                        router.push('/auth/sign-in')
                    }} className='rounded-xl max-h-[100px] py-5 px-5'>Get Started</Button>
                </div>
            </div>
        </div>
    )
}

export default Navbar