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
import { usePathname } from 'next/navigation'
import checkUserAuthClient from '@/auth/getUserSession'
import { useRouter } from 'next/navigation'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { FaRegUser } from "react-icons/fa";
import { Trash2 } from 'lucide-react';
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
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2 relative">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Image src='/images/vidchat.png' alt='qwerty' width={150} height={25} className='select-none ml-[-10px]' />
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/home/chat"
                                className={`flex items-center gap-3 ${pathname ? pathname.includes('chat') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                            >
                                <MessagesSquare className="h-4 w-4" />
                                Chat History
                            </Link>
                            <Link
                                href="/home/documents"
                                className={`flex items-center gap-3 ${pathname ? pathname.includes('documents') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                            >
                                <FileText className="h-4 w-4" />
                                Documents{" "}
                            </Link>
                            <Link
                                href="/explore"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <MdOutlineExplore className="h-4 w-4" />
                                Explore
                            </Link>
                        </nav>
                    </div>
                    <div className='flex absolute bottom-0 h-24 items-center w-full justify-center gap-4'>
                        {loader ? (
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[120px]" />
                                    <Skeleton className="h-4 w-[180px]" />
                                </div>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className='w-full cursor-pointer rounded-lg mx-6 flex gap-3 items-center'>
                                        <div className='px-3 py-3 rounded-full bg-[#43A8EE] flex justify-center items-center text-md text-white'>
                                            <FaRegUser className='h-4 w-4' />
                                        </div>
                                        <div className='flex flex-col text-sm justify-center'>
                                            <p className='text-xs text-muted-foreground'>Your Account</p>
                                            <p className='text-[0.75rem] tracking-wider'>{user ? ShrinkTitle(user.email,23) : ''}</p>
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className='w-[100%] mr-[40px] mb-[10px] px-0 pb-0  border-[2px] flex flex-col  rounded-xl '>
                                    <div className='w-full px-4 flex gap-3 pb-4 border-b-[2px] items-center'>
                                        <div className='userIcon w-8 h-8 flex justify-center items-center'>
                                            {user.email[0]}
                                        </div>
                                        <p className='tracking-wider'>{user ? ShrinkTitle(user.email,18) : ''}</p>
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
                <Navbar />
                {children}
            </div>
        </div>
    )
}

export default Layout