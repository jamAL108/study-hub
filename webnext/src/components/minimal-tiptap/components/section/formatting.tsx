import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { FormatAction } from '../../types'
import type { toggleVariants } from '@/components/ui/toggle'
import type { VariantProps } from 'class-variance-authority'
import { CaretDownIcon, CodeIcon, DividerHorizontalIcon, PlusIcon, QuoteIcon } from '@radix-ui/react-icons'
import { LinkEditPopover } from '../link/link-edit-popover'
import { ImageEditDialog } from '../image/image-edit-dialog'
import { ToolbarSection } from '../toolbar-section'

import { AlignLeft , AlignCenter , AlignRight , AlignJustify } from 'lucide-react';

type InsertElementAction = 'left' | 'center' | 'right' | 'justify'
interface InsertElement extends FormatAction {
  value: InsertElementAction
}

const formatActions: InsertElement[] = [
  {
    value: 'left',
    label: 'Align Left',
    icon: <AlignLeft className="size-5" />,
    action: editor => editor.chain().focus().setTextAlign('left').run(),
    isActive: editor => editor.isActive({ textAlign: 'left' }),
    canExecute: editor => editor.can().chain().focus().setTextAlign('left').run(),
    shortcuts: ['mod', 'alt', '2','sdhnc']
  },
  {
    value: 'center',
    label: 'Align Center',
    icon: <AlignCenter className="size-5" />,
    action: editor => editor.chain().focus().setTextAlign('center').run(),
    isActive: editor => editor.isActive({ textAlign: 'center' }),
    canExecute: editor => editor.can().chain().focus().setTextAlign('center').run(),
    shortcuts: ['mod', 'alt', '2','sngdc']
  },
  {
    value: 'right',
    label: 'Align Right',
    icon: <AlignRight className="size-5" />,
    action: editor => editor.chain().focus().setTextAlign('right').run(),
    isActive: editor => editor.isActive({ textAlign: 'right' }),
    canExecute: editor => editor.can().chain().focus().setTextAlign('right').run(),
    shortcuts: ['mod', 'alt', '2','sdnc']
  },
  {
    value: 'justify',
    label: 'Align Justify',
    icon: <AlignJustify className="size-5" />,
    action: editor => editor.chain().focus().setTextAlign('justify').run(),
    isActive: editor => editor.isActive({ textAlign: 'justify' }),
    canExecute: editor => editor.can().chain().focus().setTextAlign('justify').run(),
    shortcuts: ['mod', 'alt', '2','sc']
  }
]

interface SectionFiveProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeActions?: InsertElementAction[]
  mainActionCount?: number
}

export const Formatting: React.FC<SectionFiveProps> = ({
  editor,
  activeActions = formatActions.map(action => action.value),
  mainActionCount = 0,
  size,
  variant
}) => {
  return (
    <>
      <ToolbarSection
        editor={editor}
        actions={formatActions}
        activeActions={activeActions}
        mainActionCount={mainActionCount}
        size={size}
        variant={variant}
      />
    </>
  )
}

Formatting.displayName = 'Formatting'

export default Formatting
