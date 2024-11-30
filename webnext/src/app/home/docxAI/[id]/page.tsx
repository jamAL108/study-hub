'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import checkUserAuthClient from '@/auth/getUserSession'
// @ts-ignore
import { useRouter } from 'next/navigation'
import SessionNotFoundComp from '@/components/sessionNotFound'
import { changeNameOfDoc, GetVideoFromSupabase } from '@/api/index'
import { cn } from "@/lib/utils";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip"
import { FormatVideoViews, geminiModel, extractEmailInputPrefix, ShrinkTitle } from '@/utils'
import { Progress } from "@/components/ui/progress"
import { UpdateTheVideoChatContent, getChatResponse } from '@/api'
import { ScrollArea } from "@/components/ui/scroll-area"
import { updatePDFChat, resetPinecone, getRawPdfFromSupabase, uploadPdfFile, getSummarizedData, DeleteDocChatFromSupabase } from '@/api'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from '@/components/ui/skeleton'
import QuizSession from './quiz'
import { Copy, RotateCcw, ThumbsDown, ThumbsUp, PencilLine, Trash, Undo, Save } from 'lucide-react'
import { HiOutlineArrowUp } from "react-icons/hi";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ColorRing } from 'react-loader-spinner'


const Page = ({ params }: {
    params: {
        id: string,
    }
}) => {
    const router = useRouter()

    const { toast } = useToast()




    const { id } = params
    const [pdfFile, setPdfFile] = useState<any>(null)
    const [PdfLink, setPdfLink] = useState<string>("")
    const [loader, setLoader] = useState<boolean>(true)
    const [sessionNotFound, setSessionNotFound] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null)
    const [Details, setDetails] = useState<any>({})
    const [currArea, setCurrArea] = useState<number>(-1)
    const [chats, setChats] = useState<any>([])

    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<any>(null);


    ////
    const [topicReceived, setTopicReceived] = useState<boolean>(false)
    const [topic, setTopic] = useState<string>("")
    const [Totalquestions, setTotalquestions] = useState<number>(5)

    ///
    const [summarizedtext, setSummarizedText] = useState<any>(null)
    const [summarySearch, setSummarySearch] = useState<string>('')
    const [summaryLoad, setSummaryLoad] = useState<boolean>(false)


    //// 
    const [message, setMessage] = useState<string>('')

    const [popoverBool, setPopoverBool] = useState<boolean>(false)

    const [docName, setDocName] = useState<string>("")

    const [deleteAlert, setDeleteAlert] = useState<boolean>(false)
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false)


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
            setLoader(false)
            setSessionNotFound(true)
            return
        }
        const userData: any = res.data.session.user
        setPdfLink(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/StudyHub_videos/${userData.id}/${id}.pdf`)
        const ress: any = await GetVideoFromSupabase(id, userData.id)
        if (ress.success === true && res.data !== null && Details !== null) {
            // console.log(ress.data)
            setDetails(ress.data)
            setDocName(ress.data.name)
            setChats(ress.data.chats)
        } else {
            toast({
                title: "Some Error in Server",
                description: "Error in server , try again later",
                variant: 'destructive'
            })
            return
        }
        API(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/StudyHub_videos/${userData.id}/${id}.pdf`)
        setUser(res.data.session.user)
    }

    const API = async (url: string) => {
        if (url) {
            let res = await resetPinecone()
            if (res.success === false) {
                toast({
                    title: "Some Error in Server",
                    description: "Error in server , try again later",
                    variant: 'destructive'
                })
                return
            }
            res = await getRawPdfFromSupabase(url);
            if (res.success === false) {
                toast({
                    title: "Some Error in Server",
                    description: "Error in server , try again later",
                    variant: 'destructive'
                })
                return
            }
            // console.log(res)
            setPdfFile(res.file);
            const formData = new FormData();
            formData.append('file', res.file);
            try {
                const response = await uploadPdfFile(res.file)
                // console.log(response)
                setLoader(false);
            } catch (error) {
                console.error('Error sending PDF to server:', error);
                setLoader(false);
            }
        }
    };

    const sendTextInputToServer = async () => {
        // console.log(Details);

        // Create a new chat array with the new message added
        let newChats = [...chats, { user: message }];
        setChats([...newChats]);
        setMessage("");
        // console.log(newChats);
        const recentChats: any = newChats.slice(-5);
        // console.log(recentChats)


        try {
            setIsTyping(true);
            const response: any = await getChatResponse(message, 'English', recentChats)
            if (response.success === true) {
                // console.log(response)
                // Work with the updated newChats array
                let updatedChats = [...newChats]; // Make a copy of newChats
                // Remove the last chat, update it, and push it back
                let removedLastChat = updatedChats.pop();
                let updatedLastChat = { ...removedLastChat, server: response.text };
                updatedChats.push(updatedLastChat);
                // console.log(updatedChats);
                await updatePDFChat(updatedChats, id)
                setChats([...updatedChats]);
            } else {
                toast({
                    title: "Error sending data to server:",
                    description: response.error,
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: "Error sending data to server:",
                description: "Error in server , try again later",
                variant: 'destructive'
            })
        } finally {
            setIsTyping(false);
        }
    };



    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter' && message.length !== 0) {
            event.preventDefault();
            sendTextInputToServer()
        }
    };

    const GetSummarizedData = async () => {
        setSummarizedText(null)
        setSummaryLoad(true)
        try {
            const response: any = await getSummarizedData(summarySearch)
            // console.log(response)
            if (response.success === false) {
                toast({
                    title: "Some Error in Server",
                    description: response.error,
                    variant: 'destructive'
                })
                setSummaryLoad(false)
                return
            }
            if (response.text) {
                setSummarizedText(response.text);
                setSummaryLoad(false) // Update state with fetched data
            }
        } catch (error: any) {
            toast({
                title: "Some Error in Server",
                description: "Error in server , try again later",
                variant: 'destructive'
            })
            setSummaryLoad(false) // Catch and set any errors that occur during fetch
        }
    }


    const changeNameFunction = async () => {
        const res: any = await changeNameOfDoc(Details.id, docName)
        if (res.success === true) {
            setDetails({ ...Details, name: docName })
            toast({
                duration: 2000,
                title: "Changed Name",
            })
            setPopoverBool(false)
        } else {
            toast({
                duration: 2000,
                title: "Error changing the name",
                variant: 'destructive'
            })
            setPopoverBool(false)
        }
    }


    const deleteFunction = async () => {
        setDeleteLoader(true)
        const res: any = await DeleteDocChatFromSupabase(user.id, Details.id)
        if (res.success === false) {
            toast({
                duration: 2000,
                title: "Error changing the name",
                variant: 'destructive'
            })
            setDeleteLoader(false)
        } else {
            router.push('/home/docxAI')
            toast({
                duration: 2000,
                title: "Decument Data Deleted",
                variant: 'saved'
            })
        }
    }


    if (sessionNotFound) {
        return <SessionNotFoundComp />
    }


    return (
        <div className='flex-1 flex justify-center pt-6 px-8 overflow-x-hidden'>
            <Card className={`w-full p-5 border-none ${currArea !== -1 ? 'w-[50%]' : 'w-full'} `}>
                <CardHeader>
                    <CardTitle className='xl'>
                        {/* className='flex items-center gap-2' */}
                        {/* <Image src='/images/flash.png' width={50} height={50} alt='sdv' /> */}
                        DocxAI Features
                    </CardTitle>
                    <CardDescription>A list of Features provided for Documents.</CardDescription>
                </CardHeader>
                {loader === false && (
                    <div className='w-full flex items-center px-5'>
                        <div className='flex gap-1'>
                            <Image src='/images/pdf.png' alt='sadc' width={50} height={50} />
                            <div className='group flex-1 flex justify-between items-center gap-10'>
                                <div className='flex flex-col justify-center'>
                                    <h1 className='text-bold'>{Details?.name ? ShrinkTitle(Details.name,33) : "NA"}</h1>
                                    <p className='text-muted-foreground  text-sm'>{pdfFile ? `${(Number(pdfFile.size) / 1024).toFixed(2)} kb` : "NA"}</p>
                                </div>
                                <div className='flex items-center'>
                                    <Popover open={popoverBool} onOpenChange={(e) => {
                                        setPopoverBool(e)
                                    }}>
                                        <PopoverTrigger>
                                            <Button size={'icon'} className={`${popoverBool === true ? 'opacity-1' : 'opacity-0'} group-hover:opacity-[1]  transition-opacity text-lg text-muted-foreground hover:text-white rounded-r-none`} variant={'secondary'}><PencilLine /></Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='group'>
                                            <Input
                                                id="name"
                                                value={docName}
                                                onChange={(e) => setDocName(e.target.value)}
                                                className="col-span-2 h-8 focus-visible:ring-0 focus-within:ring-0"
                                            />
                                            <div className='mt-4 flex items-center gap-3'>
                                                <Button onClick={(e) => {
                                                    e.preventDefault()
                                                    changeNameFunction()
                                                }} size={'sm'} variant={'secondary'} className='text-xs min-h-0 h-auto py-1 px-2'><Save /> Save</Button>
                                                <Button onClick={(e) => {
                                                    setDocName(Details.name)
                                                    setPopoverBool(false)
                                                }} size={'sm'} variant={'secondary'} className='text-xs min-h-0 h-auto py-1 px-2'><Undo /> Undo</Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <AlertDialog open={deleteAlert} onOpenChange={setDeleteAlert}>
                                        <AlertDialogTrigger>
                                            <Button size={'icon'} className={`${popoverBool === true ? 'opacity-1' : 'opacity-0'} group-hover:opacity-[1]  transition-opacity text-lg text-muted-foreground hover:text-white rounded-l-none`} variant={'secondary'}><Trash /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className='base:w-[90vw] tv:w-[400px] base:rounded-[10px] pb-[28px] !pt-[23px]'>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this task
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className='base:flex-row tv:flex-row base:justify-end base:gap-[10px]'>
                                                <button className='border-[2px] hover:bg-accent tracking-wide text-[0.8rem] font-[450] px-[10px] py-[2px] rounded-[4px] ' onClick={(e) => setDeleteAlert(false)}>Cancel</button>
                                                <button disabled={deleteLoader} style={deleteLoader === true ? { opacity: 0.67 } : { opacity: 1 }}

                                                    className={`${deleteLoader === true ? "bg-[#e5484d] text-white hover:text-white hover:bg-[#e5484d]" : "bg-background text-[#e5484d] hover:text-white hover:bg-[#e5484d]"} text-[0.8rem] tracking-wide font-[450] px-[10px] py-[2px] flex justify-center items-center gap-1 rounded-[4px]   border-[#e5484d] border`} onClick={(e) => {
                                                        deleteFunction()
                                                    }}>
                                                    <ColorRing
                                                        visible={deleteLoader}
                                                        height="20"
                                                        width="20"
                                                        ariaLabel="color-ring-loading"
                                                        wrapperStyle={{}}
                                                        wrapperClass="color-ring-wrapper"
                                                        colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                                                    />
                                                    Delete</button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {loader === true ? (
                    <CardContent className='w-full flex flex-col gap-8 py-5'>

                        <div className='w-full flex flex-wrap gap-8 py-5'>
                            <Skeleton className='px-5 border w-[470px] h-[110px] rounded-xl py-5 flex gap-5 ' />
                            <Skeleton className='px-5 border w-[470px] h-[110px]  rounded-xl py-5 flex gap-5 ' />
                            <Skeleton className='px-5 border w-[470px] h-[110px]  rounded-xl py-5 flex gap-5 ' />
                        </div>
                    </CardContent>
                ) : loader === false && (
                    <CardContent className='w-full relative flex gap-8 py-5'>
                        <div className={`w-full flex flex-wrap gap-8 py-5`}>
                            <div onClick={(e) => {
                                setCurrArea(3)
                            }} className={`px-4 ${currArea === 3 ? 'bg-accent' : 'bg-accent/30 '} border max-w-[450px] rounded-xl py-4 flex gap-5 cursor-pointer relative`}>
                                {currArea === 3 && (
                                    <p className='min-w-8 blink min-h-8 rounded-full text-green-500  absolute top-3 right-2'>
                                        ●
                                    </p>
                                )}
                                <div className='flex justify-center items-center h-full'>
                                    <img src='/images/summarizer.png' alt='dccf' className='w-[55px] h-[55px]' />
                                </div>
                                <div className='flex flex-col gap-2 justify-center'>
                                    <h2 className='text-lg font-bold'>Document Summarization</h2>
                                    <p className='text-xs text-muted-foreground'>Summarize the whole document aand get a quick overview of document</p>
                                </div>
                            </div>
                            <div onClick={(e) => {
                                setCurrArea(1)
                            }} className={`px-4 ${currArea === 1 ? 'bg-accent' : 'bg-accent/30 '} border max-w-[450px] rounded-xl py-4 flex gap-5  cursor-pointer relative`}>
                                {currArea === 1 && (
                                    <p className='min-w-8 blink min-h-8 rounded-full text-green-500  absolute top-3 right-2'>
                                        ●
                                    </p>
                                )}
                                <div className='flex justify-center items-center h-full'>
                                    <img src='/images/chat3dd.png' alt='dccf' className='w-[55px] h-[55px]' />
                                </div>
                                <div className='flex flex-col gap-2 justify-center'>
                                    <h2 className='text-lg font-bold'>Chat with AI</h2>
                                    <p className='text-xs text-muted-foreground'>Ask any document-related question, and our AI will assist you.</p>
                                </div>
                            </div>
                            <div onClick={(e) => {
                                setCurrArea(2)
                            }} className={`px-4 border ${currArea === 2 ? 'bg-accent' : 'bg-accent/30 '} max-w-[450px] rounded-xl py-4 flex gap-5  cursor-pointer relative`}>
                                {currArea === 2 && (
                                    <p className='min-w-8 blink min-h-8 rounded-full text-green-500  absolute top-3 right-2'>
                                        ●
                                    </p>
                                )}
                                <div className='flex justify-center items-center h-full'>
                                    <img src='/images/bulbb.png' alt='dccf' className='w-[55px] h-[55px]' />
                                </div>
                                <div className='flex flex-col gap-2 justify-center'>
                                    <h2 className='text-lg font-bold'>Get Mcq Quiz</h2>
                                    <p className='text-xs text-muted-foreground'>Get the MCQs related to document to test your understanding</p>
                                </div>
                            </div>
                        </div >
                    </CardContent>
                )}
            </Card>
            <Card className={`border-none ${currArea == -1 ? 'hidden' : 'flex w-[50%] h-[95%]'}`}>
                <div className='w-full border-none h-full overflow-x-hidden'>
                    {currArea == 1 && (
                        <div className='w-full h-[100%] relative flex flex-col rounded-2xl items-center'>
                            <ScrollArea className='w-full max-h-[calc(100%_-_140px)] overflow-y-auto px-1 py-4'>
                                <section ref={chatContainerRef} className='w-full h-full flex flex-col gap-1  py-3'>
                                    {chats != null && chats.length !== 0
                                        && chats.map((chat: any, index: number) => (
                                            <div key={index + 'qwerty'} className='w-full flex flex-col gap-0 pb-2'>
                                                {chat.user && (
                                                    <div className='flex items-center gap-2'>
                                                        <div className='iconsuser w-7 h-7 flex justify-center items-center capitalize'>
                                                            {user ? user.email[0] : 'U'}
                                                        </div>
                                                        <p className={`justify-start w-full flex items-center !text-xl`}>
                                                            <span className={`text-[0.95rem] max-w-[95%]  py-3 rounded-md`} style={{ textAlign: "left" }}>{chat.user}</span>
                                                        </p>
                                                    </div>
                                                )}
                                                {
                                                    chat.server && (
                                                        <div className='flex flex-col gap-3 pb-2 '>
                                                            <div className='flex items-start gap-2'>
                                                                <img src="/images/hubsolo.png" className='my-3 w-7 h-7' alt="" />
                                                                <p className={`justify-start w-full flex items-center`}>
                                                                    <span className={`bg-background/70 text-sm max-w-[90%]  py-3 rounded-md`} style={{ textAlign: "left" }}>{chat.server && chat.server}</span>
                                                                </p>
                                                            </div>
                                                            {index !== 0 && <div className='flex items-center gap-2 text-xs px-10' >
                                                                <Button size={'sm'} variant={'secondary'} className='text-xs min-h-0 h-auto py-1 px-2'><Copy /> Copy</Button>
                                                                <Button size={'sm'} variant={'secondary'} className='text-xs min-h-0 h-auto px-2 py-1'><RotateCcw /> Retry</Button>
                                                                <Button size={'sm'} variant={'secondary'} className='text-xs min-h-0 h-auto px-2 py-1'><ThumbsDown /></Button>
                                                                <Button size={'sm'} variant={'secondary'} className='text-xs min-h-0 h-auto px-2 py-1'><ThumbsUp /></Button>
                                                            </div>}
                                                        </div>

                                                    )
                                                }
                                            </div>
                                        ))
                                    }
                                    {isTyping &&
                                        <div className='flex items-center gap-2'>
                                            <img src="/images/hubsolo.png" className=' w-7 h-7' alt="" />
                                            <p className='justify-start w-full flex items-center'>
                                                <i className='bg-background/70 text-muted-foreground text-sm max-w-[75%]  py-3 rounded-md'>{isTyping ? "is thinking..." : ""}</i>
                                            </p>
                                        </div>
                                    }
                                </section>
                            </ScrollArea>
                            <form
                                className="absolute bottom-4 w-full overflow-hidden rounded-xl border-[2px] bg-background"
                            >
                                <Label htmlFor="message" className="sr-only">
                                    Message
                                </Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onKeyDown={handleKeyDown}
                                    disabled={isTyping}
                                    placeholder="Type your message here..."
                                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 focus-within:ring-0"
                                    autoComplete="off"
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className="flex items-center p-3 pt-0">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Mic className="size-4" />
                                                    <span className="sr-only">Use Microphone</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">Use Microphone</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <Button size="icon" onClick={(e) => {
                                        e.preventDefault()
                                        sendTextInputToServer()
                                    }} className="ml-auto">
                                        <HiOutlineArrowUp size={6} />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {currArea === 2 && topicReceived === false ? (
                        <div
                            className="flex flex-1 items-start mt-20 justify-center rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1"
                        >
                            <Card className="border-none">
                                <CardHeader>
                                    <CardTitle>Knowledge Card</CardTitle>
                                    <CardDescription className='w-[70%]'>Challenge yourself with quick, engaging MCQs. Tap to check your answers instantly.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form>
                                        <div className="flex w-full items-center gap-8">
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="topic">Topic</Label>
                                                <Input id="name" value={topic} onChange={(e) => {
                                                    e.preventDefault()
                                                    setTopic(e.target.value)
                                                }} placeholder="Topic in which you want to test" className='w-[300px]' />
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="uestions">Questions</Label>
                                                <Select value={String(Totalquestions)} onValueChange={(e) => {
                                                    setTotalquestions(Number(e));
                                                }}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select a Questions" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Questions</SelectLabel>
                                                            <SelectItem value="3">3</SelectItem>
                                                            <SelectItem value="5">5</SelectItem>
                                                            <SelectItem value="10">10</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-end mt-6">
                                    <Button onClick={(e) => {
                                        e.preventDefault()
                                        setTopicReceived(true)
                                    }}>Start Test</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ) : currArea == 2 && topicReceived === true ? (
                        <QuizSession setTopicReceived={setTopicReceived} setTopic={setTopic} setTotalquestions={setTotalquestions} topicReceived={topicReceived} topic={topic} Totalquestions={Totalquestions} setCurrArea={setCurrArea} />
                    ) : currArea === 3 && (
                        <div className='w-full px-5 h-full overflow-hidden py-5 flex flex-col gap-2'>
                            <div className='w-full flex flex-col gap-6'>
                                <h1 className='text-[600] font-lg'>Summarized Text.</h1>
                                <div className='w-full flex gap-3'>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="topic">Topic</Label>
                                        <Input id="name" value={summarySearch} onChange={(e) => {
                                            e.preventDefault()
                                            setSummarySearch(e.target.value)
                                        }} placeholder="Which Topic you want to summarize ?" className='w-[300px]' />
                                    </div>
                                    <div className='flex justify-end items-end'>
                                        <Button disabled={summarySearch.length === 0} onClick={(e) => {
                                            e.preventDefault()
                                            setSummarizedText("")
                                            GetSummarizedData()
                                        }}>Summarize</Button>
                                    </div>
                                </div>
                            </div>
                            <ScrollArea className='flex w-full mt-8 !h-[calc(100vh_-_200px)] flex-col !gap-8 !overflow-y-auto'>
                                {
                                    summaryLoad === true ? (
                                        <div className='w-full flex flex-col gap-4'>
                                            <Skeleton className='w-full h-5' />
                                            <Skeleton className='w-[80%] h-5' />
                                            <Skeleton className='w-[75%] h-5' />
                                            <Skeleton className='w-[80%] h-5' />
                                        </div>
                                    ) : summarizedtext !== null && (
                                        Object.entries(summarizedtext).map(([sectionKey, sectionValue]: any, index: number) => (
                                            <p key={index}>
                                                <strong>{sectionKey.replace(/_/g, ' ')}:</strong> {sectionValue}
                                            </p>
                                        ))
                                        // <div className='pr-2 flex flex-col gap-[5px]' dangerouslySetInnerHTML={{ __html: summarizedtext }} />
                                    )
                                    // summarizedtext.split('\n').map((line, index) => (
                                    //     <p className='text-md mt-3' key={index}>{line}</p>
                                    // ))
                                }
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </Card >
        </div >
    )
}

export default Page