import { BentoCard, BentoGrid } from '@/components/custom/bento-grid'
import { cn } from '@/lib/utils'
import { MinimalTiptapThree } from './minimal-tiptap-three'


export function BentoMinimalTiptap({content , setContent , Datafield, setDataField , scale}:any) {

  const features = [
    {
      name: 'Minimal Tiptap 3',
      className: 'col-span-3',
      background: (
        <MinimalTiptapThree
          value={content}
          scale={scale}
          Datafield={Datafield}
          throttleDelay={3000}
          className={cn('h-full min-h-56  !bg-black w-full rounded-xl')}
          editorContentClassName="overflow-auto h-full"
          output="json"
          onChange={value => {
            const newValue = value
            console.log(newValue)
            setContent(newValue)
          }}
          placeholder="This is your placeholder..."
          editable={true}
          editorClassName="focus:outline-none px-5 py-4 h-full"
        />
      )
    }
  ]

  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  )
}
