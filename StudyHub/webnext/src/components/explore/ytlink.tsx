import React from 'react'
import Image from 'next/image'
import { EllipsisVertical, BotMessageSquare, SquareArrowOutUpRight, Forward } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShrinkTitle, FormatVideoViews, YoutubeExtractVideoID } from '@/utils'
import Link from 'next/link'
const YtLink: React.FC<any> = (props) => {
    const { item , uuid } = props;

    return (
        <div className='w-full relative flex items-center gap-4 bg-transparent hover:bg-secondary/80 py-3 px-3 rounded-md cursor-pointer '>
            <Image src={item.thumbnails[0]} alt='asdsvf' width={160} className='rounded-md' height={80} />
            <div className='flex w-[calc(100%_-_200px)] flex-col justify-start items-start h-full gap-1'>
                <h1 className='text-md font-semibold'>{ShrinkTitle(item.title, 74)}</h1>
                <p className='text-[0.8rem] font-[500] text-muted-foreground'>{item.channel}</p>
                <div className='flex items-center gap-2 text-[0.8rem] text-muted-foreground'>
                    <p>{FormatVideoViews(item.views)}</p>
                    •
                    <p>{item.publish_time}</p>
                </div>
            </div>
            <div className='flex items-center absolute top-3.5 right-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger><EllipsisVertical color='white' size={20} /></DropdownMenuTrigger>
                    <DropdownMenuContent className='absolute right-[-10px] px-3 py-3 w-[200px]'>
                        <DropdownMenuItem asChild>
                            <Link href={`/chat-with-ai/${YoutubeExtractVideoID(item.url_suffix)+ '-' + uuid}`} onClick={(e) => {
                                localStorage.removeItem('studyHubData')
                                localStorage.setItem('VideoMeta', JSON.stringify(item))
                            }} className='flex items-center py-2 mb-1 px-3 gap-3 text-white'><BotMessageSquare size={22} /> Chat with AI
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='flex items-center py-2  mb-1 px-3 gap-3 text-white'><SquareArrowOutUpRight size={22} /> View Video </DropdownMenuItem>
                        <DropdownMenuItem className='flex items-center py-2 mb-1 px-3 gap-3 text-white'><Forward size={22} /> Share others</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div >
    )
}

export default YtLink