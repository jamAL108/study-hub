'use client'
import React from 'react'
import { BentoMinimalTiptap } from '@/components/custom/types'
import { TooltipProvider } from '@/components/ui/tooltip'

const page = () => {
  return (
    <TooltipProvider>
    <div className='w-full flex flex-col justify-center items-center'>
       <div className='w-full'>
       <BentoMinimalTiptap/>
       </div>
    </div>
    </TooltipProvider>
  )
}

export default page