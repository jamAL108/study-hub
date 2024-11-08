import React from 'react'
import { Download  } from 'lucide-react';
import { CaretDownIcon, LetterCaseCapitalizeIcon } from '@radix-ui/react-icons'

import { ToolbarButton } from './buttons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaRegCopy } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { LuSave } from "react-icons/lu";

const Fileoption = () => {
    const childs:any[] = [
    {
        name:    'Download as DOCX'
    },
    {
        name:    'Download as PDF'
    }
    ]
    return (
        <div className='flex justify-start'>
          <ToolbarButton
                tooltip="Copy File"
                aria-label="Text styles"
                className="w-8"
                size={'sm'}
                variant='outline'
              >
                <LuSave  className="size-4" />
              </ToolbarButton>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ToolbarButton
                tooltip="Download"
                aria-label="Text styles"
                className="w-8"
                size={'sm'}
                variant='outline'
              >
                <Download  className="h-4 w-4" />
              </ToolbarButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">

              {childs.map((child:any,key:number)=>(
                 <DropdownMenuItem
                 key={key}
                //  onClick={() => handleStyleChange(level)}
                //  className={cn('flex flex-row items-center justify-between gap-4', {
                //    'bg-accent': level ? editor.isActive('heading', { level }) : editor.isActive('paragraph')
                //  })}
                //  aria-label={label}
               >
                 {child.name}
                 {/* <ShortcutKey keys={shortcuts} /> */}
               </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ToolbarButton
                tooltip="Copy File"
                aria-label="Text styles"
                className="w-8"
                size={'sm'}
                variant='outline'
              >
                <FaRegCopy  className="size-4" />
              </ToolbarButton>

              <Popover>
                <PopoverTrigger>
                <ToolbarButton
                tooltip="Details"
                aria-label="Text styles"
                className="w-8"
                size={'sm'}
                variant='outline'
              >
                <IoMdInformationCircleOutline  className="h-5 w-5" />
              </ToolbarButton>
                </PopoverTrigger>
                <PopoverContent>Place content for the popover here.</PopoverContent>
                </Popover>
        </div>
    )
}

export default Fileoption