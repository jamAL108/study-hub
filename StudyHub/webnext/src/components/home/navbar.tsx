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

const Navbar = () => {
    const pathname = usePathname()
    const [sheetOpen, setSheetOpen] = useState<boolean>(false)

    return (
        <header className="base:flex bl:hidden h-14 py-6 pt-7 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default Navbar