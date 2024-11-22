'use client'
import React, { useState, useEffect } from 'react'
import { BsMagic } from "react-icons/bs";
import { Input } from "@/components/ui/input"
import { Search, Lightbulb, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import checkUserAuthClient from '@/auth/getUserSession'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import SessionNotFoundComp from '@/components/sessionNotFound'
import { Loader2 } from "lucide-react"
import { v4 as uuidv4 } from 'uuid';
import { AddVideoInSupabase, uploadPdfFile, getUserDetails, GetRoadmapFromSupabase, updateCountOfRequest } from '@/api'
import { TriangleAlert } from 'lucide-react';
import Skeleton from "../../../../components/roadmap/SkeletonComp"
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Book,
    FileText,
    Globe,
} from 'lucide-react';
import { FiYoutube } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MessageCircleQuestion, Text, Youtube } from 'lucide-react';
import 'react-loading-skeleton/dist/skeleton.css'
import { TypingAnimation } from "@/components/ui/type";
import { LinkPreview } from "@/components/ui/link-preview";
import RoadmapGenerated from '@/components/roadmap/roadmapGenerated';
import Alert from '@/components/roadmap/alert';


const suggestedPrompts = [
    "UI UX",
    "Flask for backend",
    "Devops"
];

const Page = () => {
    const { toast } = useToast()
    const [query, setQuery] = useState<string>("")
    const router = useRouter();

    const [loader, setLoader] = useState<boolean>(true)
    const [sessionNotFound, setSessionNotFound] = useState<boolean>(false)
    const [user, setUser] = useState<any>({})

    const [generatingResult, setGeneratingResult] = useState<boolean>(false)
    const [nextClicked, setNextClicked] = useState<boolean>(false)

    const [level, setLevel] = useState<string>('beginner')
    const [background, setBackground] = useState('')

    const [roadmap, setRoadmap] = useState<any>(null)
    const [chart, setChart] = useState<string>("")

    const [alertForRemove, setAlertFOrRemove] = useState<boolean>(false)


    const [previousRoadmap,setPreviousRoadmap] = useState([])

    useEffect(() => {
        sessionChecks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sessionChecks = async () => {
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
        const result: any = await getUserDetails(userData.id)
        if (result.success === false) {
            alert("ERROR in Server")
        } else {
            setUser(result.user)
            setPreviousRoadmap(result.existingRoadmap)
            console.log(result.user)
        }
        setLoader(false)
    }

    const scroll = (Str: any) => {
        let target: any = document.querySelector(`.${Str}`);
        if (target) {
            console.log(target);
            target.scrollIntoView({ behavior: "smooth" });
        }
    }


    const generateRoadMapFunction = async () => {
        setGeneratingResult(true)
        setRoadmap(null)
        scroll("roadmapLoading")
        if (user?.total_pending_counts === 0) {
            toast({
                variant: "destructive",
                title: "Limit Reached for today",
            })
            return;
        }
        const URL = 'https://www.study-hub.xyz/'
        const result: any = await fetch(`${URL}api/roadmapGeneration`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                level,
                background,
            }),
        });
        const res = await result.json();
        if (res.success === false) {
            toast({
                variant: "destructive",
                title: res.error || "Issue in server",
            })
            setGeneratingResult(false)
        } else {
            const response: any = await updateCountOfRequest(user.id, user.total_pending_counts)
            if (response.success === true) {
                setUser(response.data)
            } else {
                toast({
                    variant: "destructive",
                    title: "There is an issue in the server",
                })
                return;
            }
            setRoadmap(res.data)
            setChart(res.chart)
            setGeneratingResult(false)
        }
    }


    const ResourceCard = ({ resource }: any) => {
        const getIcon = () => {
            switch (resource.type) {
                case 'video':
                    return <FiYoutube className="w-5 h-5 text-red-500" />;
                case 'docs':
                    return <FileText className="w-5 h-5 text-blue-500" />;
                case 'course':
                    return <Book className="w-5 h-5 text-purple-500" />;
                default:
                    return <Globe className="w-5 h-5 text-gray-500" />;
            }
        };

        const openInNewWindow = (url: string) => {
            window.open(url, '_blank', 'noopener,noreferrer');
        };

        return (
            <div className="p-4 border rounded-lg mb-2 group hover:bg-accent/80">
                <div onClick={(e) => openInNewWindow(resource.url)} className="flex  items-start gap-3 relative">
                    <LinkPreview url={resource.url}>
                        {getIcon()}
                    </LinkPreview>
                    <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-2 ">
                            <Badge variant="secondary" className="mr-2 capitalize">
                                {resource.type === 'docs' ? "Documentation" : resource.type}
                            </Badge>
                            {resource?.duration && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {resource.duration}
                                </span>
                            )}
                        </div>
                    </div>
                    <div onClick={(e) => {
                        e.stopPropagation()
                    }} className='absolute  top-0 right-0 flex gap-2 justify-center items-end'>
                        {resource.type === 'video' && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button onClick={(e) => {
                                            e.stopPropagation()
                                        }} className='text-[0.6rem] px-2 py-0 group-hover:bg-background' size={'sm'} variant='outline'> <RiRobot2Line /> Ask Video</Button>
                                    </TooltipTrigger>
                                    <TooltipContent side='right' className='w-[300px] text-xs'>
                                        Use AskVideo feature to chat with the video and enhance your learning with AI-powered insights.
                                    </TooltipContent>
                                    {/* {checkVideoLength(resource.duration) === true ? (
                                        <TooltipContent side='right' className='w-[300px] text-xs'>
                                            1. Use AskVideo feature to chat with the video and enhance your learning with AI-powered insights.
                                            <br />
                                            2. Feature unavailable for videos longer than 5 minutes.
                                        </TooltipContent>
                                    ) : (
                                        <TooltipContent side='right' className='w-[300px] text-xs'>
                                            Use AskVideo feature to chat with the video and enhance your learning with AI-powered insights.
                                        </TooltipContent>
                                    )} */}
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button onClick={(e) => {
                                        e.stopPropagation()
                                    }} className='text-[0.6rem] px-2 py-0 group-hover:bg-background' size={'sm'} variant='outline'> <MessageCircleQuestion /> Quiz </Button>
                                </TooltipTrigger>
                                <TooltipContent side='right' className='w-[300px] text-xs'>
                                    Challenge yourself with quick, engaging MCQs.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        );
    };


    if (sessionNotFound) {
        return <SessionNotFoundComp />
    }


    return (
        <div className='w-full flex justify-center items-center'>
            <div className='base:px-4 bl:px-0 flex w-full flex-col gap-10 items-center justify-center py-4'>
                <Alert open={alertForRemove} setOpen={setAlertFOrRemove} setRoadmap={setRoadmap} />
                <div className='w-[min(90%,600px)] flex  flex-col gap-10 items-center justify-center py-4'>
                    <div className='flex flex-col mt-16 justify-center items-center gap-3'>
                        <h1 className='text-2xl font-[600] text-center'>Generate roadmaps with AI
                        </h1>
                        <h3 className='text-muted-foreground text-center'>Create personalized learning paths tailored to your goals.</h3>
                    </div>
                    <div className='w-full flex base:flex-col bl:flex-row gap-4 items-center justify-center'>
                        <Input disabled={user?.total_pending_counts < 0 || generatingResult} value={query} onChange={(e) => {
                            if (roadmap !== null) {
                                setAlertFOrRemove(true)
                                return;
                            }
                            if (e.target.value.length === 0) {
                                setNextClicked(false)
                                setQuery("")
                            } else {
                                setQuery(e.target.value)
                            }
                        }} type="email" placeholder="Enter the Topic" className='base:w-[min(100%,400px)] py-6' />
                        <Button disabled={user?.total_pending_counts === 0 || query.length === 0 || generatingResult} className='base:w-[min(100%,400px)] bl:w-auto py-6 px-6' onClick={(e) => {
                            e.preventDefault()
                            if (user?.total_pending_counts === 0) {
                                toast({
                                    variant: "destructive",
                                    title: "Limit Reached for today",
                                })
                                return;
                            }
                            if (roadmap !== null) {
                                setAlertFOrRemove(true)
                                return;
                            }
                            setNextClicked(true)
                        }}>
                            Next <ArrowRight />
                        </Button>
                    </div>

                    {nextClicked === true && query && (
                        <div className='w-full base:px-0 bl:px-10 flex flex-col gap-8 items-center justify-center'>
                            <div className='w-full'>
                                <label className="text-sm font-medium">Your current level</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                                        <Button
                                            disabled={generatingResult || user?.total_pending_counts === 0}
                                            key={lvl}
                                            variant={level === lvl ? "default" : "outline"}
                                            onClick={() => {
                                                if (roadmap !== null) {
                                                    setAlertFOrRemove(true)
                                                    return;
                                                }
                                                setLevel(lvl)
                                            }}
                                            className="capitalize"
                                        >
                                            {lvl}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className='w-full'>
                                <label className="text-sm font-medium">Your background (optional)</label>
                                <Textarea
                                    disabled={generatingResult}
                                    placeholder="Tell us about your previous experience, what you already know, or specific areas you want to focus on..."
                                    value={background}
                                    onChange={(e) => {
                                        if (roadmap !== null) {
                                            setAlertFOrRemove(true)
                                            return;
                                        }
                                        setBackground(e.target.value)
                                    }}
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>

                            <Button disabled={user?.total_pending_counts === 0 || query.length === 0 || generatingResult} className='py-4 px-6 w-full' onClick={(e) => {
                                e.preventDefault()
                                if (roadmap !== null) {
                                    setAlertFOrRemove(true)
                                    return;
                                }
                                generateRoadMapFunction()
                            }}>
                                <BsMagic /> Generate Learning Path
                            </Button>
                        </div>
                    )}

                    {!query && user?.total_pending_counts > 0 && (
                        <div className="space-y-6 base:px-0 bl:px-10 w-full h-auto">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Lightbulb size={20} />
                                <span className="text-sm">Try these roadmap prompts:</span>
                            </div>
                            <div className="space-y-3">
                                <div className="grid gap-2">
                                    {suggestedPrompts.map((category, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setQuery(category)}
                                            className="flex duration-300 items-center gap-2 p-3 text-left text-gray-600 rounded-lg hover:bg-background/50 group transition-colors"
                                        >
                                            <Clock className="text-gray-400 " size={16} />
                                            <span className="flex-1 hover:text-white">{category}</span>
                                            <ArrowRight className="opacity-0 group-hover:opacity-[1] text-white transition-opacity" size={16} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {user?.total_pending_counts === 0 && (
                        <div className='bg-[#362323] flex  items-center gap-2 px-4  py-3 border border-[#5b3634] rounded-lg text-[#ea928a] w-full mt-6 mb-4 '>
                            <TriangleAlert /> You reached today&apos;s limit, please try again tomorrow.
                        </div>
                    )}

                    {
                        loader === false && (
                            <div className='flex justify-center items-center text-muted-foreground text-xs'>
                                <h3>You have generated {4 - user?.total_pending_counts} of 4 roadmaps today.</h3>
                            </div>
                        )
                    }
                </div>

                {generatingResult === true && (
                    <div className='roadmapLoading w-[min(90%,750px)] py-6 flex  flex-col gap-6'>
                        <TypingAnimation
                            className="base:text-xl bl:text-3xl font-bold text-left bl:px-6"
                            text="Generating Roadmap..."
                        />
                        <Skeleton />
                    </div>
                )}
                {roadmap !== null && (
                    <RoadmapGenerated previousRoadmap={previousRoadmap} setPreviousRoadmap={setPreviousRoadmap} toast={toast} roadmap={roadmap} query={query} chart={chart} user={user} level={level} />
                )}
            </div>

        </div >
    )
}

export default Page