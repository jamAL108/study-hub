'use client'
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2 , CalendarIcon,Search  } from 'lucide-react'
import { CopyBlock, dracula, far, arta, atomOneDark } from "react-code-blocks";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"
import { RotateCcw } from 'lucide-react';
import checkUserAuthClient from '@/auth/getUserSession'
// @ts-ignore
import { useRouter } from 'next/navigation'
import SessionNotFoundComp from '@/components/sessionNotFound'
import {
    ListFilter,
    MoreHorizontal,
    PlusCircle,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { getAllNotes } from '@/api'
import { Skeleton } from '@/components/ui/skeleton'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useToast } from "@/components/ui/use-toast"
import NotesComponent from './Notes'
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
  const { toast } = useToast();
  const router = useRouter()
  const [loader, setLoader] = useState<boolean>(true)
  const [sessionNotFound, setSessionNotFound] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<any>([])


    useEffect(() => {
      checkSession()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkSession = async () => {
        const res: any = await checkUserAuthClient()
        if (res.error !== null) {
            router.push('/')
            return
        }
        if (res.data.session === null) {
            setLoader(false)
            setSessionNotFound(true)
            return
        }
        const userData: any = res.data.session.user
        const result: any = await getAllNotes(userData.id)
        if (result.success === true) {
            setNotes(result.data)
            setUser(res.data.session.user)
            setLoader(false)
        } else {
            setUser(res.data.session.user)
            setLoader(false)
        }
      }

  if (sessionNotFound) {
      return <SessionNotFoundComp />
  }

  const newDocument = () =>{
    const uniqueId = uuidv4();
    router.push(`/NoteNest/${uniqueId}`)
  }


  return (
    <div className='w-full flex justify-center items-center flex-col'>
        
        <div className='base:w-[100%] bl:w-[min(90vw,1100px)] py-4 overflow-hidden flex justify-center items-center'>
          <div className='px-5 py-1 border rounded-full flex justify-start items-center bg-accent/30'>
          <Search className='w-5 h-5'/>
          <Input type="email" placeholder="Search" className='bg-transparent min-w-[500px] pl-5 focus:outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0' />
          </div>
        </div>

        <div className='w-full flex bg-accent/30 items-center justify-center'>
        <div className='base:w-[100%] bl:w-[min(90vw,1150px)] py-4 overflow-hidden flex flex-col justify-center  px-10 pt-5 gap-7'>
        <h1 className='text-md font-[500] text-muted-foreground'>Start a new document</h1>
        <div className='w-full flex items-center'>

          <div className='flex flex-col gap-2' onClick={(e)=>{
            e.stopPropagation()
            newDocument()
          }}>
            <div className='bg-white w-[130px] h-[150px] border-[3px] border-background hover:cursor-pointer hover:border-primary  flex justify-center items-center'>
            <img src="/images/newfile.png" alt="ds"  className='w-[50px] h-[50px]'/>
            </div>
            <h2 className='text-sm '>Blank Document</h2>
          </div>


        </div>
        <div>

        </div>
        </div>
        </div>

        <div className='base:w-[100%] bl:w-[min(90vw,1150px)] py-4 px-5 overflow-hidden flex flex-col justify-center '>
          <h1 className='text-sm text-muted-foreground'>Recent Notes</h1>
          <Table>
                                <TableHeader>
                                    <TableRow className='hover:bg-transparent'>
                                        <TableHead className="hidden w-[120px] sm:table-cell">
                                        </TableHead>
                                        <TableHead className='w-[350px] '>Name</TableHead>
                                        <TableHead className="w-[200px]  hidden md:table-cell">
                                            Created at
                                        </TableHead>
                                        <TableHead className="w-[250px] hidden md:table-cell">
                                            Author
                                        </TableHead>
                                        <TableHead>
                                            <span className="w-[150px] hidden md:table-cell">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loader === true && (
                                        [0, 0].map((item, qw) => (
                                            <TableRow key={qw}>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Skeleton className='w-[100px] h-16 rounded-xl' />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Skeleton className='w-[160px] h-6 rounded-xl' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className='w-[80px] h-6 rounded-xl' />
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Skeleton className='w-[100px] h-6 rounded-xl' />
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                aria-haspopup="true"
                                                                size="icon"
                                                                variant="ghost"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Toggle menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                    {
                                        loader === false && notes.map((note: any, idx: number) => (
                                            <NotesComponent key={idx} notes={notes} setNotes={setNotes} toast={toast} user={user} note={note} />
                                    ))}
                                     
                                </TableBody>
                            </Table>
                            {
                                      loader===false && notes.length===0 && (
                                        <div className='w-full flex py-6 justify-center items-center flex-col gap-2'>
                                          <img src="/images/EmptyFolder.png" alt="dsv" className='w-[180px] h-[180px]'  />
                                          <h2>No Notes Found</h2>
                                        </div>
                                      )
                            }
        </div>

        </div>
  )
}
export default Page