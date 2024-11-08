import Image from "next/image";
import Navbar from "@/components/LandingNavbar";
import { GiDiamonds } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Flex1 from '@/components/Flex1'
import Flex2 from '@/components/Flex2'
import Footer from '@/components/Footer'
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { ArrowUpRight } from 'lucide-react';

import Ripple from "@/components/ui/ripple";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col  items-center">
      <Navbar />
      <div className="base:w-[95vw] bl:w-[min(90vw,1400px)] base:px-6 bl:px-0 flex flex-col items-center base:py-10 bl:py-16">

        <div className="px-3 base:py-3 bl:py-2.5 flex justify-center items-center base:gap-2 bl:gap-3 bg-secondary border border-primary rounded-lg base:text-xs bl:text-sm">
          <div className="flex justify-center items-center">
            <GiDiamonds className="text-primary mr-1 h-3 w-3" />
            Free
          </div>
          <div className="flex justify-center items-center">
            <GiDiamonds className="text-primary mr-1 h-3 w-3" />
            Secure
          </div>
          <div className="justify-center items-center base:hidden bl:flex">
            <GiDiamonds className="text-primary mr-1 h-3 w-3" />
            Fast Process
          </div>
          <div className="justify-center items-center base:flex bl:hidden">
            <GiDiamonds className="text-primary mr-1 h-3 w-3" />
            Streamlined
          </div>
          <div className="flex justify-center items-center base:hidden bl:flex">
            <GiDiamonds className="text-primary mr-1 h-3 w-3" />
            Time Saving
          </div>
          <div className="flex justify-center items-center base:flex bl:hidden">
            <GiDiamonds className="text-primary mr-1 h-3 w-3" />
            Efficient
          </div>
          <div className="flex justify-center items-center">
            <GiDiamonds className="text-primary mr-1 h-3 w-3" />
            Cloud
          </div>
        </div>

        <div className="base:mt-8 bl:mt-12 base:w-[95%] bl:w-[70%] flex justify-center items-center base:text-3xl bl:text-7xl base:leading-[40px] bl:leading-[80px] font-[550]">
          <span className=" relative text-center base:hidden bl:flex">
            Unlock wisdom, streamline  <br />
            {/* <span className="relative borv"> */}
            learning, together with AI
            <Image src='/images/strikeThrough.png' alt='dfvgb' width={300} height={0} className="absolute left-2 bottom-[-20px]" />
            {/* </span> */}
          </span>

          <span className="relative text-center base:flex bl:hidden">
            Unlock wisdom, streamline
            learning, <br /> together with AI
            <Image src='/images/strikeThrough.png' alt='dfvgb' width={130} height={0} className="absolute left-6 bottom-[-5px]" />
            {/* </span> */}
          </span>
        </div>


        <h2 className="base:mt-8 bl:mt-12 base:w-full bl:w-[40%] text-center text-muted-foreground"><span className="text-primary">StudyHub</span> Your secure, AI-powered space for enhanced learning and controlled data management.</h2>
        <Link href={'/auth/sign-in'}><Button className="base:mt-8 bl:mt-12 text-md px-14 py-7 rounded-xl">Get Started</Button></Link>


      </div>

      <div className="base:w-[90vw] bl:w-[min(90vw,1400px)] base:mt-8 bl:mt-0 mb-16 flex flex-col relative items-center">
        {/* <img src='/images/chatImageAni.png'  alt='sxdfvg' className="w-[85%] absolute top-0 h-[1150px] mt-[-150px]" /> */}
        <img src='/images/Group_72.png' alt='sxdfvg' className="base:w-full bl:w-[67%] shadow-[0px_12px_102px_-11px_rgba(109,40,217,0.20)] bl:h-[550px] " />

      </div>


      <div className="relative section-3 overflow-hidden w-[100%] py-20 flex flex-col items-center justify-center gap-4 mt-16">
        <div className="glow"></div>
        <div className="flex z-10 flex-col gap-1 text-5xl font-[600] py-4 justify-center items-center">
          <h1>Study Hub</h1>
          <h1 className="text-[#956dc1]">Chat, Learn, and Excel</h1>
        </div>

        <div className="base:w-[90vw] bl:w-[790px] mt-3 mb-5 z-10">
          <div className="py-5  flex justify-center items-center">
            <h1 className="text-white text-lg">Watch the tutorial video to fully understand <span className="text-[#956dc1]">StudyHub's structure and features.</span></h1>
          </div>
          <HeroVideoDialog
            className="dark:hidden block z-10"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blogURL/Screenshot%202024-10-22%20122653.png`}
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block z-10"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://jvpehndoafryctlriuse.supabase.co/storage/v1/object/public/blogURL/Screenshot%202024-10-22%20122653.png"
            thumbnailAlt="Hero Video"
          />
        </div>

        <div className="flex flex-col gap-3 justify-center items-center mt-16 mb-8 py-4">
          <h1 className="text-5xl font-[600] gradient-text">Accessible, collaborative, and contextual</h1>
          <div className="cards mt-14">
            <div className="card border-card-80 bg-gradient-to-t from-card-80 to-card-80/30  bg-card-90 bg-cover">
              <img src="/images/AI.webp" className="w-[150px] h-[150px]" alt="aiimg" />
              <h1 className="text-2xl font-[600]">AI Models Integrations</h1>
              <p className="text-md font-[400] text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit pariatur voluptates mollitia sunt praesentium perferendis.</p>
              {/* <div className="glow"></div> */}
            </div>
            <div className="card">
              <img src="/images/collaborative.webp" className="w-[160px] h-[150px]" alt="aiimg" />
              <h1 className="text-2xl font-[600]">Always available</h1>
              <p className="text-md font-[400] text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit pariatur voluptates mollitia sunt praesentium perferendis.</p>
              {/* <div className="glow"></div> */}
            </div>
            <div className="card">
              <img src="/images/Contextual.webp" className="w-[200px] h-[150px]" alt="aiimg" />
              <h1 className="text-2xl font-[600]">AI Models Integrations</h1>      
              <p className="text-md font-[400] text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit pariatur voluptates mollitia sunt praesentium perferendis.</p>
              {/* <div className="glow"></div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-[7rem] mb-5 ">
        <h1 className="text-6xl font-[600]"><span className="text-primary">Easy-to-use</span> and powerful</h1>
      </div>

      <div className="base:w-[90vw] bl:w-[min(90vw,1400px)] my-12  flex flex-col relative items-center">
        <Flex1 />
      </div>
      <div className="base:w-[90vw] bl:w-[min(90vw,1400px)] my-12  flex flex-col relative items-center">
        <Flex2 />
      </div>

      <div className="base:w-[90vw] bl:w-[min(90vw,1300px)] my-12 py-10 flex relative items-center justify-center gap-[7rem]">
        <div className=" flex justify-center items-center bg-accent  rounded-xl p-20 px-16">
          <img src="/images/docsAi.jpg" alt="wvr" className="w-[360px] h-[460px] rounded-xl" />
        </div>

        <div className="flex justify-center items-center flex-col">
           <div className="flex flex-col justify-center  gap-6">
           <h1 className="text-primary text-4xl font-[600]">Introducing DocsAI</h1>
           <p className="max-w-[400px] text-md ">
           DocsAI is a versatile tool that enhances document management with automated summaries, interactive quizzes,
            and an AI chat interface for personalized assistance, improving user engagement and productivity.</p>
            <Link href='/auth/signup' className="text-primary font-bold flex items-center gap-2">
            Checkout Feature 
            <div className="bg-primary rounded-full p-1">
              <ArrowUpRight className="text-white h-4 w-4"/>
            </div>
            </Link>
           </div>
        </div>

        <Ripple/>
      </div>

      <div className="base:w-[90vw] bl:w-[min(90vw,1300px)] my-12 py-10 flex relative items-center justify-center gap-[7rem]">
        <div className="flex justify-center items-center flex-col">
           <div className="flex flex-col justify-center  gap-6">
           <h1 className="text-primary text-4xl font-[600]">Prompt Suggestions</h1>
           <p className="max-w-[400px] text-md ">
           The suggested prompts feature provides users with tailored guidance,
            helping them formulate queries and maximize their interactions with the platform for more effective outcomes.</p>
            <Link href='/auth/signup' className="text-primary font-bold flex items-center gap-2">
            Checkout Feature 
            <div className="bg-primary rounded-full p-1">
              <ArrowUpRight className="text-white h-4 w-4"/>
            </div>
            </Link>
           </div>
        </div>

        <div className=" flex justify-center items-center bg-accent  rounded-xl p-20 px-16">
          <img src="/images/video.jpg" alt="wvr" className="w-[360px] h-[460px] rounded-xl" />
        </div>

        <Ripple/>
      </div>

      <div className="relative section-8 overflow-hidden w-[100%] py-[10rem] flex flex-col items-center justify-center gap-6 mt-16">
        <div className="glow"></div>
        <h1 className="text-5xl font-[600]">Get started for <span className="text-[#6d1fbf]">free</span></h1>
        <p className="text-muted-foreground">Choose to own your data and a smarter way to work</p>
        <div className="w-full flex justify-center items-center gap-6">
        <Link href={'/auth/sign-in'}><Button className="text-md px-14 py-7 rounded-xl">Get Started</Button></Link>
        <Link href={'/auth/sign-in'}><Button variant='ghost' className=" border-[3px] text-md px-14 py-7 rounded-xl">Get Started</Button></Link>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
