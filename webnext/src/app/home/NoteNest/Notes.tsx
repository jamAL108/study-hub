'use client'
import React from 'react'
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { YoutubeExtractVideoID} from '@/utils'
import ShareChat from '@/components/shareChat'
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, BotMessageSquare, SquareArrowOutUpRight, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteVideoChatFromSupabase } from '@/api'
import { FaRegEdit } from "react-icons/fa";


const Notes: React.FC<any> = (props) => {
    const { toast,videoMeta, user, notes, extractedText, setNotes , note } = props

        const formatDate = (ts: string): string => {
            console.log(note)
            console.log("MEOW")
            const date = new Date(ts);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}`;
        };

        const deleteChat = async()=>{
            const resp:any = await DeleteVideoChatFromSupabase(note.id)
            if(resp.success===true){
                toast({
                    title: 'Chat Deleted',
                    description: "Deleted",
                });
                let tempChats = [...notes]
                const newChats = tempChats.filter((OtherNote)=>OtherNote.id!==note.id)
                setNotes(newChats)
            }else{
                toast({
                    variant: "destructive",
                    title: resp.error,
                    description: "Please try again after sometime",
                });            
            }
       }

        return (
            <TableRow className='py-0'>
                <TableCell className="hidden sm:table-cell">
                    <Image src={'/images/wordfile.png'} alt='asdsvf' width={40} className='rounded-md' height={40} />
                </TableCell>
                <TableCell className="font-medium">
                    {note.name}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {formatDate(note.created_at)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {formatDate(note.created_at)}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger><MoreHorizontal color='white' size={20} /></DropdownMenuTrigger>
                        <DropdownMenuContent className='absolute right-[-10px] px-3 py-3 w-[200px]'>
                            <DropdownMenuItem asChild>
                                <Link href={`/NoteNest/${note.id}`} className='flex items-center py-2.5 mb-1 px-3 gap-3 text-white'><FaRegEdit size={22} /> Edit 
                                </Link>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className='flex items-center py-2.5  mb-1 px-3  text-white'>
                                {/* <Link className='flex items-center gap-3 text-white' href={`https://www.youtube.com/${videoMeta.url_suffix}`}><SquareArrowOutUpRight size={22} /> View Video </Link> */}
                           {/* </DropdownMenuItem> */}
                            <DropdownMenuItem className='flex items-center py-2.5 mb-1 px-3 gap-3 text-white'>
                                {/* <ShareChat loader={false} ChatHomeRow={true}  user={user} chats={chats} extractedText={extractedText} /> */}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e)=>deleteChat()} className='flex items-center py-2.5  mb-1 px-3  text-white'>
                                <div className='flex items-center gap-3 text-white'><Trash2 size={22} /> Delete Chat </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        )
    }

    export default Notes