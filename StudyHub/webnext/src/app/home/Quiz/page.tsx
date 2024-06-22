'use client'
import React, { useEffect, useState } from 'react'
import checkUserAuthClient from '@/auth/getUserSession'
import { useRouter } from 'next/navigation'
import SessionNotFoundComp from '@/components/sessionNotFound'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/userNavbar'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const Dashboard = () => {
    const router = useRouter()
    const [loader, setLoader] = useState<boolean>(true)
    const [sessionNotFound, setSessionNotFound] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null)

    const [topic, setTopic] = useState<string>("")
    const [Questions, setQuestions] = useState<number>(5)
    const [MCQs, setMCQs] = useState<any>([])

    useEffect(() => {
        getAllInvoicefunciton()
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
        setUser(res.data.session.user)
        setLoader(false)
    }

    if (sessionNotFound) {
        return <SessionNotFoundComp />
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
            </div>
            <div
                className="flex flex-1 items-start mt-20 justify-center rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1"
            >
                <Card className="border-none">
                    <CardHeader>
                        <CardTitle>Knowledge Card</CardTitle>
                        <CardDescription className='w-[70%]'>Challenge yourself with quick, engaging MCQs. Tap to check your answers instantly.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex w-full items-center gap-8">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="topic">Topic</Label>
                                    <Input id="name" value={topic} onChange={(e) => {
                                        setTopic(e.target.value)
                                    }} placeholder="Topic in which you want to test" className='w-[300px]' />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="uestions">Questions</Label>
                                    <Select value={String(Questions)} onValueChange={(e) => {
                                        setQuestions(Number(e));
                                    }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a Questions" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Questions</SelectLabel>
                                                <SelectItem value="3">3</SelectItem>
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end mt-6">
                        <Button onClick={(e)=>{
                            router.push(`/home/Quiz/quizsection?topic=${topic}&questions=${Questions}`);
                        }}>Start Test</Button>
                    </CardFooter>
                </Card>
            </div>
        </main>
    )
}

export default Dashboard