'use client';
import React, { useState } from "react"

import { Button } from "@/components/ui/button"
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
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator"
import { validateEmailInput } from '@/utils'
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation';
import { SigninWithSupabase , googleAuthWithSupabase } from '@/auth'

export default function CardWithForm() {
    const { toast } = useToast()
    const router = useRouter()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [apiBool, setApiBool] = useState<boolean>(false)

    const check = async () => {
        if (validateEmailInput(email)) {
            setApiBool(true)
            const stringifiedObject: any = await SigninWithSupabase({ email, password })
            const result: any = JSON.parse(stringifiedObject)
            if (result.success === true) {
                router.push('/home/chat')
            } else {
                toast({
                    variant: "destructive",
                    title: result.error,
                    description: "There was a problem with your request.",
                })
                setApiBool(false)
            }
        } else {
            toast({
                variant: "destructive",
                title: "Enter Valid Email Address",
                description: "There was a problem with your request.",
            })
        }
    }

    return (
        <Card className="border-none w-[450px]">
            <CardHeader>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent className="mt-3">
                <div className="grid gap-4">
                    <Button onClick={googleAuthWithSupabase} variant="outline" className="w-full bg-accent hover:bg-accent/80 py-5">
                        <FcGoogle className="mr-4 h-[18px] w-[19px]" />
                        Login with Google
                    </Button>
                    <div className="flex justify-center items-center w-full gap-3">
                        <Separator className="w-[45%] my-3" />
                        <p className="text-xs">or</p>
                        <Separator className="w-[45%] my-3" />
                    </div>
                    <div className="grid gap-2 mt-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="bg-accent/30 py-5"
                        />
                    </div>
                    <div className="grid gap-2 mt-1">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="ml-auto inline-block text-xs underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <Input value={password}
                            onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="******" className="bg-accent/30 py-5" required />
                    </div>
                    <Button disabled={email.length === 0 || password.length === 0 || apiBool === true} onClick={(e) => {
                        e.preventDefault()
                        check()
                    }} className={`w-full py-5 mt-8 ${apiBool === true ? 'op0' : 'op1'}`}>
                        {apiBool && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </div>
                <div className="mt-10 text-center text-muted-foreground text-sm ">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/sign-up" className="underline text-white">
                        Sign Up Now
                    </Link>
                </div>
                <div className="w-full text-muted-foreground text-[0.6rem] text-center mt-12">
                    By continuing, you agree to Vidchat AI&apos;s  ,
                    <Link href="#" className="underline text-white">
                        Terms of Service
                    </Link> and  <Link href="#" className="underline text-white">
                        Privacy & Policy
                    </Link>, and to receive periodic emails with updates.
                </div>
            </CardContent>
        </Card>
    )
}
