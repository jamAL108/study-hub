'use client'
import React, { useState, useEffect } from 'react'
import { Book, Code, Brain, Database, ChevronRight, Clock, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from "next/navigation";
import checkUserAuthClient from '@/auth/getUserSession'
import { getAllRoadmaps } from '@/api'
import SessionNotFoundComp from '@/components/sessionNotFound'
import { LuBrainCircuit } from "react-icons/lu";


const Page = () => {
    const [activeRoadmap, setActiveRoadmap] = useState(null);

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


    const [Roadmaps, setRoadmaps] = useState([])


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
        const result: any = await getAllRoadmaps(userData.id)
        if (result.success === false) {
            alert("ERROR in Server")
            setLoader(false)
        } else {
            setUser(userData)
            setRoadmaps(result.data)
            setLoader(false)
        }
    }


    if (sessionNotFound) {
        return <SessionNotFoundComp />
    }

    const roadmaps = [
        {
            id: 1,
            title: "Full-Stack Development",
            icon: <Code className="h-6 w-6 text-blue-500" />,
            difficulty: "Intermediate",
            duration: "6 months",
            description: "Complete journey from frontend to backend development",
            modules: [
                { name: "HTML/CSS", completed: true },
                { name: "JavaScript", completed: true },
                { name: "React", completed: false },
                { name: "Node.js", completed: false },
                { name: "Databases", completed: false },
                { name: "DevOps", completed: false }
            ],
            color: "blue"
        },
        {
            id: 2,
            title: "Machine Learning",
            icon: <Brain className="h-6 w-6 text-purple-500" />,
            difficulty: "Advanced",
            duration: "8 months",
            description: "From statistics to deep learning architectures",
            modules: [
                { name: "Python", completed: true },
                { name: "Statistics", completed: true },
                { name: "Neural Networks", completed: true },
                { name: "Deep Learning", completed: false },
                { name: "NLP", completed: false },
                { name: "Computer Vision", completed: false }
            ],
            color: "purple"
        },
        {
            id: 3,
            title: "Data Science",
            icon: <Database className="h-6 w-6 text-green-500" />,
            difficulty: "Intermediate",
            duration: "7 months",
            description: "Master data analysis and visualization",
            modules: [
                { name: "Statistics", completed: true },
                { name: "Python", completed: true },
                { name: "Data Analysis", completed: true },
                { name: "Visualization", completed: true },
                { name: "Machine Learning", completed: false },
                { name: "Big Data", completed: false }
            ],
            color: "green"
        },
        {
            id: 4,
            title: "Computer Science Fundamentals",
            icon: <Book className="h-6 w-6 text-red-500" />,
            difficulty: "Beginner",
            duration: "5 months",
            description: "Essential CS concepts and algorithms",
            modules: [
                { name: "Algorithms", completed: true },
                { name: "Data Structures", completed: true },
                { name: "Operating Systems", completed: false },
                { name: "Networks", completed: false },
                { name: "Databases", completed: false },
                { name: "System Design", completed: false }
            ],
            color: "red"
        }
    ];

    const calculateProgress = (modules: any) => {
        return 50
        // const completed = modules.filter((m: any) => m.completed).length;
        // return Math.round((completed / modules.length) * 100);
    };


    return (
        <div className='w-full flex justify-center min-h-full overflow-y-auto '>
            <Card className='w-full border-none base:px-0 bl:px-4 py-4'>
                <CardHeader className='w-full flex base:flex-col bl:flex-row bl:items-center gap-3  base:justify-center bl:justify-between '>
                    <div className='flex  gap-3 items-center'>
                        <LuBrainCircuit size={45} />
                        <div className='flex flex-col gap-2 justify-center'>
                            <CardTitle>My Learning Roadmaps</CardTitle>
                            <CardDescription>Track your progress across different learning paths</CardDescription>
                        </div>
                    </div>
                    <Link href="/home/learnmap/generate"><Button>Generate Roadmap</Button></Link>
                </CardHeader>
                <CardContent className='py-8'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Roadmaps.map((roadmap: any) => {
                            const progress = calculateProgress(roadmap.roadmap);
                            return (
                                <Card
                                    key={roadmap.id}
                                //                     className={`hover:shadow-lg transition-shadow duration-300 cursor-pointer
                                //   ${activeRoadmap === roadmap.id ? 'ring-2 ring-' + roadmap.color + '-500' : ''}`}
                                // onClick={() => setActiveRoadmap(roadmap.id)}
                                >
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {/* {roadmap.icon} */}
                                                <CardTitle className="text-xl">{roadmap.name}</CardTitle>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <CardDescription className="mt-2">{roadmap.roadmap.LearningStages.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {/* Stats Row */}
                                        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{roadmap.duration}</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                                <span className="text-sm font-medium text-gray-700">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 rounded-full h-2 transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Modules with Completion Status */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {roadmap.roadmap.LearningStages.stages.map((stageTopics: any, stageIndex: number) => (
                                                stageTopics.Topics.map((topic: any, topicIndex: number) => (
                                                    <div
                                                        key={`${stageIndex}-${topicIndex}`}
                                                        className="flex items-center space-x-2 text-sm"
                                                    >
                                                        {topic.completed ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Circle className="h-4 w-4 text-gray-300" />
                                                        )}
                                                        <span className={topic.completed ? 'text-gray-700' : 'text-gray-500'}>
                                                            {topic.topicName}
                                                        </span>
                                                    </div>
                                                ))
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page