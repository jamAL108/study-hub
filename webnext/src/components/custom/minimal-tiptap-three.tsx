'use client'
import * as React from 'react'
import { useState , useEffect } from 'react';
import '@/components/minimal-tiptap/styles/index.css'
import { Pagination } from 'tiptap-pagination-breaks';
import type { Content, Editor } from '@tiptap/react'
import type { UseMinimalTiptapEditorProps } from '@/components/minimal-tiptap/hooks/use-minimal-tiptap'
import { EditorContent } from '@tiptap/react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { SectionOne } from '@/components/minimal-tiptap/components/section/one'
import { SectionTwo } from '@/components/minimal-tiptap/components/section/two'
import { SectionThree } from '@/components/minimal-tiptap/components/section/three'
import { SectionFour } from '@/components/minimal-tiptap/components/section/four'
import { SectionFive } from '@/components/minimal-tiptap/components/section/five'
import { SectionSix } from '@/components/minimal-tiptap/components/section/table'
import { Formatting } from '@/components/minimal-tiptap/components/section/formatting'

import { LinkBubbleMenu } from '@/components/minimal-tiptap/components/bubble-menu/link-bubble-menu'
import { useMinimalTiptapEditor } from '@/components/minimal-tiptap/hooks/use-minimal-tiptap'
import { MeasuredContainer } from '../minimal-tiptap/components/measured-container'

import Fileoption from './fileoption';
import { IoCloudDoneOutline } from "react-icons/io5";
import { LuSave } from "react-icons/lu";



export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
  Datafield?:any
  scale?:number
}

const Toolbar = ({ editor , Datafield }: { editor: Editor , Datafield:any}) => (
  <div className="shrink-0 w-full overflow-x-auto border-b-[3px] border-border p-2 flex gap-1 bg-[#000000] items-center sticky top-0 z-[1000000]">
    <div>
      <img src="/images/logo.png" alt="sdv" className='w-[40px] h-[40px]' />
    </div>
    <div className='w-full py-2 flex gap-2 justify-start items-center'>

      <div className='px-4 flex flex-col gap-1 py-1 justify-center '>
        <div className='flex items-center gap-6'>
          <h3 className='text-sm'>{Datafield.name}</h3>
          {/* <IoCloudDoneOutline className='h-5 w-5'/> */}
        </div>
        <Fileoption/>
      </div>

      <div className="flex w-max items-center bg-[#292929] rounded-xl h-[50px] px-4">
        <SectionOne editor={editor} activeLevels={[1, 2, 3]} variant="outline" />

        <Separator orientation="vertical" className="mx-2 h-7 bg-[#ccc]" />

        <SectionTwo
          editor={editor}
          activeActions={['italic', 'bold', 'underline', 'code', 'strikethrough', 'clearFormatting']}
          mainActionCount={5}
          variant="outline"
        />

        <Separator orientation="vertical" className="mx-2 h-7 bg-[#ccc]" />

        <Formatting editor={editor}
          activeActions={['left', 'center', 'right', 'justify']}
          mainActionCount={4}
          variant="outline" />

        <Separator orientation="vertical" className="mx-2 h-7 bg-[#ccc]" />

        <SectionThree editor={editor} variant="outline" />

        <Separator orientation="vertical" className="mx-2 h-7 bg-[#ccc]" />

        <SectionFour
          editor={editor}
          activeActions={['bulletList', 'orderedList']}
          mainActionCount={2}
          variant="outline"
        />

        <Separator orientation="vertical" className="mx-2 h-7 bg-[#ccc]" />

        <SectionFive
          editor={editor}
          activeActions={['blockquote', 'codeBlock', 'horizontalRule']}
          mainActionCount={3}
          variant="outline"
        />

        <SectionSix
          editor={editor}
          activeActions={['Table']}
          mainActionCount={1}
          variant="outline"
        />
      </div>
    </div>
  </div>
)

export const MinimalTiptapThree = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value,scale, onChange, className, Datafield, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props,
    })

    if (!editor) {
      return null
    }

    
    return (
      <MeasuredContainer
        as="div"
        name="editor"
        ref={ref}
        className={cn(
          'flex h-auto min-h-72 px-8 w-full flex-col rounded-md justify-center items-center border-input shadow-sm focus-within:border-primary',
          className
        )}
      >
        <Toolbar editor={editor} Datafield={Datafield} />
        <div className='mt-14  transition-transform duration-200' >
          <EditorContent editor={editor} className={cn('minimal-tiptap-editor', editorContentClassName)} />
        </div>
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    )
  }
)

MinimalTiptapThree.displayName = 'MinimalTiptapThree'

export default MinimalTiptapThree
