'use client'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, UserPlus, Upload, ThumbsUp, ThumbsDown, X, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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
import ShareChat from '../shareChat';

const Navbar: React.FC<any> = (props) => {
    const { videoMeta, loader, user, chats, extractedText } = props
    const [deleteAlert, setDeleteAlert] = useState<boolean>(false)
    const [deleteLoader, setDeleteloader] = useState<boolean>(false)
    const [exporting, setExporting] = useState<boolean>(false)



    const Export = async () => {
        const objectData = [];
        for (let i = 1; i < chats.length; i += 2) {
            const userMessage = chats[i];
            const assistantMessage = chats[i + 1];

            if (userMessage.role === 'user' && assistantMessage?.role === 'assistant') {
                objectData.push({
                    question: userMessage.content,
                    answer: assistantMessage.content,
                });
            } else {
                console.error('Chat array is not in the expected format at index:', i);
            }
        }
        // console.log(objectData)
        const DataToBeSent = {
            details: {
                chats: objectData,
                pdfTemplate: 1
            }
        }
        const res:any =  await downloadPDF(DataToBeSent)
        // console.log(res)
        // if(parsedData.success===true) setExporting(false)
    }


    const downloadPDF = async (details: any) => {
        setExporting(true)
        const URL = 'http://localhost:3000/api/download'
        fetch(URL, {
            method: "POST",
            body: JSON.stringify(details),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `chat.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                setExporting(false)
            })
            .catch((error) => {
                console.error("Error downloading:", error);
            });
    }





    return (
        <div className='w-full py-4 px-12  flex justify-between items-center'>
            <div className='flex items-center justify-center gap-7'>
                <Link href={'/home/chat'} className='border-[2px] rounded-md px-2 py-2 bg-transparent hover:bg-accent'>
                    <ArrowLeft className='h-5 w-6' color='white' />
                </Link>
                {videoMeta ?
                    <h1 className='text-2xl text-muted-foreground font-[500]'>{videoMeta.title}</h1>
                    :
                    <Skeleton className="h-10 w-[560px] rounded-md" />
                }
            </div>
            <div className='flex items-center justify-center gap-5'>
                <div className='flex items-center justify-center'>
                    <div className='flex justify-center items-center py-2.5 bg-transparent hover:bg-accent px-3.5 border rounded-l-xl'>
                        <ThumbsUp className='h-4 w-4' />
                    </div>
                    <div className='flex justify-center items-center py-2.5 bg-transparent hover:bg-accent px-3.5 border rounded-r-xl'>
                        <ThumbsDown className='h-4 w-4' />
                    </div>
                </div>

                <ShareChat ChatHomeRow={false} videoMeta={videoMeta} loader={loader} user={user} chats={chats} extractedText={extractedText} />

                <Button disabled={exporting} className='shadow-xl' onClick={Export}>
                    {exporting === false ? (
                        <Upload className="mr-2 h-4 w-4" />
                    ) : (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )} Export
                </Button>
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
                                    <p className='tracking-wider'>{user ? user.email : ''}</p>
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
    )
}

export default Navbar