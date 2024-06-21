'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { FormatVideoViews, geminiModel } from '@/utils'
import { Skeleton } from "@/components/ui/skeleton"
const Display: React.FC<any> = (props) => {
    const { videoMeta, extractedText, suggestedQuestion, setSuggestedQuestions, setMessage } = props
    const tempPrompt = `
    1. What did Fireship speak about in this video? | 
    2. How did Fireship describe the influence of React as a UI library? | 
    3. What is the core concept behind React's simplicity in building components? | 
    4. How does React handle updates to the UI? | 
    5. What is the purpose of the state hook in React? | 
    6. How did Fireship emphasize the importance of React's ecosystem? | 
    7. What are some examples of supporting libraries within the React ecosystem? | 
    8. What is the relationship between React and React Native? | 
    `

    const arr = [1, 2, 2, 3, 3, 4, 1, 5]

    useEffect(() => {
        if (extractedText.length !== 0) {
            getQuestionsFromModel()
        }
    }, [extractedText])

    const getQuestionsFromModel = async () => {
        const prompt = `
        Given the following text, please generate a list of questions that a user might ask based on the content: ${extractedText}
        Please provide a set of 8 questions that cover various aspects of the text and are likely to be asked by someone seeking clarification or more information , and just provide the  questions without any additional texts and also after each question add a "|" symbol which will help me split the questions , and also this text is from youtube videos so give questions in this frame , What did the creator: ${videoMeta.channel} speak about xyz , how he/she covered xxx topics.
        `
        const model = geminiModel()
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const splitedQuestions = text.split('|')   // do text.split('|')  after testing
        setSuggestedQuestions(splitedQuestions)
    }
    return (
        videoMeta ? (
            <div className='w-[38%] py-8 px-4 flex flex-col gap-10' >
                <div className='flex gap-4'>
                    <Image src={videoMeta.thumbnails[0]} alt='wer' width={190} height={95} className='rounded-md' />
                    <div className='flex flex-col gap-1 text-muted-foreground justify-center'>
                        <p className='font-[550]'>{videoMeta.channel}</p>
                        <p className='text-sm'>{videoMeta.duration} Duration</p>
                        <p className='text-sm'>{FormatVideoViews(videoMeta.views)}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <h2 className='text-xl font-[550]'>Suggested Prompts</h2>
                    <div className='flex flex-col px-2 gap-3'>
                        {
                            suggestedQuestion === null && arr.map((item, idxx: number) => (
                                <Skeleton key={idxx} className="h-5 mb-1 w-[360px]" />
                            ))
                        }
                        {suggestedQuestion !== null && suggestedQuestion.length !== 0 && suggestedQuestion.map((question: string, idx: number) => (
                            <p onClick={(e) => {
                                e.preventDefault()
                                setMessage(question)
                            }} key={idx} className='text-sm hover:text-white cursor-pointer transition duration-500 ease-in hover:scale-[1.02] text-muted-foreground'>{question}</p>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className='w-[35%] py-8 px-4 flex flex-col gap-10' >
                <div className='flex gap-4'>
                    <Skeleton className="h-[115px] w-[190px] rounded-md" />
                    <div className='flex flex-col gap-1 text-muted-foreground justify-center'>
                        <Skeleton className="h-3 w-[160px] rounded-md" />
                        <Skeleton className="h-3 w-[150px] rounded-md" />
                        <Skeleton className="h-3 w-[120px] rounded-md" />
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <Skeleton className="h-7 mb-1 w-[260px]" />
                    <div className='flex flex-col px-2 gap-3'>
                        {
                            arr.map((item, idxx: number) => (
                                <Skeleton key={idxx} className="h-6 mb-1 w-[360px]" />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    )
}

export default Display



// 1. What did Fireship speak about in this video? |
// 2. How did Fireship describe the influence of React as a UI library? |
// 3. What is the core concept behind React's simplicity in building components? |
// 4. How does React handle updates to the UI? |
// 5. What is the purpose of the state hook in React? |
// 6. How did Fireship emphasize the importance of React's ecosystem? |
// 7. What are some examples of supporting libraries within the React ecosystem? |
// 8. What is the relationship between React and React Native? |
// 9. How did Fireship highlight the demand for React skills in the front-end development industry? |
// 10. What additional content did Fireship recommend for those interested in advanced React topics? |
// 11. Where can viewers find more personal insights into how Fireship creates his videos? |
// 12. How did Fireship conclude his presentation? |