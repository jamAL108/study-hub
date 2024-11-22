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
import { AddRoadmapToSupabase } from '@/api'
import { TriangleAlert } from 'lucide-react';
import Skeleton from "./SkeletonComp"
import { ModelConfig, promptGenerate, checkVideoLength } from '@/utils/roadmap'
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Book,
    FileText,
    Globe,
    Star,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { FiYoutube } from "react-icons/fi";
import Link from 'next/link'
import { RiRobot2Line } from "react-icons/ri";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MessageCircleQuestion, Text, Youtube } from 'lucide-react';
import SkeletonComp from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { TypingAnimation } from "@/components/ui/type";
import { LinkPreview } from "@/components/ui/link-preview";
import { CirclePlus } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Example } from './example'
import { Mermaid } from './mermaid';
import { RiFlowChart } from "react-icons/ri";
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ChevronRight } from "lucide-react"
import {
    TransformWrapper,
    TransformComponent,
    useControls,
} from "react-zoom-pan-pinch";
import { Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TransformDataToStandard } from '@/utils/roadmap'
import { icon } from 'mermaid/dist/rendering-util/rendering-elements/shapes/icon.js';
import { deleteRoadmap } from '@/api'

const roadmapData = [
    {
        id: 1,
        title: 'Product Development Roadmap',
        duration: '6 months',
        tasks: 5,
        progress: 50
    },
    {
        id: 2,
        title: 'Marketing Strategy',
        duration: '3 months',
        tasks: 8,
        progress: 75
    },
    {
        id: 3,
        title: 'Infrastructure Upgrade',
        duration: '4 months',
        tasks: 12,
        progress: 34
    }
];

