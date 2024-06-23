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
import { MoreHorizontal, BotMessageSquare, SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'

const RowComponent: React.FC<any> = (props) => {
    const { Document, user, chats, extractedText } = props
    const { chat: _, extractedText: __, ...otherData } = Document

    const trimPdfSuffix = (name: string): string => {
        return name.endsWith('.pdf') ? name.slice(0, -4) : name;
    };

    const formatDate = (ts: string): string => {
        const date = new Date(ts);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <TableRow>
            <TableCell className="hidden sm:table-cell">
                <Image src='/images/pdflogo.png' alt='asdsvf' width={50} className='rounded-md' height={50} />
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
                    <DropdownMenuContent className='absolute right-[-10px] px-3 py-3 w-[200px]'>
                        <DropdownMenuItem asChild>
                            <Link href={`/home/docxAI/${Document.id}`} className='flex items-center py-2.5 mb-1 px-3 gap-3 text-white'><BotMessageSquare size={22} /> Open in DocxAI
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='flex items-center py-2.5  mb-1 px-3  text-white'>
                            <Link className='flex items-center gap-3 text-white' href={`https://jvpehndoafryctlriuse.supabase.co/storage/v1/object/public/StudyHub_videos/${user.id}/${Document.id}.pdf`}> <SquareArrowOutUpRight size={22} /> View Document </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

export default RowComponent