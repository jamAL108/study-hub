'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/home/navbar'
import Link from "next/link"
import {
    Bell,
    Home,
    MessagesSquare,
    FileText
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { MdOutlineExplore } from "react-icons/md";
// @ts-ignore
import { usePathname } from 'next/navigation'
import checkUserAuthClient from '@/auth/getUserSession'
// @ts-ignore
import { useRouter } from 'next/navigation'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { FaRegUser } from "react-icons/fa";
import { Trash2 } from 'lucide-react';
import { MessageCircleQuestion, Text, Youtube } from 'lucide-react';
import { FiLogOut } from "react-icons/fi";
import { FaQuestion } from "react-icons/fa6";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { SignOutWithSupabase } from '@/auth'
import { ShrinkTitle } from '@/utils'
import { Fullscreen } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { GoProjectRoadmap } from "react-icons/go";
import { Rocket } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const router = useRouter()
    const [loader, setLoader] = useState<boolean>(true)
    const [user, setUser] = useState<any>(null)
    const [deleteLoader, setDeleteloader] = useState<boolean>(false)
    const [deleteAlert, setDeleteAlert] = useState<boolean>(false)

    useEffect(() => {
        getAllInvoicefunciton()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getAllInvoicefunciton = async () => {
        const res: any = await checkUserAuthClient()
        if (res.error !== null) {
            router.push('/')
            return
        }
        if (res.data.session === null) {
            return
        }
        setUser(res.data.session.user)
        setLoader(false)
    }
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">

            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2 relative">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Image src='/images/logoStud.png' alt='qwerty' width={120} height={20} className='select-none' />
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-xs font-medium lg:px-4">
                            <Link
                                href="/home/learnmap"
                                className={`flex items-center gap-3 ${pathname ? pathname.includes('learnmap') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                            >
                                <GoProjectRoadmap className="h-4 w-4" />
                                Learn Map
                            </Link>
                            <Link
                                href="/home/chat"
                                className={`flex items-center gap-3 ${pathname ? pathname.includes('chat') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                            >
                                <MessagesSquare className="h-4 w-4" />
                                Chat History
                            </Link>
                            <Link
                                href="/home/docxAI"
                                className={`flex items-center gap-3 ${pathname ? pathname.includes('docxAI') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                            >
                                <FileText className="h-4 w-4" />
                                DocsAI{" "}
                            </Link>
                            <Link
                                href="/explore"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Youtube className="h-4 w-4" />
                                AskVideo
                            </Link>
                            <Link
                                href="/home/NoteNest"
                                className={`flex justify-between items-center gap-3 ${pathname ? pathname.includes('NoteNest') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                            >
                                <h2 className='flex items-center gap-3'>
                                <Text className="h-4 w-4" />
                                NoteNest
                                </h2>
                                <div className={`
                                            inline-flex items-center 
                                            rounded-sm 
                                            bg-orange-100 text-orange-800
                                            border border-orange-300
                                            px-2 py-0 text-[0.55rem]
                                            font-semibold
                                            space-x-2
                                            transition-all
                                            
                                            shadow-lg
                                            `}>
                                    BETA
                                </div>
                            </Link>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1" className='border-b-none'>
                                    <AccordionTrigger
                                        className={`flex items-center gap-3  !no-underline text-muted-foreground bg-transparent rounded-lg px-3 py-2  transition-all hover:text-primary`}
                                    >Other Features</AccordionTrigger>
                                    <AccordionContent className=' pl-2 text-xs'>
                                        <Link
                                            href="/home/Quiz"
                                            className={`flex items-center gap-3 ${pathname ? pathname.includes('Quiz') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                                        >
                                            <MessageCircleQuestion className="h-4 w-4" />
                                            Quiz
                                        </Link>
                                        {/* <Link
                                            href="/home/image-textify"
                                            className={`flex items-center gap-3 ${pathname ? pathname.includes('image-textify') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                                        >
                                            <Fullscreen className="h-4 w-4" />
                                            Image Textify
                                        </Link> */}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </nav>
                    </div>
                    <div className='flex flex-col absolute bottom-6 justify-center w-full  gap-6'>

                        {loader ? (
                            <div className="flex items-center space-x-4 px-6 ">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[120px]" />
                                    <Skeleton className="h-4 w-[180px]" />
                                </div>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className='w-full cursor-pointer rounded-lg px-3 flex gap-3 items-center'>
                                        <div className='px-2 py-2 rounded-full bg-[#43A8EE] flex justify-center items-center text-md text-white'>
                                            <FaRegUser className='h-4 w-4' />
                                        </div>
                                        <div className='flex flex-col text-sm justify-center'>
                                            <p className='text-xs text-muted-foreground'>Your Account</p>
                                            <p className='text-xs tracking-wider'>{user ? ShrinkTitle(user.email, 23) : ''}</p>
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className='w-[100%] mb-[10px] px-0 pb-0  border-[2px] flex flex-col  rounded-xl '>
                                    <div className='w-full px-4 flex gap-3 pb-4 border-b-[2px] items-center'>
                                        <div className='userIcon w-8 h-8 flex justify-center items-center'>
                                            {user ? user.email[0] : 'U'}
                                        </div>
                                        <p className='tracking-wider'>{user ? ShrinkTitle(user.email, 18) : ''}</p>
                                    </div>
                                    <AlertDialog open={deleteAlert} onOpenChange={setDeleteAlert}>
                                        <AlertDialogTrigger asChild>
                                            <div onClick={(e) => {
                                                setDeleteAlert(true)
                                            }} className='flex px-4 gap-3 hover:bg-destructive hover:text-white cursor-pointer py-4 text-sm items-center text-[#ef5656]'>
                                                <Trash2 className='h-5 w-5' />
                                                Delete My Account
                                            </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className='base:w-[90vw] w-[370px] base:rounded-[10px] pb-[28px] !pt-[23px]'>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm to delete your account</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete your account
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className='base:flex-row tv:flex-row base:justify-end gap-2 pt-5'>
                                                <Button variant='outline' className='border-[2px] tracking-wide text-[0.8rem] font-[450] px-[10px] py-[2px] rounded-[4px] min-h-[10px] h-[35px]' onClick={(e) => setDeleteAlert(false)}>Cancel</Button>
                                                <Button disabled={deleteLoader} style={deleteLoader === true ? { opacity: 0.67 } : { opacity: 1 }}
                                                    className={`${deleteLoader === true ? "op0" : "op1"} bg-[#e5484d] hover:bg-[#e5484d]/80 text-[0.8rem] tracking-wide font-[450] px-[10px] py-[2px] flex justify-center items-center gap-1 rounded-[4px] min-h-[10px] h-[35px]  border`} onClick={(e) => {
                                                        // deleteFunction()
                                                    }}>
                                                    {deleteLoader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Delete</Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <div className='flex px-4 gap-3  cursor-pointer py-4 text-sm items-center text-white'>
                                        <FaQuestion className='h-5 w-5' />
                                        How it Works ?
                                    </div>

                                    <div onClick={(e) => {
                                        e.preventDefault()
                                        SignOutWithSupabase()
                                    }} className='flex hover:bg-accent cursor-pointer px-4 gap-3 py-4 border-t-[2px] items-center text-white'>
                                        <FiLogOut className='h-5 w-5' />
                                        Log out
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto h-[100vh]">
                <Navbar user={user} loader={loader} />
                {children}
            </div>
        </div>
    )
}

export default Layout