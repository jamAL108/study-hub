'use client'
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils";
import { useSearchParams } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [QuizLoad, setLoading] = useState<boolean>(true)
    const [MCQs, setMCQs] = useState<any>([])
    const [answer, setAnswer] = useState<string>("");
    const [score, setScore] = useState<any>(0)
    const topic: any = searchParams.get('topic')
    const Totalquestions: any = searchParams.get('questions')
    const [quizStarted, setQuizStarted] = useState<boolean>(false)

    const [quizEnded, setQuizEnded] = useState<boolean>(false)

    useEffect(() => {
        const getQuestions = async () => {
            const obj = {
                topic,
                number: Totalquestions
            }
            try {
                const response = await fetch("https://study-hub-frontend.vercel.app/api/getQuiz", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(obj),
                });
                const data: any = await response.json();

                if (response.ok) {
                    let formattedResults = data.mcqs.map((e: any) => ({
                        question: e.question,
                        answers: [...e.options, e.answer]
                            .map((value) => ({ value, sort: Math.random() }))
                            .sort((a, b) => a.sort - b.sort)
                            .map(({ value }) => value),
                        correct_answer: e.answer, // Ensure the key names match your frontend expectations
                    }));
                    localStorage.setItem('McqQuiz', JSON.stringify(formattedResults))
                    setMCQs(formattedResults);
                } else {
                    throw new Error(data.message || "Failed to fetch questions");
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        }
        // let existingData: any = localStorage.getItem('McqQuiz')
        // const parsedData: any = JSON.parse(existingData)
        // if (parsedData !== null) setMCQs(parsedData)
        // else if (topic !== null) 
        getQuestions()
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
        <section className="flex relative flex-col bl:justify-center base:p-8 base:pt-14 bl:p-20 ">
            <Breadcrumb className='absolute top-5 left-8'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home/Quiz">Quiz</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {quizEnded === true ? (
                            <BreadcrumbPage>Final Score</BreadcrumbPage>
                        ) : quizStarted === false ? (
                            <BreadcrumbPage>{topic} Quiz</BreadcrumbPage>
                        ) : (
                            <BreadcrumbPage>{`Question #${Totalquestions != null && Number(Totalquestions) - MCQs.length + 1}`}</BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {MCQs?.length !== 0 && quizStarted === true ? (
                <div className='w-full flex items-center gap-2 base:mt-10 bl:mt-0'>
                    <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-2xl">
                        {`${topic} Quiz`}
                    </h1>
                    <h1 className='text-white mb-4 text-2xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-2xl'>|</h1>
                    <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-2xl">
                        Question No{" "}
                        <span className="text-primary">
                            #{Totalquestions != null && Number(Totalquestions) - MCQs.length + 1}
                        </span>
                        .
                    </h1>
                </div>
            ) : null}

            {MCQs?.length && quizStarted === true && (
                <p className="text-2xl ">Score: {score}</p>
            )}

            {quizStarted === false && (
                <div className="flex w-full flex-col base:mt-10 bl:mt-0 bl:justify-center items-center gap-5">
                    <h1 className="mt-10 base:hidden bl:flex w-[60%] text-center font-bold text-2xl">
                        Engage your mind with interactive quizzes. Fun, learning, and challenges await!
                    </h1>
                    <h1 className='text-xl'>{topic} Quiz Challenge | {Totalquestions} MCQs</h1>
                    {QuizLoad === false && (
                        <button
                            onClick={(e) => {
                                setQuizStarted(true)
                            }}
                            className="bg-white hover:bg-gray-100  text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow"
                        >
                            Let&apos;s begin
                        </button>
                    )}
                    <div className='pt-16 flex flex-col base:w-full bl:w-[400px] gap-5 items-center justify-center'>
                        {[1, 2, 4, 7].map((item, keey) => (
                            <Skeleton key={keey} className='h-[30px] w-full' />
                        ))}
                    </div>
                </div>
            )}

            {!MCQs && <p>loading...</p>}
            {MCQs && MCQs?.length !== 0 && quizStarted === true && (
                <section className="my-10  pb-10 baseLw-full bl:w-[90%] rounded-lg flex flex-col justify-center">
                    <h4 className="mb-4 text-xl base:font-bold bl:font-extrabold leading-none tracking-tight md:text-2xl lg:text-3xl ">
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
                                        "base:w-full bl:w-[40%] my-2 cursor-pointer  text-gray-800 font-semibold py-3 px-4   rounded-lg flex items-center space-x-2",
                                        {
                                            "!bg-blue-600": answer && e === MCQs[0].correct_answer,
                                            "!bg-red-600": answer && e !== MCQs[0].correct_answer,
                                        }
                                    )} key={idx}>
                                        <RadioGroupItem value={e} id={e} />
                                        <Label className='text-white' htmlFor={e}>{e}</Label>
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
                    <Button onClick={(e => router.push('/home/Quiz'))} className="bg-white mt-5 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow max-w-[200px]">Go to Main Page</Button>
                </div>
            )}
        </section>
    )
}

export default Page