"use client";
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { AddVideoInSupabase } from '@/api'


type FileState = Blob | null;

interface DocumentFetchResult {
    documentContent?: Blob;
    filename?: string;
    isPrivate: boolean;
}

const Translate = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [open, setopen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<FileState>(null);
    const [filename, setfilename] = useState<string>("");
    const [filesize, setfilesize] = useState<string | number>("");

    const [sourcelang, setsourcelang] = useState<string>("");
    const [targetlang, settargetlang] = useState<string>("");
    const [description, setdescription] = useState<string>("");
    const { resolvedTheme } = useTheme();
    const [request, setrequest] = useState<boolean>(false);
    const [fileURL, setURL] = useState<string>('')

    const [loader, setLoader] = useState<boolean>(true)
    const [sessionNotFound, setSessionNotFound] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null)


    useEffect(() => {
        getAllInvoicefunciton()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getAllInvoicefunciton = async () => {
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
        console.log(userData.id)
        setUser(res.data.session.user)
        setLoader(false)
    }





    useEffect(() => {
        const roundebox = document.querySelector(".roundebox") as HTMLElement;
        if (request === false) {
            roundebox.style.pointerEvents = "auto";
        } else if (request === true) {
            roundebox.style.pointerEvents = "none";
        }
    }, [request]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // const file = e.target.files ? e.target.files[0] : null;
        const file: File | null = e.target.files ? e.target.files[0] : null;
        if (file && !isValidFile(file.name)) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Make sure that you're uploading a DOCX/PDF file",
            });
        } else if (file) {
            setSelectedFile(file);
            setfilename(file.name);
            setfilesize(file.size);
        }
    };


    const isValidFile = (filePath: string) => {
        return filePath.endsWith(".docx") || filePath.endsWith(".pdf");
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.stopPropagation();
        e.preventDefault();
        const elem = document.querySelector(".uploadicon") as HTMLElement;
        if (elem) {
            elem.style.transform = "scale(1.1)";
        }
        const roundebox = document.querySelector(".roundebox") as HTMLElement;
        if (roundebox && resolvedTheme === "dark") {
            roundebox.style.borderColor = "rgba(252,252,252,0.6)";
        } else if (roundebox && resolvedTheme === "light") {
            roundebox.style.borderColor = "#0082C8";
        }
    };

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
        if (roundebox && resolvedTheme === "dark") {
            roundebox.style.borderColor = "rgba(252,252,252,0.2)";
        } else if (roundebox && resolvedTheme === "light") {
            roundebox.style.borderColor = "#c9cbe5";
        } else {
            alert("mistakeee");
        }
        const files = e.dataTransfer.files;
        handleFiles(files);
    };

    const handleFiles = (files: FileList): void => {
        const file = files[0];
        if (!isValidFile(file.name)) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Make sure that you're uploading a DOCX/PDF file",
            });
        } else if (file) {
            setSelectedFile(file);
            setfilename(file.name);
            setfilesize(file.size);
        }
    };


    const removeFile = () => {
        setSelectedFile(null);
        setfilename("");
        setfilesize("");
    };


    const API = async () => {
        setrequest(true);
        if (selectedFile) {
            // onUploadStart(); // Notify parent component that upload has started
            const formData = new FormData();
            formData.append('pdf_file', selectedFile);
            try {
                const response = await fetch('http://localhost:8000/getpdf', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    console.log('PDF successfully sent to server');
                } else {
                    console.error('Failed to send PDF to server');
                }
                const success = response.ok;
                console.log(success)
                setrequest(false);
                storeBlobInSessionStorage()
                // onUploadSuccess(success); // Notify parent component about the upload success status
            } catch (error) {
                console.error('Error sending PDF to server:', error);
                setrequest(false);
                // onUploadSuccess(false); // Assume failure on catch
            }
        }
    };


    const storeBlobInSessionStorage = () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    const base64String = (event.target.result as string).split(",")[1];
                    localStorage.setItem("StudyHubPDF", base64String);
                    const uuid = generateUUID()
                    AddVideoInSupabase(uuid, selectedFile , user.id)
                    router.push(`/home/docxAI/${uuid}`)
                }
            };
            reader.readAsDataURL(selectedFile);
        } else {
            console.error("No Blob data available to store.");
        }
    };


    const generateUUID = () => {
        const newUUID = uuidv4();
        console.log('Generated UUID:', newUUID);
        return newUUID;
    };

    function truncateString(str: string, maxLength = 19) {
        if (str.length > maxLength) {
            return (
                str.substring(0, maxLength - 7) +
                "..." +
                str.substring(str.length - 7, str.length)
            );
        }
        return str;
    }


    if (sessionNotFound) {
        return <SessionNotFoundComp />
    }



    return (
        <div className="w-[min(90vw,1100px)] h-auto min-h-[100px] flex flex-col justify-start items-center mb-[8rem] transDiv">
            <AlertDialog>
                <AlertDialogTrigger asChild className='w-0 h-0 opacity-0 appearance-none'>
                    <div className='w-0 h-0 opacity-0 translateloginalertbox'>Show Dialog</div>
                </AlertDialogTrigger>
                <AlertDialogContent className='base:w-[92%] md:auto'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Not logged in ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Log in for added features and make your Votum experience extraordinary
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='px-5' onClick={(e) => {
                            e.preventDefault()
                            router.push('/auth/signin')
                        }}>Login</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="font-pop w-[80%] mt-8 flex justify-center py-4 flex-col gap-4">
                <h1 className="text-[1.37rem] font-[500]">DocxAI - Unlock Insights from Your Documents</h1>
                <p className="text-[0.8rem] w-[85%] text-muted-foreground">
                    Our app allows you to upload documents for a variety of purposes including summarization, multiple-choice question and answer (MCQA) generation, insights extraction, and referencing Udemy courses.
                    <br />
                    We recommend using DOCX and PPTX formats to ensure the best results. Other file formats may cause formatting issues.
                </p>
            </div>

            <div
                className="w-full h-auto flex items-center justify-center base:flex-col md:flex-row 
      base:gap-20 md:gap-30 mt-20"
            >
                <div className="dark:bg-[transparent] border-dashed border-[2px] border-[ #c9cbe5] flex items-center rounded-md justify-start flex-col dark:border-[rgba(252,252,252,0.2)]  max-w-[480px] h-[300px] roundebox">
                    <input
                        type="file"
                        hidden
                        accept=".docx,.pdf"
                        onChange={handleFileChange}
                        className="fileinput"
                    />
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handelDragLeave}
                        onDrop={handleDrop}
                        className="w-full h-full flex justify-center items-center flex-col "
                        onClick={(e) => {
                            e.preventDefault();
                            const elem = document.querySelector(".fileinput") as HTMLElement;
                            if (elem) {
                                elem.click();
                            }
                        }}
                    >
                        <h1 className="z-1 py-5 w-[96%] text-center text-[#0082C8] font-[640] text-[0.82rem] tracking-wider leading-6">
                            Drop and Drop file PDF/DOCX (recommended) <br /> or <br />
                            Enter the{" "}
                            <span
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="text-foreground  underline cursor-pointer font-[400] tracking-[1px]"
                            >
                                <Dialog open={open} onOpenChange={setopen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="underline bg-inherit dark:bg-inherit border-none hover:bg-inherit focus:bg-inherit p-0 m-0  dark:text-white mt-[-7px] text-[0.8rem] tracking-[0.4px]"
                                        >
                                            URL
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="base:max-w-[90%] sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Enter the URL</DialogTitle>
                                            <DialogDescription>
                                                Make sure to upload a file which is public.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    URL
                                                </Label>
                                                <Input
                                                    id="name"
                                                    className="col-span-3"
                                                    autoComplete="off"
                                                    value={fileURL}
                                                    onChange={(e) => {
                                                        e.preventDefault()
                                                        setURL(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                className="px-4"
                                            >
                                                Upload
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </span>
                        </h1>

                        {selectedFile === null && (
                            <Image
                                className="uploadicon"
                                style={{ transition: "0.5s ease-in-out" }}
                                width={90}
                                height={60}
                                src="/images/uploadlogo.png"
                                alt="rve"
                            />
                        )}

                        {selectedFile !== null && (
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    viewport={{ once: true }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "tween" }}
                                    className="w-[100%] h-[90px] flex items-center justify-center"
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <div className="w-[76%] border-solid border-2 bg-[#fefefe] text-black flex items-center gap-2 rounded-md base:p-[8px] md:p-[7px] max-h-[60px]">
                                        {filename.endsWith(".docx") ? (
                                            <img
                                                className="base:w-[29px] base:h-[26px] md:w-[33px] md:h-[30px]"
                                                src="/images/wordlogo.png"
                                                alt="cd"
                                            />
                                        ) : (
                                            <img
                                                className="base:w-[27px] base:h-[31px] md:w-[31px] md:h-[35px]"
                                                src="/images/pdflogo.png"
                                                alt="sd"
                                            />
                                        )}
                                        <div className="flex-1 gap-2">
                                            <p className="base:text-[0.71rem] md:text-[0.77rem] font-[550] tracking-[0.3px] leading-none">
                                                {truncateString(filename)}
                                            </p>
                                            <p className="base:text-[0.6rem] md:text-[0.65rem] opacity-[0.74]">
                                                {`${(Number(filesize) / 1024).toFixed(2)} kb`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="ml-[5px]  max-h-[60px] min-h-[45px]  flex items-start justify-start">
                                        <X
                                            size={23}
                                            color={resolvedTheme === "dark" ? "white" : "#707070"}
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                                setfilename("");
                                                setfilesize("");
                                            }}
                                        />
                                        {/* <img className='w-[20px] h-[20px] cursor-pointer ' src="/images/exchange.png" alt="dfv" /> */}
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    viewport={{ once: true }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "tween" }}
                                    className="w-[100%] h-[90px] flex items-center justify-center"
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Button disabled={request} onClick={API} className="w-full mx-7 hover:bg-white/70  bg-white text-black">
                                        {request === true && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Upload Video</Button>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Translate;