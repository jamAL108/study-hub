'use client'
import React, { useEffect, useState, useRef } from 'react'
import { CornerDownLeft, Mic, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
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

const ChatBot: React.FC<any> = (props) => {
    const { extractedText, user, videoMeta, message, setMessage, setChats, chats, params } = props
    const [progress, setProgress] = useState<number>(10)
    let intervalId: any;
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<any>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        const increaseProgress = () => {
            intervalId = setInterval(() => {
                setProgress(prevProgress => {
                    const newProgress = prevProgress + 1;
                    return newProgress > 80 ? 80 : newProgress;
                });
            }, 100);
        };
        increaseProgress();
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (extractedText.length !== 0) {
            clearInterval(intervalId);
        }
    }, [extractedText]);

    // useEffect(() => {
    //     if (user !== null && extractedText.length !== 0 && chats.length === 0) {
    //         console.log(extractEmailInputPrefix(user.email), ":::auth")
    //         if (user.email)
    //             setChats([{ content: `Hello ${extractEmailInputPrefix(user.email)} 👋,\n I am vidChat Bot, how may I help you ?`, role: "assistant" }])
    //         else {
    //             setChats([{ content: `Hello 👋,\n I am Soul-Friend how may I help you ?`, role: "assistant" }])
    //         }
    //     }
    // }, [user, extractedText , chats])

    async function runPrompt(valueOfPrompt: string, previousChats: string[]) {
        let prompt =
            `(Pretend you are vidChat Bot - A video chatbot as a friend, don't mention your name until asked, analyze  the following text (extractedText): ${extractedText}, and give response to the text(user prompt) : '${valueOfPrompt}'. give response based on that (extractedText), and don't answer for any questions which are not related to extractedText . so im converting the youtube video into text so if the text doesnt contain the relevant answer for the (user prompt) then give response like this : ( this topic is not covered in the video)  and also this text is from youtube videos so give answer in this frame , What did the creator: ${videoMeta.channel} speak about xyz , how he/she covered xxx topics.
          These are the context, please condsider them wisely while responding\n` +
            previousChats.join("\n");

        console.log(prompt, "::::propmt")
        const model = geminiModel()
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        return text;
    }

    const chat = async (e: any, message: any) => {
        e.preventDefault();

        if (!message) return;

        setIsTyping(true);

        let msgs = [...chats];
        msgs.push({ role: "user", content: message });
        setChats(msgs);

        setMessage("");

        try {
            const response = await runPrompt(message, msgs.filter((x) => x.role === "user").map((chat: any) => chat.content));
            msgs.push({ role: "assistant", content: response });
            setChats(msgs);
            UpdateTheVideoChatContent({ ...videoMeta, extractedText, chat: msgs, user_id: user.id, video_id: params.url })
        } catch (error) {
            console.error("Error generating response:", error);
        }

        setIsTyping(false);
    };

    useEffect(() => {
        // Scroll to the bottom of the chat container
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    return (
        <div className='w-[50%] h-[100%] relative flex flex-col rounded-2xl bg-accent/60 items-center'>
            {extractedText.length === 0 ? (
                <div className='w-full inset-0 z-50 bg-black/80 border rounded-2xl h-full absolute flex justify-center items-center top-0 right-0'>
                    <Progress value={progress} max={100} className="w-[60%]" />
                </div>
            ) : (
                <ScrollArea  className='w-full h-[calc(100%_-_140px)] overflow-y-auto px-5 py-4'>
                    <section ref={chatContainerRef} className='w-full h-full flex flex-col gap-4 px-3 py-3'>
                        {chats && chats.length!==0
                            ? chats.map((chat: any, index: number) => (
                                <p key={index} className={`${chat.role === "user" ? "justify-end" : "justify-start"} w-full flex items-center`}>
                                    <span className={`${chat.role === "user" ? "bg-primary" : "bg-background"} text-sm max-w-[60%] px-3 py-3 rounded-md`} style={{ textAlign: "left" }}>{chat.content}</span>
                                </p>
                            ))
                            : ""}
                        {isTyping && <p className='w-full flex items-center'>
                            <i className='text-sm max-w-[60%] px-3 py-3 text-lefts rounded-md bg-background'>{isTyping ? "Typing" : ""}</i>
                        </p>}
                    </section>
                </ScrollArea>
            )}
            <form
                className="absolute bottom-4 w-[95%] overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
                <Label htmlFor="message" className="sr-only">
                    Message
                </Label>
                <Textarea
                    id="message"
                    value={message}
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    autoComplete="off"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex items-center p-3 pt-0">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" onClick={(e) => {
                                    e.preventDefault()
                                    console.log("MEOW")
                                }} size="icon">
                                    <Mic className="size-4" />
                                    <span className="sr-only">Use Microphone</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Use Microphone</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button size="sm" onClick={(e) => {
                        chat(e, message)
                    }} className="ml-auto gap-1.5">
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChatBot
