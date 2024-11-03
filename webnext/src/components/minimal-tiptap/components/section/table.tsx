import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { FormatAction } from '../../types'
import type { toggleVariants } from '@/components/ui/toggle'
import type { VariantProps } from 'class-variance-authority'
import { CaretDownIcon, ListBulletIcon } from '@radix-ui/react-icons'
import { ToolbarSection } from '../toolbar-section'
import { Table } from 'lucide-react'
import './styles.scss'

type ListItemAction = 'Table'
interface ListItem extends FormatAction {
  value: ListItemAction
}

const formatActions: ListItem[] = [
  {
    value: 'Table',
    label: 'Add Table',
    icon: <Table className="size-5" />,
    isActive: editor => editor.isActive('Table'),
    action: editor => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    canExecute: editor => editor.can().chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    shortcuts: ['mod', 'shift', '9']
  }
]

interface SectionFourProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeActions?: ListItemAction[]
  mainActionCount?: number
}

export const SectionSix: React.FC<SectionFourProps> = ({
  editor,
  activeActions = formatActions.map(action => action.value),
  mainActionCount = 0,
  size,
  variant
}) => {
  return (
    <ToolbarSection
      editor={editor}
      actions={formatActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={
        <>
          <ListBulletIcon className="size-5" />
          <CaretDownIcon className="size-5" />
        </>
      }
      dropdownTooltip="Lists"
      size={size}
      variant={variant}
    />
  )
}

SectionSix.displayName = 'SectionSix'

export default SectionSix

