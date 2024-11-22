'use client'
import React, { useState } from 'react';
import { Book, Code, Brain, Database, ChevronRight, Clock, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const Page = () => {
    const [activeRoadmap, setActiveRoadmap] = useState(null);

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
        const completed = modules.filter((m: any) => m.completed).length;
        return Math.round((completed / modules.length) * 100);
    };


    return (
        <div className='w-full flex justify-center min-h-full overflow-y-auto '>
            <Card className='w-full border-none px-4 py-4'>
                <CardHeader className='w-full flex flex-row items-center justify-between '>
                    <div className='flex flex-col gap-2 justify-center'>
                        <CardTitle>My Learning Roadmaps</CardTitle>
                        <CardDescription>Track your progress across different learning paths</CardDescription>
                    </div>
                    <Link href="/home/learnmap/generate"><Button>Generate Roadmap</Button></Link>
                </CardHeader>
                <CardContent className='py-8'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {roadmaps.map((roadmap) => {
                            const progress = calculateProgress(roadmap.modules);
                            return (
                                <Card
                                    key={roadmap.id}
                                    className={`hover:shadow-lg transition-shadow duration-300 cursor-pointer
                  ${activeRoadmap === roadmap.id ? 'ring-2 ring-' + roadmap.color + '-500' : ''}`}
                                // onClick={() => setActiveRoadmap(roadmap.id)}
                                >
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {roadmap.icon}
                                                <CardTitle className="text-xl">{roadmap.title}</CardTitle>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <CardDescription className="mt-2">{roadmap.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {/* Stats Row */}
                                        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{roadmap.duration}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs 
                      ${roadmap.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                                                    roadmap.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-purple-100 text-purple-800'}`}>
                                                {roadmap.difficulty}
                                            </span>
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
                                            {roadmap.modules.map((module, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center space-x-2 text-sm"
                                                >
                                                    {module.completed ?
                                                        <CheckCircle className="h-4 w-4 text-green-500" /> :
                                                        <Circle className="h-4 w-4 text-gray-300" />
                                                    }
                                                    <span className={module.completed ? 'text-gray-700' : 'text-gray-500'}>
                                                        {module.name}
                                                    </span>
                                                </div>
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