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
import { useRouter } from 'next/navigation'
import SessionNotFoundComp from '@/components/sessionNotFound'
import { GetVideoFromSupabase } from '@/api/index'
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
import { FormatVideoViews, geminiModel, extractEmailInputPrefix } from '@/utils'
import { Progress } from "@/components/ui/progress"
import { UpdateTheVideoChatContent } from '@/api'
import { ScrollArea } from "@/components/ui/scroll-area"
import { updatePDFChat } from '@/api'
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
    const [summarizedtext, setSummarizedText] = useState<string>('')
    const [summarySearch, setSummarySearch] = useState<string>('')
    const [summaryLoad, setSummaryLoad] = useState<boolean>(false)


    //// 
    const [message, setMessage] = useState<string>('')


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
        console.log(ress)
        if (ress.success === true && res.data !== null && Details !== null) {
            console.log(ress.data)
            setDetails(ress.data)
            setChats(ress.data.chats)
        } else {
            toast({
                title: "Some Error in Server",
                description: "Error in server , try again later",
                variant: 'destructive'
            })
            return
        }
        API(`https://jvpehndoafryctlriuse.supabase.co/storage/v1/object/public/StudyHub_videos/${userData.id}/${id}.pdf`)
        setUser(res.data.session.user)
    }

    const API = async (url: string) => {
        if (url) {
            const resp = await fetch('http://localhost:8000/resetpinecone')
            console.log(await resp.json());
            if (!resp.ok) {
                toast({
                    title: "Some Error in Server",
                    description: "Error in server , try again later",
                    variant: 'destructive'
                })
                return
            }
            const response = await fetch(url);
            console.log(url)
            const blob = await response.blob();
            const file = new File([blob], 'your-pdf-file.pdf', { type: 'application/pdf' });
            console.log(file)
            setPdfFile(file);

            const formData = new FormData();
            formData.append('pdf_file', file);
            try {
                const response = await fetch('http://localhost:8000/getpdf', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    console.log('PDF successfully sent to server');
                } else {
                    console.error('Failed to send PDF to server');
                }
                const success = response.ok;
                console.log(success)
                setLoader(false);
            } catch (error) {
                console.error('Error sending PDF to server:', error);
                setLoader(false);
            }
        }
    };

    const sendTextInputToServer = async () => {
        console.log(Details);

        // Create a new chat array with the new message added
        let newChats = [...chats, { user: message }];
        setChats([...newChats]);
        setMessage("");
        console.log(newChats);

        const formData = new FormData();
        formData.append("text", message);
        formData.append("language", 'English');

        try {
            setIsTyping(true);
            const response = await fetch("http://localhost:8000/gettext", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                if (jsonResponse.success) {
                    // Work with the updated newChats array
                    let updatedChats = [...newChats]; // Make a copy of newChats
                    // Remove the last chat, update it, and push it back
                    let removedLastChat = updatedChats.pop();
                    let updatedLastChat = { ...removedLastChat, server: jsonResponse.text };
                    updatedChats.push(updatedLastChat);
                    console.log(updatedChats);
                    setChats([...updatedChats]);
                    await updatePDFChat(updatedChats, id)
                } else {
                    console.error("Server processed request, but returned an error");
                }
            } else {
                console.error("Failed to send data to server");
            }
        } catch (error) {
            console.error("Error sending data to server:", error);
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
        setSummaryLoad(true)
        const formData = new FormData();
        formData.append('topic', summarySearch);

        try {
            const response = await fetch('http://localhost:8000/getsummary/', {
                method: 'POST',
                // Remove the 'Content-Type': 'application/json', header
                body: formData, // Send the FormData
            });

            if (!response.ok) {
                throw new Error('Something went wrong'); // Throw an error if response is not ok
            }

            const data = await response.json(); // Parse JSON response
            console.log(data)
            if (data) {
                setSummarizedText(data);
                setSummaryLoad(false) // Update state with fetched data
            } else {
                alert(data.message || 'Failed to fetch data');
                setSummaryLoad(false) // Set error message if success is false
            }
        } catch (error: any) {
            alert(error.message);
            setSummaryLoad(false) // Catch and set any errors that occur during fetch
        }
    }





    if (sessionNotFound) {
        return <SessionNotFoundComp />
    }


    return (
        <div className='flex-1 flex justify-center py-6 px-8'>
            <Card className={`w-full p-5 border-none ${currArea !== -1 ? 'w-[50%]' : 'w-full'} `}>
                <CardHeader>
                    <CardTitle>DocxAI Features</CardTitle>
                    <CardDescription>A list of Features provided for Documents.</CardDescription>
                </CardHeader>
                {loader === false && (
                    <div className='w-full flex items-center px-5'>
                        <div className='flex gap-4'>
                            <Image src='/images/pdflogo.png' alt='sadc' width={40} height={40} />
                            <div className='flex flex-col justify-center'>
                                <h1 className='text-bold'>{Details?.name ? Details.name : "NA"}</h1>
                                <p className='text-muted-foreground  text-sm'>{pdfFile ? `${(Number(pdfFile.size) / 1024).toFixed(2)} kb` : "NA"}</p>
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
                            }} className={`px-5 ${currArea === 3 ? 'bg-accent' : 'bg-accent/30 '} border max-w-[470px] rounded-xl py-5 flex gap-5 cursor-pointer relative`}>
                                {currArea === 3 && (
                                    <p className='min-w-8 blink min-h-8 rounded-full text-green-500  absolute top-3 right-2'>
                                        ●
                                    </p>
                                )}
                                <Image src='/images/book.svg' alt='dccf' width={55} height={55} />
                                <div className='flex flex-col gap-2 justify-center'>
                                    <h2 className='text-xl font-bold'>Document Summarization</h2>
                                    <p className='text-sm text-muted-foreground'>Summarize the whole document aand get a quixk overview</p>
                                </div>
                            </div>
                            <div onClick={(e) => {
                                setCurrArea(1)
                            }} className={`px-5 ${currArea === 1 ? 'bg-accent' : 'bg-accent/30 '} border max-w-[470px] rounded-xl py-5 flex gap-5  cursor-pointer relative`}>
                                {currArea === 1 && (
                                    <p className='min-w-8 blink min-h-8 rounded-full text-green-500  absolute top-3 right-2'>
                                        ●
                                    </p>
                                )}
                                <Image src='/images/bulb.svg' alt='dccf' width={55} height={55} />
                                <div className='flex flex-col gap-2 justify-center'>
                                    <h2 className='text-xl font-bold'>Chat with AI</h2>
                                    <p className='text-sm text-muted-foreground'>Ask anything related to document to our AI.</p>
                                </div>
                            </div>
                            <div onClick={(e) => {
                                setCurrArea(2)
                            }} className={`px-5 border ${currArea === 2 ? 'bg-accent' : 'bg-accent/30 '} max-w-[470px] rounded-xl py-5 flex gap-5  cursor-pointer relative`}>
                                {currArea === 2 && (
                                    <p className='min-w-8 blink min-h-8 rounded-full text-green-500  absolute top-3 right-2'>
                                        ●
                                    </p>
                                )}
                                <Image src='/images/bulb.svg' alt='dccf' width={55} height={55} />
                                <div className='flex flex-col gap-2 justify-center'>
                                    <h2 className='text-xl font-bold'>Get Mcq Quiz</h2>
                                    <p className='text-sm text-muted-foreground'>Get the MCQs related to document to test your understanding</p>
                                </div>
                            </div>
                        </div >
                    </CardContent>
                )}
            </Card >
            <Card className={`${currArea == -1 ? 'hidden' : 'flex w-[50%] h-full'}`}>
                <div className='w-full px-5 h-full overflow-hidden'>
                    {currArea == 1 && (
                        <div className='w-full h-[95vh] max-h-[95vh] relative flex flex-col rounded-2xl bg-accent/60 items-center'>
                            <ScrollArea className='w-full max-h-[calc(100%_-_140px)] overflow-y-auto px-5 py-4'>
                                <section ref={chatContainerRef} className='w-full h-full flex flex-col gap-4 px-3 py-3'>
                                    {chats != null && chats.length !== 0
                                        && chats.map((chat: any, index: number) => (
                                            <div key={index + 'qwerty'} className='w-full flex flex-col gap-3'>
                                                <p className={`justify-end w-full flex items-center`}>
                                                    <span className={`bg-primary/70 text-sm max-w-[75%] px-3 py-3 rounded-md`} style={{ textAlign: "left" }}>{chat.user}</span>
                                                </p>
                                                {
                                                    chat.server && (
                                                        <p className={`justify-start w-full flex items-center`}>
                                                            <span className={`bg-background/70 text-sm max-w-[75%] px-3 py-3 rounded-md`} style={{ textAlign: "left" }}>{chat.server && chat.server}</span>
                                                        </p>
                                                    )
                                                }
                                            </div>
                                        ))
                                    }
                                    {isTyping && <p className='w-full flex items-center'>
                                        <i className='text-sm max-w-[60%] px-3 py-3 text-lefts rounded-md bg-background'>{isTyping ? "Typing" : ""}</i>
                                    </p>}
                                </section>
                            </ScrollArea>
                            <form
                                className="absolute bottom-4 w-[95%] overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
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
                                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
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
                                    <Button size="sm" onClick={(e) => {
                                        e.preventDefault()
                                        sendTextInputToServer()
                                    }} className="ml-auto gap-1.5">
                                        Send Message
                                        <CornerDownLeft className="size-3.5" />
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
                        <QuizSession topicReceived={topicReceived} topic={topic} Totalquestions={Totalquestions} setCurrArea={setCurrArea} />
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
                            <ScrollArea className='flex w-full mt-10 !h-[calc(100vh_-_200px)] flex-col !gap-8 !overflow-y-auto'>
                                {
                                    summaryLoad === true ? (
                                        <div className='w-full flex flex-col gap-4'>
                                            <Skeleton className='w-full h-5' />
                                            <Skeleton className='w-[80%] h-5' />
                                            <Skeleton className='w-[75%] h-5' />
                                            <Skeleton className='w-[80%] h-5' />
                                        </div>
                                    ) : summarizedtext.length !== 0 && summarizedtext.split('\n').map((line, index) => (
                                        <p className='text-md mt-3' key={index}>{line}</p>
                                    ))
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