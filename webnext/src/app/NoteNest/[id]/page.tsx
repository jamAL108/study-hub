'use client'
import React , { useState , useEffect , useRef} from 'react'
import { BentoMinimalTiptap } from '@/components/custom/types'
import { TooltipProvider } from '@/components/ui/tooltip'
import { areObjectsEqualFunction } from '@/utils'
import checkUserAuthClient from '@/auth/getUserSession'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import SessionNotFoundComp from '@/components/sessionNotFound'
import { GetNoteFromSupabase , saveNoteToSupabase } from '@/api'
import { Loader2 } from "lucide-react"

const Page = ({ params }: {
  params: {
      id: string,
  }
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  const [loader, setLoader] = useState<boolean>(true)
  const [sessionNotFound, setSessionNotFound] = useState<boolean>(false)
  // const [user,setUser] = useState<any>({})
  let user:any = {}

  const [content , setContent] = useState<any>({
    "type": "doc",
    "content":[]
  });
  const [tempContent,setTempContent] = useState<any>({
    "type": "doc",
    "content":[]
  })

  const contentRef = useRef(content);

  const [Datafield,setDataField] = useState<any>({})
  const DataRef = useRef(Datafield)
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    getAllInvoicefunciton()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    // console.log(content)
    contentRef.current = content;
    setTempContent(content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[content])

  useEffect(()=>{
    DataRef.current = Datafield
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[Datafield])

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
    user = userData
    const result: any = await GetNoteFromSupabase(id,userData.id)
    if (result.success === true && result.data !== null) {
        setContent(result.data.notes)
        setTempContent(result.data.notes)
        setDataField(result.data)
        setLoader(false)
    } else {
        toast({
            title: "Some Error in Server",
            description: "Error in server , try again later",
            variant: 'destructive'
        })
        setLoader(false)
    }
  }

  
 
  const customSaveFunction = async (Newcontent:any) =>{
    // console.log(user)
    // console.log(Newcontent)
    if(!areObjectsEqualFunction(tempContent,Newcontent)){      // saveNoteToSupabase(id,)
      const res:any = await saveNoteToSupabase(DataRef.current.id,Newcontent)
      if(res.success===false){
        toast({
          title: "Some Error in Server",
          description: "Error in server , try again later",
          variant: 'destructive'
      })
      }else{
        toast({
          title: "Saved",
          description: "Error in server , try again later",
          variant: 'saved'
      })
      }
    }
  }


  useEffect(() => {
    const updateScale = () => {
      setScale(window.devicePixelRatio || 1);
    };

    window.addEventListener('resize', updateScale);
    updateScale();

    return () => window.removeEventListener('resize', updateScale);
  }, []);




  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Check if Ctrl + S or Command + S (for macOS) is pressed
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // Prevent the default browser save
        await sleep(1000);
        // console.log(content)
        // console.log("HELLOO",tempContent)
        const newContent = { ...contentRef.current }; // Use the ref to get the latest content
        // console.log(newContent);
        customSaveFunction(newContent);  // Call your custom save function
      }
    };

    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  if (sessionNotFound) {
    return <SessionNotFoundComp />
  }

  if(loader){
    return (
      <div className='w-[100%] flex justify-center items-center h-[100%] fixed inset-0 z-50 bg-black/30 '>
        <Loader2 className="mr-2 h-14 w-14 animate-spin" />
      </div>
    )
  }


  return (
    <TooltipProvider>
    <div className='w-full flex flex-col justify-center items-center'>
       <div className='w-full'>
       <BentoMinimalTiptap content={content} scale={scale} setContent={setContent} Datafield={Datafield} setDataField={setDataField}/>
       </div>
    </div>
    </TooltipProvider>
  )
}

export default Page