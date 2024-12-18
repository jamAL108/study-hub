'use client'
import * as React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { VersionSwitcher } from "@/components/ui/slide"


// This is sample data.
const data = {
    navMain: [
        {
            title: "Getting Started",
            url: "#",
            items: [
                {
                    title: "Learn Map",
                    url: "/home/learnmap",
                    isActive: false
                },
                {
                    title: "Chat History",
                    url: "/home/chat",
                    isActive: false
                },
                {
                    title: "DocsAI",
                    url: "/home/docxAI",
                    isActive: false
                },
                {
                    title: "NoteNest",
                    url: "/home/NoteNest",
                    isActive: false
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [sidecontent, setSideContent] = React.useState(data)

    return (
        <Sidebar {...props} >
            <SidebarHeader>
                <VersionSwitcher />
            </SidebarHeader>
            <SidebarContent className="!bg-accent/40">
                {/* We create a SidebarGroup for each parent. */}
                {sidecontent.navMain.map((item: any, ii: number) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item: any, index: number) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive}>
                                            <a href={item.url} onClick={(e) => {
                                                let temp = [...sidecontent.navMain]
                                                const updatedItems = temp.map((i: any, idx: number) => ({
                                                    ...i,
                                                    isActive: idx === index
                                                }));
                                                setSideContent({ ...sidecontent, navMain: updatedItems });
                                            }}>{item.title}</a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}



{/* <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2 relative">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Image src='/images/logoStud.png' alt='qwerty' width={150} height={25} className='select-none' />
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
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
                                className={`flex items-center gap-3 ${pathname ? pathname.includes('NoteNest') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                            >
                                <Text className="h-4 w-4" />
                                NoteNest
                            </Link>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1" className='border-b-none'>
                                    <AccordionTrigger
                                        className={`flex items-center gap-3  !no-underline text-muted-foreground bg-transparent rounded-lg px-3 py-2  transition-all hover:text-primary`}
                                    >Other Features</AccordionTrigger>
                                    <AccordionContent className=' pl-2'>
                                        <Link
                                            href="/home/Quiz"
                                            className={`flex items-center gap-3 ${pathname ? pathname.includes('Quiz') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                                        >
                                            <MessageCircleQuestion className="h-4 w-4" />
                                            Quiz
                                        </Link>
                                        <Link
                                            href="/home/image-textify"
                                            className={`flex items-center gap-3 ${pathname ? pathname.includes('image-textify') === true ? 'text-primary bg-muted' : 'text-muted-foreground bg-transparent' : 'text-muted-foreground bg-transparent'} rounded-lg px-3 py-2  transition-all hover:text-primary`}
                                        >
                                            <Fullscreen className="h-4 w-4" />
                                            Image Textify
                                        </Link>
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
                                    <div className='w-full cursor-pointer rounded-lg px-6 flex gap-3 items-center'>
                                        <div className='px-3 py-3 rounded-full bg-[#43A8EE] flex justify-center items-center text-md text-white'>
                                            <FaRegUser className='h-4 w-4' />
                                        </div>
                                        <div className='flex flex-col text-sm justify-center'>
                                            <p className='text-xs text-muted-foreground'>Your Account</p>
                                            <p className='text-[0.75rem] tracking-wider'>{user ? ShrinkTitle(user.email, 23) : ''}</p>
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className='w-[100%] mr-[40px] mb-[10px] px-0 pb-0  border-[2px] flex flex-col  rounded-xl '>
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
            </div> */}