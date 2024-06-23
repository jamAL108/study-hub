'use client'
import React from 'react'
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
    const { videoMeta, user, chats, extractedText } = props
    const { chat: _, extractedText: __, ...otherData } = videoMeta

        const formatDate = (ts: string): string => {
            const date = new Date(ts);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}`;
        };

        return (
            <TableRow>
                <TableCell className="hidden sm:table-cell">
                    <Image src={videoMeta.thumbnails[0]} alt='asdsvf' width={160} className='rounded-md' height={80} />
                </TableCell>
                <TableCell className="font-medium">
                    {videoMeta.title}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {formatDate(videoMeta.created_at)}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger><MoreHorizontal color='white' size={20} /></DropdownMenuTrigger>
                        <DropdownMenuContent className='absolute right-[-10px] px-3 py-3 w-[200px]'>
                            <DropdownMenuItem asChild>
                                <Link href={`/chat-with-ai/${videoMeta.video_id}`} className='flex items-center py-2.5 mb-1 px-3 gap-3 text-white'><BotMessageSquare size={22} /> Chat with AI
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='flex items-center py-2.5  mb-1 px-3  text-white'>
                                <Link className='flex items-center gap-3 text-white' href={`https://www.youtube.com/${videoMeta.url_suffix}`}><SquareArrowOutUpRight size={22} /> View Video </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='flex items-center py-2.5 mb-1 px-3 gap-3 text-white'>
                                <ShareChat loader={false} ChatHomeRow={true} videoMeta={otherData} user={user} chats={chats} extractedText={extractedText} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        )
    }

    export default RowComponent