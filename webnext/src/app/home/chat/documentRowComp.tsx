'use client'
import React, { useEffect } from 'react'
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { YoutubeExtractVideoID } from '@/utils'
import ShareChat from '@/components/shareChat'
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, BotMessageSquare, SquareArrowOutUpRight,Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteDocChatFromSupabase } from '@/api'

const RowComponent: React.FC<any> = (props) => {
    const { toast ,  Document, user , AllDocument , setDocuments} = props

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

    const trimPdfSuffix = (name: string): string => {
        return name.endsWith('.pdf') ? name.slice(0, -4) : name;
    };

    const mon =  ['','Jan','feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    const formatDate = (ts: string): string => {
        const date = new Date(ts);
        const year = date.getFullYear();
        const month = date.getMonth() + 1 // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${day} ${mon[month]} ${year}`;
    };

    const deleteChat = async()=>{
        const resp:any = await DeleteDocChatFromSupabase(user.id,Document.id)
        if(resp.success===true){
            toast({
                title: 'Chat Deleted',
                description: "Deleted",
            });
            let tempChats = [...AllDocument]
            const newChats = tempChats.filter((chat)=>chat.id!==Document.id)
            setDocuments(newChats)
        }else{
            toast({
                variant: "destructive",
                title: resp.error,
                description: "Please try again after sometime",
            });            
        }
   }

    return (
        <TableRow className='text-sm'>
            <TableCell className="hidden sm:table-cell">
                <Image src='/images/pdflogo.png' alt='asdsvf' width={30} className='rounded-md' height={30} />
            </TableCell>
            <TableCell className="font-medium">
                {trimPdfSuffix(Document.name)}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {formatDate(Document.created_at)}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <p className='text-muted-foreground  text-sm'>{`${(Number(Document.filesize) / 1024).toFixed(2)} KB`}</p>
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger><MoreHorizontal color='white' size={20} /></DropdownMenuTrigger>
                    <DropdownMenuContent className='absolute right-[-10px] px-3 py-3 w-[200px] !text-xs'>
                        <DropdownMenuItem asChild>
                            <Link href={`/home/docxAI/${Document.id}`} className='flex text-xs items-center py-2.5 mb-1 px-3 gap-3 text-white'><BotMessageSquare size={20} /> Open in DocxAI
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='flex text-xs items-center py-2.5  mb-1 px-3  text-white'>
                            <Link className='flex text-xs items-center gap-3 text-white' href={`${SUPABASE_URL}/storage/v1/object/public/StudyHub_videos/${user.id}/${Document.id}.pdf`}> <SquareArrowOutUpRight size={20} /> View Document </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e)=>deleteChat()} className='flex items-center py-2.5  mb-1 px-3  text-white'>
                                <div className='flex text-xs items-center gap-3 text-white'><Trash2  size={20} /> Delete Chat </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

export default RowComponent