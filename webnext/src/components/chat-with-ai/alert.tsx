'use client'
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
import React from 'react'
import { useRouter } from "next/navigation"
const Alert: React.FC<any> = () => {
    const router = useRouter()
    return (
        <AlertDialog open={true}>
            <AlertDialogContent className='max-w-[420px] py-7 px-7 rounded-3xl'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Oops! Data Lost - Invalid URL</AlertDialogTitle>
                    <AlertDialogDescription>
                        It seems like the data was lost due to an invalid URL.
                        Please check the URL and try again from search bar.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className='px-[20px]' onClick={(e: any) => {
                        router.push('/explore')
                    }}>Go to Home</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Alert