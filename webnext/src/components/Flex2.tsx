// 'use client';
// import React from 'react'
// import { Button } from '../components/ui/button'
// import { ChevronRight } from 'lucide-react';

// const EvaluateComponent = () => {
//   return (
//     <div className='text-pop poppinsFonts w-[min(90vw,1150px)] bg-accent/30 rounded-t-[2rem] rounded-b-[2rem] h-[600px] flex flex-col justify-start items-center mb-[8rem] '>
//        <div className='h-[90%] w-[100%] px-[60px] py-[50px] flex justify-center items-center'>
//           <div className=' w-[50%] h-[100%] rounded-b-[2rem] flex flex-col justify-center gap-3'>
//           <p className='text-primary text-[0.77rem] tracking-wider font-[650] '>CORRECTION OF DOCUMENT</p>
//          <h1 className='text-primary/60  text-[2rem] tracking-[2px] font-[650] leading-[40px]'>Make Any Changes as per your wish</h1>
//          <p className='text-[0.9rem] font-[500] w-[95%] text-muted-foreground tracking-[0.4px]'>check the translated document ( provided paragraph wise ) and make any changes if required</p>

//          <div className='w-[95%] flex  items-center gap-2 mt-[13px]'>
//           <img src="/images/correct.png" alt="vf"  className='w-[17px] h-[17px]'/>
//           <p className='text-[0.85rem] font-[500] tracking-[0.4px]'>Hindi word suggestions are Provided for Seamless Typing.</p>
//          </div>

//          <div className='w-[95%] flex  items-center gap-2 mt-[7px] '>
//           <img src="/images/correct.png" alt="vf"  className='w-[17px] h-[17px]'/>
//           <p className='text-[0.85rem] font-[500] tracking-[0.4px]'>A preview of The Original Document is provided and making it easier for user to identify where corrections are required</p>
//          </div>

//          <div className='w-[95%] flex  items-center gap-2 mt-[7px]'>
//           <img src="/images/correct.png" alt="vf"  className='w-[17px] h-[17px]'/>
//           <p className='text-[0.85rem] font-[500] tracking-[0.4px]'>A preview of The Translated Document is provided and giveing the clear view of how the Translated Document will look like.</p>
//          </div>

//          <div className='w-[95%] flex  items-center gap-2 mt-[7px]'>
//           <img src="/images/correct.png" alt="vf"  className='w-[17px] h-[17px]'/>
//           <p className='text-[0.85rem] font-[500] tracking-[0.4px]'>Hindi Keyboard support Provided for Seamless Typing.</p>
//          </div>

//           </div>

//           <div className=' w-[50%] h-[100%] flex justify-center '>
//               <img className='w-[550px] mt-[40px] h-[450px]' src="/images/women_lap.png" alt="dvf" />
//           </div>


//        </div>
//        <div className='h-[60px] w-[100%]  bg-accent rounded-b-[2rem] flex justify-center items-center 3'>
//         <Button  className='text-[0.97rem] transition duration-500 ease-in-out tracking-[0.6px] text-primary font-[600] hover:text-primary flex justify-center items-center gap-1 hover:bg-white bg-transparent border-none' variant='outline'>
//           Translate 
//           <ChevronRight size={20} color='#5B0888'/>
//         </Button>
//        </div>
//     </div>
//   )
// }

// export default EvaluateComponent

'use client';
import React from 'react'
import { Button } from '../components/ui/button'
import { ChevronRight } from 'lucide-react';
const EvaluateComponent = () => {
  return (
    <div className='text-pop poppinsFonts w-[min(90vw,1150px)] bg-accent/30 border-[2px] base:rounded-t-2xl base:rounded-b-2xl  bl:rounded-t-[2rem] bl:rounded-b-[2rem] bl:h-[600px] flex flex-col justify-start items-center mb-[4rem] '>
      <div className='h-[90%] w-[100%] base:px-[20px] base:py-[20px] bl:px-[60px] bl:py-[50px] flex base:flex-col bl:flex-row justify-center items-center'>

        <div className=' bl:pl-[30px] base:w-full bl:w-[50%] bl:h-[100%] rounded-b-[2rem] flex flex-col justify-center gap-3 base:mt-5 bl:mt-0'>
          <p className='text-primary text-[0.77rem] tracking-wider font-[650] '>EVALUATION OF DOCUMENT</p>
          <h1 className='text-primary/60  base:text-xl bl:text-[2rem] tracking-[2px] font-[650] bl:leading-[40px]'>Perfecting Document Translation Accuracy</h1>
          <p className='base:text-[0.65rem]  bl:text-[0.9rem] font-[500] text-muted-foreground tracking-[0.4px]'>Correct the low-confidence words mentioned here and adjust them as you see fit for improved translation.</p>

          <div className='w-[100%] flex  items-center gap-2 mt-[13px]'>
            <img src="/images/correct.png" alt="vf" className='w-[17px] h-[17px]' />
            <p className='base:text-[0.65rem] bl:text-[0.85rem] font-[500] tracking-[0.4px]'>Hindi word suggestions are Provided for Seamless Typing.</p>
          </div>

          <div className='w-[100%] flex  items-center gap-2 mt-[7px] '>
            <img src="/images/correct.png" alt="vf" className='w-[17px] h-[17px]' />
            <p className='base:text-[0.65rem] bl:text-[0.85rem] font-[500] tracking-[0.4px]'>A preview of The Original Document is provided and making it easier for user to identify where corrections are required</p>
          </div>

          <div className='w-[100%] flex  items-center gap-2 mt-[7px]'>
            <img src="/images/correct.png" alt="vf" className='w-[17px] h-[17px]' />
            <p className='base:text-[0.65rem] bl:text-[0.85rem] font-[500] tracking-[0.4px]'>Hindi Keyboard support Provided for Seamless Typing.</p>
          </div>

          <div className='w-[100%] flex  items-center gap-2 mt-[7px]'>
            <img src="/images/correct.png" alt="vf" className='w-[17px] h-[17px]' />
            <p className='base:text-[0.65rem] bl:text-[0.85rem] font-[500] tracking-[0.4px]'>Hindi Keyboard support Provided for Seamless Typing.</p>
          </div>

        </div>

        <div className='base:w-full  bl:w-[50%] bl:h-[100%] flex justify-center '>
          <img className='base:w-full bl:w-[550px] bl:mt-[40px] bl:h-[450px]' src="/images/women_lap.png" alt="dvf" />
        </div>
        
      </div>
      <div className='h-[60px] w-[100%]  bg-accent base:rounded-b-2xl bl:rounded-b-[2rem] flex justify-center items-center '>
        <Button className='text-[0.97rem] transition duration-500 ease-in-out tracking-[0.6px] text-primary font-[600] hover:text-primary flex justify-center items-center gap-1 hover:bg-white bg-transparent border-none' variant='outline'>
          Translate
          <ChevronRight size={20} color='#7639ea' />
        </Button>
      </div>
    </div>
  )
}

export default EvaluateComponent