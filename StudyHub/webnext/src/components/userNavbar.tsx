'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Router, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation';
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
import Link from 'next/link';
import { ShrinkTitle } from '@/utils'
const Navbar: React.FC<any> = (props) => {
    const { loader, user } = props
    const router = useRouter()
    const [deleteAlert, setDeleteAlert] = useState<boolean>(false)
    const [deleteLoader, setDeleteloader] = useState<boolean>(false)
    return (
        <div className='w-full flex justify-center'>
            <div className='w-[min(90vw,1400px)] py-3  flex justify-between items-center'>
                <div className='flex items-center gap-16'>
                    <Image src='/images/vidchat.png' alt='qwerty' width={160} height={32} className='select-none' />
                    {loader ? (
                        <div className='flex justify-center text-sm items-center gap-10 font-[450]'>
                            <Skeleton className="h-4 w-[90px]" />
                            <Skeleton className="h-4 w-[85px]" />
                            <Skeleton className="h-4 w-[85px]" />

                        </div>
                    ) : (
                        <div className='flex justify-center text-[0.77rem] items-center gap-10 font-[450]'>
                            <Link href={'/qwerty'}>Other Product</Link>
                            <Link href={'/home/chat'}>Workspace</Link>
                            <Link href={'/explore'}>Discover</Link>
                        </div>
                    )
                    }
                </div>
                <div className='flex items-center justify-center gap-4'>
                    {loader ? (
                        <Skeleton className="h-12 w-12 rounded-full" />
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild><div className='px-3 py-3 rounded-full bg-[#43A8EE] flex justify-center items-center text-md text-white'>
                                <FaRegUser className='h-4 w-4' />
                            </div></PopoverTrigger>
                            <PopoverContent className='absolute px-0 pb-0 right-[-30px] border-[2px] flex flex-col  rounded-xl top-1'>
                                <div className='w-full px-4 flex gap-3 pb-4 border-b-[2px] items-center'>
                                    <div className='userIcon w-8 h-8 flex justify-center items-center'>
                                        J
                                    </div>
                                    <p className='tracking-wider'>{user ? ShrinkTitle(user.email,21) : ''}</p>
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
            </div >
        </div >
    )
}

export default Navbar