import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import Link from 'next/link'

const sessionNotFound = () => {
    return (
        <AlertDialog open={true}>
        <AlertDialogContent className='w-[min(400px,90vw)] !rounded-[13px]'>
          <AlertDialogHeader>
            <AlertDialogTitle>User session Not Found !</AlertDialogTitle>
            <AlertDialogDescription>
            <h2>Try Login Again , or if you dont have an account then create it </h2>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex base:flex-row  base:justify-end'>
            <Link href={'/auth/sign-in'}  className='px-[18px] py-[7px] rounded-[6px] text-white bg-primary hover:bg-primary/90'>Login</Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}

export default sessionNotFound