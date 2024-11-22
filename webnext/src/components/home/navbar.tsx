import React, { useState } from 'react'
import Link from "next/link"
import {
    CircleUser,
    Menu,
    Fullscreen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from 'next/navigation'
import {
    MessagesSquare,
    FileText
} from "lucide-react"
import { MdOutlineExplore } from "react-icons/md";
import { MessageCircleQuestion } from 'lucide-react';
import Image from 'next/image'

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
import { GoProjectRoadmap } from "react-icons/go";

const Navbar: React.FC<any> = (props) => {
    const pathname = usePathname()
    const [sheetOpen, setSheetOpen] = useState<boolean>(false)
    const { loader, user } = props
    const [deleteAlert, setDeleteAlert] = useState<boolean>(false)
    const [deleteLoader, setDeleteloader] = useState<boolean>(false)

    return (
        <header className="base:flex bl:hidden py-2 pt-3 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen} >
                <SheetTrigger asChild>
                    <Button
                        onClick={(e) => setSheetOpen(true)}
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col py-8">
                    <div className="flex h-14 items-center border-b lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Image src='/images/logoStud.png' alt='qwerty' width={140} height={22} className='select-none' />
                        </Link>
                    </div>
                    <nav className="grid items-start text-sm font-medium gap-1">
                        <Link
                            onClick={(e) => setSheetOpen(false)}
                            href="/home/learnmap"
                            className={`flex items-center gap-3 ${pathname ? pathname.includes('learnmap') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                        >
                            <GoProjectRoadmap className="h-4 w-4" />
                            Learn Map
                        </Link>
                        <Link
                            onClick={(e) => setSheetOpen(false)}
                            href="/home/chat"
                            className={`flex items-center gap-3 ${pathname ? pathname.includes('chat') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                        >
                            <MessagesSquare className="h-4 w-4" />
                            Chat History
                        </Link>
                        <Link
                            onClick={(e) => setSheetOpen(false)}
                            href="/home/docxAI"
                            className={`flex items-center gap-3 ${pathname ? pathname.includes('docxAI') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                        >
                            <FileText className="h-4 w-4" />
                            DocsAI{" "}
                        </Link>
                        <Link
                            onClick={(e) => setSheetOpen(false)}
                            href="/home/Quiz"
                            className={`flex items-center gap-3 ${pathname ? pathname.includes('Quiz') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                        >
                            <MessageCircleQuestion className="h-4 w-4" />
                            Quiz
                        </Link>
                        <Link
                            onClick={(e) => setSheetOpen(false)}
                            href="/explore"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <MdOutlineExplore className="h-4 w-4" />
                            Explore
                        </Link>
                        <Link
                            onClick={(e) => setSheetOpen(false)}
                            href="/home/image-textify"
                            className={`flex items-center gap-3 ${pathname ? pathname.includes('image-textify') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2.5  transition-all hover:text-primary text-sm font-medium `}
                        >
                            <Fullscreen className="h-4 w-4" />
                            Image Textify
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className='w-full flex-1 flex justify-end items-center'>
                <Popover>
                    <PopoverTrigger asChild><div className='px-3 py-3 rounded-full bg-[#43A8EE] flex justify-center items-center text-md text-white'>
                        <FaRegUser className='h-4 w-4' />
                    </div></PopoverTrigger>
                    <PopoverContent className='absolute px-0 pb-0 right-[-30px] border-[2px] flex flex-col  rounded-xl top-1'>
                        <div className='w-full px-4 flex gap-3 pb-4 border-b-[2px] items-center'>
                            <div className='userIcon w-8 h-8 flex justify-center items-center'>
                                {user ? user.email[0] : 'U'}
                            </div>
                            <p className='tracking-wider'>{user ? ShrinkTitle(user.email, 21) : ''}</p>
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
            </div>
        </header>
    )
}

export default Navbar