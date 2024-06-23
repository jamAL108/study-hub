'use client'
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const page = () => {

  const [selectedFile, setSelectedFile] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // const file = e.target.files ? e.target.files[0] : null;
    const file: File | null = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedFile(file)
    }
  };


  const isValidFile = (filePath: string) => {
    return filePath.endsWith(".png") || filePath.endsWith(".jpg") || filePath.endsWith(".jpeg");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    e.preventDefault();
    const elem = document.querySelector(".uploadicon") as HTMLElement;
    if (elem) {
      elem.style.transform = "scale(1.1)";
    }
    const roundebox = document.querySelector(".roundebox") as HTMLElement;
    roundebox.style.borderColor = "rgba(252,252,252,0.6)";
  }

  const handelDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => {
      const elem = document.querySelector(".uploadicon") as HTMLElement;
      if (elem) {
        elem.style.transform = "scale(1)";
      }
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    e.preventDefault();
    const roundebox = document.querySelector(".roundebox") as HTMLElement;
    roundebox.style.borderColor = "rgba(252,252,252,0.2)";
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList): void => {
    const file = files[0];
    if (file) {
      setSelectedFile(file);
    }
  };


  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-[min(90vw,1100px)] h-auto min-h-[100px] flex flex-col justify-start items-center mb-[8rem] transDiv">
      <div className="font-pop w-[80%] mt-8 flex justify-center py-4 flex-col gap-4">
        <h1 className="text-[1.37rem] font-[500]">ImageTextify - Turn Your Images into Text Instantly!</h1>
        <p className="text-[0.8rem] w-[85%] text-muted-foreground">
          Transform your images into text effortlessly with ImageTextify. Our service allows you to upload an image and quickly receive the text content extracted from it, making it easy to digitize and utilize information from photos and scanned documents. Perfect for students, professionals, and anyone needing quick text extraction from images..
        </p>
      </div>
      <div className='w-full flex px-28 py-10'>
        <div className="flex flex-col gap-3">
          <Label htmlFor="topic">Upload Image</Label>
          <div className='border-2 border-dashed w-[280px] rounded-lg h-[180px] flex justify-center items-center' >
            <input
              type="file"
              hidden
              accept=".png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="fileinput2"
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handelDragLeave}
              onDrop={handleDrop}
              className="w-full h-full flex justify-center items-center flex-col "
              onClick={(e) => {
                e.preventDefault();
                const elem = document.querySelector(".fileinput2") as HTMLElement;
                if (elem) {
                  elem.click();
                }
              }}
            >
              {selectedFile === null && (
                <div className='flex flex-col gap-2 px-4 py-3 justify-center items-center'>
                  <Image
                    className="uploadicon"
                    style={{ transition: "0.5s ease-in-out" }}
                    width={90}
                    height={60}
                    src="/images/uploadlogo.png"
                    alt="rve"
                  />
                  <h2 className='text-center'>Upload images which are below 5mb.</h2>
                </div>
              )}

              {selectedFile !== null && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ type: "tween" }}
                    className="w-full h-full flex items-center justify-center"
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                  >
                    <img className='w-full h-full' src={selectedFile} alt='sdcv' />
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default page