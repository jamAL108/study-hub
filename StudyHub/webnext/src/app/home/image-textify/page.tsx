'use client'
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { CopyBlock, dracula, far, arta, atomOneDark } from "react-code-blocks";
import "./styles.css";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"
import { RotateCcw } from 'lucide-react';

const Page = () => {

  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [Data, setData] = useState<any>(null)
  const [image, setimage] = useState<any>(null)
  const [loader, setLoader] = useState<boolean>(false)



  const handleFileChange = (e: any): void => {
    setData(null)
    // const file = e.target.files ? e.target.files[0] : null;
    const file: File | null = e.target.files ? e.target.files[0] : null;
    if (file) {
      setimage(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result); // Update state with image data URL
      };
      reader.readAsDataURL(file);
    }
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
    setData(null)
    const file = files[0];
    if (file) {
      setimage(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const removeFile = () => {
    setSelectedFile(null);
  };


  const handleSubmit = async () => {
    setData(null)
    setLoader(true)
    if (!selectedFile) {
      setLoader(false)
      return;
    }
    // const local: any = localStorage.getItem('TPP')
    // const parsed: any = JSON.parse(local)
    // if (parsed !== null) {
    //   console.log(parsed)
    //   setLoader(false)
    //   setData(parsed)
    //   return;
    // }
    try {
      const formData = new FormData();
      formData.append('image', image);
      fetch('https://studyhub-backend-server.vercel.app/generate', {
        method: 'POST',
        body: formData,
        headers: {
          // 'Content-Type': 'multipart/form-data' // Note: Don't set this header explicitly when using FormData
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then((data: any) => {
          localStorage.setItem('TPP', data.jsonData)
          setData(JSON.parse(data.jsonData));
          setLoader(false)
        })
    } catch (error) {
      console.error('Response error', error);
      setLoader(false)
    }
  };

  const convertFileToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  return (
    <div className="base:w-full bl:w-[min(90vw,1100px)] h-auto min-h-[100px] flex flex-col justify-start items-center mb-[8rem] transDiv">
      <div className="font-pop base:w-full bl:w-[80%] mt-8 flex justify-center base:items-center bl:items-start py-4 flex-col gap-4">
        <h1 className="text-[1.37rem] font-[500] base:w-[85%] bl:auto">ImageTextify - Turn Your Images into Text Instantly!</h1>
        <p className="text-[0.8rem] w-[85%] text-muted-foreground">
          Effortlessly convert images to text with ImageTextify. Upload your image and get the text instantly. Perfect for quick text extraction from photos and documents.
        </p>
      </div>
      <div className='w-full border border-red-500 flex base:flex-col bl:flex-row gap-10 py-10 base:px-5 bl:px-28'>
        <div className='base:w-full bl:w-[50%] flex flex-col gap-5'>
          <div className="flex flex-col gap-3 ">
            <Label htmlFor="topic">Upload Image</Label>
            <div className='border-2 border-dashed w-[280px] rounded-lg h-[200px] relative flex justify-center items-center px-8' >
              <div className={`${loader === true ? 'flex' : 'hidden'} absolute  justify-center items-center z-10000  top-0 bg-black bg-opacity-[0.6] w-full h-full inset-1 `}>
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
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
                className="w-full h-full flex  py-12  justify-center items-center flex-col "
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
                      className="uploadicon rounded-lg"
                      style={{ transition: "0.5s ease-in-out" }}
                      width={90}
                      height={60}
                      src="/images/uploadlogo.png"
                      alt="rve"
                    />
                    <h2 className='text-center text-muted-foreground text-sm'>Upload images which are below 5mb.</h2>
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
          {
            selectedFile !== null && (
              <div className='mt-2 flex items-center  gap-4'>
                <Button disabled={loader} onClick={(e) => {
                  e.preventDefault();
                  const elem = document.querySelector(".fileinput2") as HTMLElement;
                  if (elem) {
                    elem.click();
                  }
                }} className='px-4 py-2' variant='outline' >
                  Change Image
                </Button>
                {Data === null ? (
                  <Button disabled={loader} onClick={handleSubmit} className='px-8 py-2'>
                    Upload
                  </Button>
                ) : (
                  <Button disabled={loader} onClick={handleSubmit} className='px-8 py-2'>
                    <RotateCcw className='mr-2 h-4 w-4' />
                    Retry
                  </Button>
                )}
              </div>
            )
          }
        </div>
        {
          Data !== null && (
            <div className='base:w-full bl:w-[500px] flex flex-col gap-4 items-center base:mt-10 bl:mt-0'>
              <div className='w-full flex items-center'>
                <Badge>RESULT</Badge>
              </div>
              <h2>{Data.description}</h2>
              {Data.code.length !== 0 && (
                <div className='py-5 w-full demo'>
                  <CopyBlock
                    language={Data.codelanguage}
                    text={Data.code}
                    showLineNumbers={true}
                    theme={arta}
                    codeBlock
                  />
                </div>
              )}
              <h2>{Data.conclusion}</h2>
              <Link href={`/home/Quiz/quizsection?topic=${Data.topic}&questions=${5}`} className={`px-5 bg-accent/30 hover:bg-accent my-6 border max-w-full rounded-xl py-5 flex gap-5 cursor-pointer relative`}>
                <Image src='/images/bulb.svg' alt='dccf' width={55} height={55} />
                <div className='flex flex-col gap-2 justify-center'>
                  <h2 className='text-xl font-bold'>Get MCQ Test on {Data.topic}</h2>
                  <p className='text-sm text-muted-foreground'>Get the MCQs related to {Data.topic} to test your understanding</p>
                </div>
              </Link>
            </div>
          )
        }
      </div>
    </div>
  )
}
export default Page