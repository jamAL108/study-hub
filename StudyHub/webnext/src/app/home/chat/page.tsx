'use client'
import React, { useEffect, useState } from 'react'
import checkUserAuthClient from '@/auth/getUserSession'
import { useRouter } from 'next/navigation'
import SessionNotFoundComp from '@/components/sessionNotFound'
import { Button } from '@/components/ui/button'
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
import { getAllchats } from '@/api'
import { Skeleton } from '@/components/ui/skeleton'
import RowComponent from './rowComponent'

const Dashboard = () => {
    const router = useRouter()
    const [loader, setLoader] = useState<boolean>(true)
    const [sessionNotFound, setSessionNotFound] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null)
    const [chats, setChats] = useState<any>([])

    useEffect(() => {
        getAllInvoicefunciton()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getAllInvoicefunciton = async () => {
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
        console.log(userData.id)
        const result: any = await getAllchats(userData.id)
        if (result.success === true) {
            setChats(result.data)
            console.log(result.data)
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

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-full">
            <Tabs defaultValue="all">
                <div className='w-full flex items-center pt-5 pb-7'>
                    <h1 className='text-2xl font-[600]'>Chat History</h1>
                </div>
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Youtube</TabsTrigger>
                        <TabsTrigger value="draft">PDF</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Filter
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Archived
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button onClick={(e)=>router.push('/explore')} size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                New chat
                            </span>
                        </Button>
                    </div>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardDescription>
                                A details of all your recent chats.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden w-[120px] sm:table-cell">
                                            <span className="sr-only">Image</span>
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Price
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Total Sales
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Created at
                                        </TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loader === true && (
                                        [0, 0].map((item, qw) => (
                                            <TableRow key={qw}>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Skeleton className='w-[120px] h-16 rounded-xl' />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Skeleton className='w-[150px] h-6 rounded-xl' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className='w-[80px] h-6 rounded-xl' />
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Skeleton className='w-[100px] h-6 rounded-xl' />
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Skeleton className='w-[110px] h-6 rounded-xl' />
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Skeleton className='w-[120px] h-6 rounded-xl' />
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
                                        loader === false && chats.map((chatData: any, idx: number) => (
                                            <RowComponent key={idx}  user={user} extractedText={chatData.extractedText} chats={chatData.chat} videoMeta={chatData} />
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>1-{chats.length}</strong> of <strong>{chats.length}</strong>{" "}
                                Chats
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}

export default Dashboard