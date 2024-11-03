import { BentoCard, BentoGrid } from '@/components/custom/bento-grid'
import { cn } from '@/lib/utils'
import { MinimalTiptapThree } from './minimal-tiptap-three'
import Content from '../../data/content.json'

const features = [
  {
    name: 'Minimal Tiptap 3',
    className: 'col-span-3',
    background: (
      <MinimalTiptapThree
        value={Content}
        throttleDelay={3000}
        className={cn('h-full min-h-56  !bg-black w-full rounded-xl')}
        editorContentClassName="overflow-auto h-full"
        output="json"
        onChange={value => {
          console.log(value)
        }}
        placeholder="This is your placeholder..."
        editable={true}
        editorClassName="focus:outline-none px-5 py-4 h-full"
      />
    )
  }
]

export function BentoMinimalTiptap() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  )
}