const RoadmapGenerated = ({ roadmap, query, chart, user, level, toast, previousRoadmap, setPreviousRoadmap }: any) => {
    const router = useRouter()
    const [sendingDataToSupabase, setSendingDataToSupabase] = useState<boolean>(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const SendRoadmapToSupabase = async () => {
        setSendingDataToSupabase(true)
        toast({
            icon: <Loader2 className="animate-spin" />,
            title: "Uplaoding Content",
            description: "Please wait for few minutes"
        })
        const transformedData: any = TransformDataToStandard(roadmap)
        const result: any = await AddRoadmapToSupabase(transformedData, query, chart, user.id, level)
        if (result.success === false) {
            toast({
                variant: "destructive",
                title: "ERROR in server",
            })
            setSendingDataToSupabase(false)
        } else {
            toast({
                duration: 1000,
                title: "Uploaded",
            })
            router.push("/home/learnmap")
        }
    }


    const handleDeleteRoadmap = async (id: any) => {
        setDeleteLoading(true)
        const result: any = await deleteRoadmap(id);
        if (result.success === true) {
            const newArray = previousRoadmap.filter((rm: any) => rm.id !== id);
            setPreviousRoadmap(newArray)
            setDeleteLoading(false)
        } else {
            toast({
                duration: 3000,
                variant: "destructive",
                title: "ERROR in server",
            })
            setDeleteLoading(false)
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
                        <h4 className="w-[80%] font-medium base:text-xs bl:hidden">{resource.title}</h4>
                        <h4 className="font-medium base:hidden bl:flex">{resource.title}</h4>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-2 ">
                            <Badge variant="secondary" className="mr-2 base:text-[0.5rem] bl:text-xs capitalize">
                                {resource.type === 'docs' ? "Documentation" : resource.type}
                            </Badge>
                            {resource?.duration !== null && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {resource?.duration}
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
                                        }} className=
                                            'text-[0.6rem] px-2 py-0 group-hover:bg-background' size={'sm'} variant='outline'> <RiRobot2Line /> <span className='base:hidden bl:flex'>Ask Video</span></Button>
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
                                    }} className='text-[0.6rem] px-2 py-0 group-hover:bg-background' size={'sm'} variant='outline'> <MessageCircleQuestion /> <span className='base:hidden bl:flex'>Quiz</span> </Button>
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

    const MermaidShow = ({ chart }: any) => {
        // const [scale, setScale] = useState(1);
        // const minZoom = 0.5;
        // const maxZoom = 2;
        // const zoomStep = 0.1;

        const Controls = () => {
            const { zoomIn, zoomOut, resetTransform } = useControls();

            return (
                <div className="flex gap-2 absolute bottom-12 left-1/2 transform -translate-x-1/2 z-[10000]">
                    <Button
                        variant={'outline'}
                        onClick={() => zoomIn()}
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </Button>
                    <Button
                        variant={'outline'}
                        onClick={() => resetTransform()}
                        title="Reset View"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                    <Button
                        variant={'outline'}
                        onClick={() => zoomOut()}
                        title="Zoom In"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </Button>
                </div>
            );
        };

        // const handleZoomIn = () => {
        //     setScale(prev => Math.min(prev + zoomStep, maxZoom));
        // };

        // const handleZoomOut = () => {
        //     setScale(prev => Math.max(prev - zoomStep, minZoom));
        // };

        // const handleReset = () => {
        //     setScale(1);
        // };


        return (
            <div className='w-full flex items-center justify-center'>
                <div className="p-4 w-[min(100%,750px)] group border rounded-lg  group hover:bg-accent/80">
                    <div className="flex  items-start gap-3 relative">
                        <RiFlowChart className='w-6 h-6 text-purple-500' />
                        <div className="flex-1">
                            <h4 className="font-medium">FlowChart <span className='base:hidden bl:inline-block'>for {query}</span></h4>
                            <div className="text-sm text-gray-600 mt-1 flex items-center gap-2 ">
                                <Badge variant="secondary" className="mr-2 capitalize">
                                    Perfectly Crafted
                                </Badge>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='opacity-0 group-hover:opacity-[1] transition-opacity' variant="outline" size="icon">
                                    <ChevronRight />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='w-[min(100vw,1000px)] max-w-[100vw] h-[600px]'>
                                <DialogHeader>
                                    <div className="flex justify-between items-center">
                                        <DialogTitle>Learning Roadmap</DialogTitle>
                                    </div>
                                </DialogHeader>
                                <div className="relative overflow-auto rounded-lg w-full h-[500px]">
                                    <TransformWrapper
                                        minScale={2}
                                        initialScale={2}
                                        initialPositionX={-400}
                                        initialPositionY={0}
                                    >
                                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                            <div className='relative w-full h-full border flex justify-center items-center flex-col'>
                                                <Controls />
                                                <TransformComponent wrapperClass='w-[min(100vw,900px)] bg-white max-w-[100vw] h-[450px] flex justify-center items-center'>
                                                    <Mermaid chart={chart} />
                                                </TransformComponent>
                                            </div>
                                        )}
                                    </TransformWrapper>
                                    {/* <div
                                        className="min-w-full min-h-full transition-transform duration-200 ease-in-out origin-center"
                                        style={{
                                            transform: `scale(${scale})`,
                                            transformOrigin: '0 0'
                                        }}
                                    >
                                        <div className="p-4 select-none overflow-auto cursor-grab" >
                                            <Mermaid chart={chart} />
                                        </div>
                                    </div> */}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div >
            </div>
        )
    }


    return (
        <div className="base:px-0 bl:px-20 mt-5 py-6 roadmap w-full h-auto flex justify-center  flex-wrap gap-10">
            {/* Prerequisites Section */}
            <div className='w-[min(100%,750px)] flex items-center justify-between'>
                <h1 className='base:text-xl bl:text-3xl font-bold '>Roadmap for {query}</h1>
                <Dialog>
                    <DialogTrigger>
                        <Button><CirclePlus /> <span className='base:hidden bl:flex'>Add to Workspace</span></Button>
                    </DialogTrigger>
                    <DialogContent className='flex w-[min(95vw,450px)] rounded-xl p-3 py-4 justify-center items-center'>
                        <DialogHeader>
                            <div className="w-full my-3 flex flex-col items-center  justify-center gap-4">
                                {/* New Roadmap Section */}
                                <div className="w-full base:px-5 bl:px-0 py-4 rounded flex flex-col justify-start items-start ">
                                    <h3 className="text-lg font-semibold mb-4">Create New Roadmap</h3>
                                    <div className="w-full px-4 flex flex-col gap-3 justify-start items-start ">
                                        <h2>Name: <span className='text-muted-foreground'>{query}</span></h2>
                                        <h3>Duration: <span className='text-muted-foreground'>13 Weeks</span></h3>
                                        <Button disabled={sendingDataToSupabase || previousRoadmap.length >= 4} onClick={(e) => {
                                            e.preventDefault()
                                            SendRoadmapToSupabase()
                                        }}>
                                            {sendingDataToSupabase === true ? <Loader2 className="animate-spin" /> : <Plus className="mr-2" />}
                                            Add to Workspace
                                        </Button>
                                    </div>
                                    {previousRoadmap.length >= 4 && (
                                        <div className='bg-[#362323] flex text-xs items-center gap-2 px-4  py-3 border border-[#5b3634] rounded-lg text-[#ea928a] w-full mt-6 mb-4 '>
                                            <TriangleAlert /> Delete an existing roadmap to create a new one.
                                        </div>
                                    )}
                                </div>

                                {/* Existing Roadmaps Section */}
                                <div className="w-[min(95vw,400px)] bl:border p-4 rounded">
                                    <h3 className="text-lg font-semibold ">Existing Roadmaps</h3>
                                    <p className='text-muted-foreground text-xs mb-5'>One user can have atmost 4 Roadmap in thier workspace</p>
                                    <div className="w-full space-y-2">
                                        {previousRoadmap.map((roadmap: any) => (
                                            <div
                                                key={roadmap.id}
                                                className="relative  rounded overflow-hidden"
                                            >
                                                <div
                                                    className="absolute left-0 top-0 bottom-0 bg-greenish"
                                                    style={{
                                                        width: `40%`,
                                                        zIndex: 1
                                                    }}
                                                />
                                                <div
                                                    className="relative p-2 flex justify-between items-center z-10 bg-transparent"
                                                    style={{ zIndex: 2 }}
                                                >
                                                    <div>
                                                        <div className="font-medium text-sm ">{roadmap.name}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {roadmap.duration}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        disabled={deleteLoading}
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => handleDeleteRoadmap(roadmap.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            // <div
                                            //     key={roadmap.id}
                                            //     className="flex w-full justify-between items-center p-2 gap-2 rounded"
                                            // >
                                            //     <div  
                                            //     className='bg-green-200 flex-1 py-2 rounded-md px-2'
                                            //     style={{
                                            //         width: `${roadmap.progress}%`,
                                            //         zIndex: 1
                                            //     }}
                                            //     >
                                            //         <div className="font-medium text-xs">{roadmap.title}</div>
                                            //         <h2 className="text-xs text-gray-500 ">
                                            //             {roadmap.duration} | {roadmap.tasks} Tasks
                                            //         </h2>
                                            //     </div>
                                            //     <Button
                                            //         variant="destructive"
                                            //         size="icon"
                                            //     // onClick={() => handleDeleteRoadmap(roadmap.id)}
                                            //     >
                                            //         <Trash2 className="h-4 w-4" />
                                            //     </Button>
                                            // </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            <MermaidShow chart={chart} />
            <Card className='w-[min(100%,750px)] h-auto'>
                <CardHeader>
                    <CardTitle className="text-lg">Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                    {roadmap.Prerequisites.map((prereq: any, index: number) => (
                        <div key={index} className="mb-6 last:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium base:text-sm bl:hidden">{prereq.title}</h3>
                                <h3 className="font-medium base:hidden bl:flex">{prereq.title}</h3>
                                <Badge className='capitalize base:text-[0.5rem] bl:text-xs' variant={prereq.type === "required" ? "destructive" : "secondary"}>
                                    {prereq.type}
                                </Badge>
                            </div>
                            <ResourceCard resource={prereq.resource} />
                        </div>
                    ))}
                </CardContent>
            </Card>


            <Card className='w-[min(100%,750px)] h-auto'>
                <CardHeader>
                    <CardTitle className="text-lg">Learning Path</CardTitle>
                    <CardDescription>{roadmap.LearningStages.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple">
                        {roadmap.LearningStages.stages.map((stage: any, index: number) => (
                            <AccordionItem key={index} className="mb-4 last:mb-0" value={`item-${index + 1}`}>
                                {/* <div key={index} className="mb-6 last:mb-0"> */}
                                <AccordionTrigger className="flex  gap-5 mb-4">
                                    <Badge variant="outline" className="w-8 h-8 rounded-xl flex items-center justify-center">
                                        {index + 1}
                                    </Badge>
                                    <div className='flex-1 flex flex-col justify-center items-start'>
                                        <h3 className="font-medium text-left">{stage.focus}</h3>
                                        <p className="text-sm text-gray-500">
                                            Estimated time: {stage?.duration || "NA"}
                                        </p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {stage.Topics.map((topic: any, i: any) => (
                                        <div key={i} className="bl:ml-10 mb-4">
                                            <h4 className="font-medium mb-2">{topic.topicName}</h4>
                                            {topic.resources.map((resource: any, j: any) => (
                                                <ResourceCard key={j} resource={resource} />
                                            ))}
                                        </div>
                                    ))}
                                </AccordionContent>
                                {/* </div> */}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}

export default RoadmapGenerated