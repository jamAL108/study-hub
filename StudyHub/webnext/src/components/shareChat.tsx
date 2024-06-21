'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { publishShareData } from '@/api'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Forward, Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FaRegUser } from "react-icons/fa";
import { Trash2 } from 'lucide-react';
import { FiLogOut } from "react-icons/fi";
import { FaQuestion } from "react-icons/fa6";
import { ArrowLeft, UserPlus, Upload, ThumbsUp, ThumbsDown, X, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const ShareChat: React.FC<any> = (props) => {
    const { videoMeta, loader, user, chats, extractedText, ChatHomeRow } = props
    const [shareOpen, setShareOpen] = useState<boolean>(false)
    const [load, setload] = useState<boolean>(false)
    const [alertError, setAlertError] = useState<boolean>(false)
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = (e: any) => {
        e.preventDefault()
        const textToCopy = `https://vidchat-ai.vercel.app/share/${videoMeta ? videoMeta.video_id : ''}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };


    const addDataIntoShare = async () => {
        setload(true)
        const objectForProcess: any = {
            title: videoMeta.title,
            video_id: videoMeta.video_id,
            chat: chats,
            Date: videoMeta.created_at,
        }
        const result: any = await publishShareData(objectForProcess)
        if (result.success === true) {
            setload(false)
        } else {
            setload(false)
            setAlertError(true)
        }
    }

    return (
        <AlertDialog open={shareOpen} onOpenChange={setShareOpen}>
            <AlertDialogTrigger asChild>
                {ChatHomeRow === false ? (
                    <Button onClick={(e) => {
                        if (extractedText.length !== 0) {
                            setShareOpen(true)
                            addDataIntoShare()
                        }
                    }} variant='outline' className='shadow-xl'>
                        <UserPlus className="mr-2 h-4 w-4" /> Share
                    </Button>
                ) : (
                    <div className='flex items-center gap-3 text-white' onClick={(e) => {
                        e.preventDefault()
                        setShareOpen(true)
                        addDataIntoShare()
                    }}>
                        <Forward size={22} /> Share chat
                    </div>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X onClick={(e) => {
                        e.preventDefault()
                        setShareOpen(false)
                        setAlertError(false)
                    }} className="h-4 w-4 cursor-pointer" />
                    <span className="sr-only">Close</span>
                </div>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-2xl'>Share the chat !</AlertDialogTitle>
                    <AlertDialogDescription>
                        Copy the link and provide this to others , the conversation made till now will appear in this link.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {load === true ? (
                    <div className='w-full py-10 flex justify-center items-center'>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    </div>
                ) : alertError === true ? (
                    <Alert variant="destructive" className='my-5 mx-3'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            There is an Error in the server !
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className='w-full flex justify-center items-center py-5 '>
                        <div className='flex gap-2 w-full items-center justify-center'>
                            <Input
                                defaultValue={`https://vidchat-ai.vercel.app/share/${videoMeta ? videoMeta.video_id : ''}`}
                                className="h-[50px] w-[70%]"
                                disabled={true}
                            />
                            <Button onClick={handleCopy} className='py-4 max-h-[60px] h-[50px] rounded-[24px] px-6'>
                                {copied ? <Check className='mr-2 h-4 w-4' /> : <Copy className='mr-2 h-4 w-4' />}
                                Copy Link</Button>
                        </div>
                    </div>
                )}
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ShareChat