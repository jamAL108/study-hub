'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import checkUserAuthClient from '@/auth/getUserSession'
import { useRouter } from 'next/navigation'
import SessionNotFoundComp from '@/components/sessionNotFound'
import { GetVideoFromSupabase } from '@/api/index'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from "@/lib/utils";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip"
import { FormatVideoViews, geminiModel, extractEmailInputPrefix } from '@/utils'
import { Progress } from "@/components/ui/progress"
import { UpdateTheVideoChatContent } from '@/api'
import { ScrollArea } from "@/components/ui/scroll-area"
import { updatePDFChat , getQuiz } from '@/api'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { CirclePlus } from 'lucide-react';

const Quiz:React.FC<any> = (props :any) => {
    const {topicReceived, topic , Totalquestions , setCurrArea,setTopicReceived ,setTopic , setTotalquestions} = props
    // const [topicReceived, setTopicReceived] = useState<boolean>(false)
    // const [topic, setTopic] = useState<string>("")
    // const [Totalquestions, setTotalquestions] = useState<number>(5)
    const { toast } = useToast()
    const router = useRouter()
    const [QuizLoad, setLoading] = useState<boolean>(true)
    const [MCQs, setMCQs] = useState<any>([])
    const [answer, setAnswer] = useState<string>("");
    const [score, setScore] = useState<any>(0)
    const [quizStarted, setQuizStarted] = useState<boolean>(false)
    const [quizEnded, setQuizEnded] = useState<boolean>(false)
    useEffect(() => {
        const getQuestions = async () => {
            if (MCQs.length === 0) {
                try {
                    const response:any = await getQuiz(topic,Totalquestions);
                    console.log(response)
                    if (response.success===true) {
                        const resQuestions:any = JSON.parse(response.data)
                        let formattedResults = resQuestions.map((e: any) => ({
                            ...e,
                            answers: [e.option1, e.answer,e.option2,e.option3]
                                .map((value) => ({ value, sort: Math.random() }))
                                .sort((a, b) => a.sort - b.sort)
                                .map(({ value }) => value),
                            correct_answer: e.answer, // Ensure the key names match your frontend expectations
                        }));
                        // localStorage.setItem('McqQuiz-PDF', JSON.stringify(formattedResults))
                        console.log(formattedResults)
                        setMCQs(formattedResults);
                    } else {
                        throw new Error("Failed to fetch questions");
                    }
                } catch (error) {
                    toast({
                        variant: "destructive",
                        title: "Some issue with the Request",
                        description: "There was a problem with your request.",
                    })
                    console.error("Error fetching questions:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        // let existingData: any = localStorage.getItem('McqQuiz-PDF')
        // const parsedData: any = JSON.parse(existingData)
        // if (parsedData !== null) setMCQs(parsedData.mcq)
        if (topic.length !== 0  &&  MCQs.length==0) getQuestions()
    }, [topic, Totalquestions])

    const answerCheck = (ans: string) => {
        if (ans === MCQs[0].correct_answer) {
            setScore(score + 1);
        }
        setAnswer(ans);
    };

    const handleNext = () => {
        setAnswer("");
        let remainingQuestions = [...MCQs];
        remainingQuestions.shift();
        if (remainingQuestions.length === 0) setQuizEnded(true)
        setMCQs([...remainingQuestions]);
    };
    return (
        <section className="flex relative flex-col justify-center  p-10 ">
            {MCQs?.length && quizStarted === true ? (
                <div className='w-full flex items-center gap-2'>
                    <h1 className="mb-4 text-lg font-normal leading-none tracking-tight md:text-lg text-lg">
                        {`${topic} Quiz`}
                    </h1>
                    <h1 className='text-white mb-4 text-lg font-normal leading-none tracking-tight md:text-lg lg:text-xl'>|</h1>
                    <h1 className="mb-4 text-lg font-normal leading-none tracking-tight md:text-lg lg:text-lg">
                        Question No{" "}
                        <span className="text-primary">
                            #{Totalquestions != null && Number(Totalquestions) - MCQs.length + 1}
                        </span>
                        .
                    </h1>
                </div>
            ) : null}

            {/* {!QuizLoad && !!MCQs?.length && (
                <p className="text-2xl ">Score: {score}</p>
            )} */}

            {quizStarted === false && (
                <div className="flex w-full flex-col justify-center items-center gap-5">
                    <h1 className="mt-10 w-[85%] text-center font-bold text-xl">
                        Engage your mind with interactive quizzes. Fun, learning, and challenges await!
                    </h1>
                    <h2 className='text-md'>{topic} Quiz Challenge | {Totalquestions} MCQs</h2>
                    <button hidden={MCQs.length==0}
                        onClick={(e) => {
                            setQuizStarted(true)
                        }}
                        className="bg-white hover:bg-gray-100  text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow"
                    >
                        Let&apos;s begin
                    </button>
                    {/* <div className='pt-16 flex flex-col w-[400px] gap-5 items-center justify-center'>
                        {[0, 0, 0, 0].map((item, keey) => (
                            <Skeleton key={keey} className='h-[30px] w-full' />
                        ))}
                    </div> */}
                </div>
            )}

            <Button className='bg-accent/30 hover:bg-accent absolute top-5 right-5 px-3 py-3 border flex justify-center items-center gap-2' onClick={(e)=>{
                setCurrArea(2)
                setQuizEnded(true)
                setMCQs([])
                setAnswer("")
                setScore(0)
                setQuizStarted(false)
                setTopic("")
                setTotalquestions(5)
                setTopicReceived(false)
            }}>
                <CirclePlus size={19} /> Try new Quiz
            </Button>

            {!MCQs && <p>loading...</p>}

            {MCQs && MCQs.length !== 0 && quizStarted === true && (
                <section className="my-10 pb-10 w-[100%] rounded-lg flex flex-col justify-center">
                    <h4 className="mb-4 text-md font-extrabold leading-none tracking-tight md:text-2xl lg:text-lg ">
                        {MCQs[0].question}
                    </h4>
                    <div className="flex flex-col w-full px-4 gap-3">
                        <RadioGroup onValueChange={(e) => {
                            console.log(e)
                            if (answer.length === 0) answerCheck(e)
                        }} value={answer}>
                            {MCQs[0].answers.map((e: string, idx: number) => {
                                return (
                                    <div className={cn(
                                        "w-[80%] my-2 cursor-pointer  text-gray-800 font-semibold py-3 px-4   rounded-lg flex items-center space-x-2",
                                        {
                                            "!bg-blue-600": answer && e === MCQs[0].correct_answer,
                                            "!bg-red-600": answer && e !== MCQs[0].correct_answer,
                                        }
                                    )} key={idx}>
                                        <RadioGroupItem value={e} id={e} />
                                        <Label className='text-white cursor-pointer' htmlFor={e}>{e}</Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>
                    <div className='w-full flex justify-end items-center' >
                        <Button

                            onClick={handleNext}
                            className="bg-white mt-5 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow"
                        >
                            {MCQs.length == 1 ? (
                                <p>Submit</p>
                            ) : (
                                <p>Next</p>
                            )}
                        </Button>
                    </div>
                </section>
            )}
            {quizEnded === true && (
                <div className='w-full flex flex-col gap-4'>
                    <h1>Your Score: {score}/{Totalquestions}</h1>
                    <Button onClick={(e )=> {
                        setCurrArea(-1)
                        setQuizEnded(true)
                        setMCQs([])
                        setAnswer("")
                        setScore(0)
                        setQuizStarted(false)
                        setTopic("")
                        setTotalquestions(5)
                        setTopicReceived(false)
                    } } className="bg-white mt-5 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow max-w-[200px]">Close it</Button>
                </div>
            )}
        </section>
    )
}

export default Quiz