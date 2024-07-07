import Image from "next/image";
import Navbar from "@/components/LandingNavbar";
import { GiDiamonds } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center">
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

      <div className="base:w-[90vw] bl:w-[min(90vw,1400px)] base:mt-8 bl:mt-0 flex flex-col relative bl:h-[100vh] items-center">
        {/* <img src='/images/chatImageAni.png'  alt='sxdfvg' className="w-[85%] absolute top-0 h-[1150px] mt-[-150px]" /> */}
        <img src='/images/Group_72.png'  alt='sxdfvg' className="base:w-full bl:w-[67%] shadow-[0px_12px_102px_-11px_rgba(109,40,217,0.20)] bl:h-[550px] " />

      </div>
    </div>
  );
}
