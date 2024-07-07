'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Router, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import Link from 'next/link'

const Navbar = () => {
    const router = useRouter()
    return (
        <div className='w-full flex justify-center'>
            <div className='w-[min(90vw,1400px)] base:py-6 bl:py-3.5 flex justify-between items-center'>
                <Image src='/images/logoStud.png' alt='qwerty' width={160} height={32} className='select-none' />
                <div className='base:hidden bl:flex justify-center pl-[100px] text-sm items-center gap-10 font-[450]'>
                    <h2>Product</h2>
                    <h2>About</h2>
                    <h2>Communtiy</h2>
                    <h2>Privacy</h2>
                </div>
                <div className='base:hidden bl:flex items-center justify-center gap-4'>
                    <Button className='text-white bg-accent border rounded-xl transition duration-300 ease-in max-h-[100px] py-5 hover:bg-background' >
                        <Star className='mr-1 h-4 w-4' />
                        Star
                        <Badge className='ml-3 px-1 rounded-md'>24.1k</Badge>
                    </Button>
                    <Button onClick={(e: any) => {
                        router.push('/auth/sign-in')
                    }} className='rounded-xl max-h-[100px] py-5 px-5'>Get Started</Button>
                </div>

                <Sheet>
                    <SheetTrigger asChild className='base:flex bl:hidden'>
                        <Menu className='h-6 w-6 mr-3' />
                    </SheetTrigger>
                    <SheetContent className='w-[85vw]'>
                        <nav className="grid gap-6 mt-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                Product
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                About
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-foreground"
                            >
                                Communtiy
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                Privacy
                            </Link>
                        </nav>
                        <SheetFooter  className='absolute bottom-10 flex flex-col gap-6 w-[70vw]' >
                            <Button className='text-white bg-accent border rounded-xl transition duration-300 ease-in  py-5 hover:bg-background' >
                                <Star className='mr-1 h-4 w-4' />
                                Star
                                <Badge className='ml-3 px-1 rounded-md'>24.1k</Badge>
                            </Button>
                            <Button onClick={(e: any) => {
                                router.push('/auth/sign-in')
                            }} className='rounded-xl  py-5 px-5'>Get Started</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default Navbar