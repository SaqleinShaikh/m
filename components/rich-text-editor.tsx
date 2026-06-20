"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Code,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eraser,
  Type
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = "Write something amazing..." }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const isInternalChange = useRef(false)
  const contentRef = useRef(content)

  // Always keep contentRef in sync with the latest prop
  useEffect(() => {
    contentRef.current = content
  }, [content])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Typography,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4 shadow-md',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline font-medium hover:text-accent transition-colors',
        },
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      // Force set content from ref when editor is first created
      // This ensures the latest content prop value is used even if
      // useEditor captured a stale closure value
      const latestContent = contentRef.current
      if (latestContent && latestContent !== '<p></p>' && editor.getHTML() !== latestContent) {
        editor.commands.setContent(latestContent, { emitUpdate: false })
      }
    },
    onUpdate: ({ editor }) => {
      isInternalChange.current = true
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[350px] p-6 bg-card transition-all duration-200',
      },
    },
  })

  // Sync content when it changes from outside (e.g. when opening edit dialog with blog data)
  useEffect(() => {
    if (!editor) return

    // Skip if this change was triggered by the editor's own onUpdate
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }

    const currentHTML = editor.getHTML()
    // Only update if content actually differs
    if (content !== currentHTML) {
      editor.commands.setContent(content || '', { emitUpdate: false })
    }
  }, [content, editor])

  // Don't render until mounted on client
  if (!isMounted) {
    return (
      <div className="border border-border rounded-lg p-4 min-h-[300px] bg-muted/30">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    )
  }

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const ToolbarButton = ({ 
    onClick, 
    active = false, 
    disabled = false, 
    children, 
    tooltip 
  }: { 
    onClick: () => void, 
    active?: boolean, 
    disabled?: boolean, 
    children: React.ReactNode,
    tooltip: string
  }) => (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onClick();
            }}
            disabled={disabled}
            className={`h-8 w-8 p-0 ${active ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground'}`}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs font-medium">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border/5 focus-within:ring-primary/20 transition-all duration-300">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/20">
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().undo().run()} 
            disabled={!editor.can().undo()}
            tooltip="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().redo().run()} 
            disabled={!editor.can().redo()}
            tooltip="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            active={editor.isActive('bold')}
            tooltip="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            active={editor.isActive('italic')}
            tooltip="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            active={editor.isActive('underline')}
            tooltip="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleCode().run()} 
            active={editor.isActive('code')}
            tooltip="Inline Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            active={editor.isActive('heading', { level: 1 })}
            tooltip="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            active={editor.isActive('heading', { level: 2 })}
            tooltip="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().setParagraph().run()} 
            active={editor.isActive('paragraph')}
            tooltip="Paragraph"
          >
            <Type className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('left').run()} 
            active={editor.isActive({ textAlign: 'left' })}
            tooltip="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('center').run()} 
            active={editor.isActive({ textAlign: 'center' })}
            tooltip="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            active={editor.isActive({ textAlign: 'right' })}
            tooltip="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
            active={editor.isActive({ textAlign: 'justify' })}
            tooltip="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            active={editor.isActive('bulletList')}
            tooltip="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            active={editor.isActive('orderedList')}
            tooltip="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            active={editor.isActive('blockquote')}
            tooltip="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={addImage} tooltip="Insert Image">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={addLink} active={editor.isActive('link')} tooltip="Add Link">
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} 
            tooltip="Clear Formatting"
          >
            <Eraser className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
