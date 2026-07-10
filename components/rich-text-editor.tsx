"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
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
  Type,
  Upload,
  Loader2,
  Video,
  Film,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from 'sonner'

// ─── Custom TipTap Video Node Extension ───────────────────────────────────────
const VideoExtension = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      width: { default: '100%' },
      title: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'video' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(
        {
          controls: true,
          width: '100%',
          style: 'border-radius:8px;margin:16px 0;max-height:480px;background:#000;',
        },
        HTMLAttributes
      ),
    ]
  },

  addNodeView() {
    return ({ node }) => {
      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'position:relative;margin:16px 0;border-radius:10px;overflow:hidden;background:#000;'

      const video = document.createElement('video')
      video.src = node.attrs.src
      video.controls = true
      video.style.cssText = 'width:100%;max-height:480px;display:block;border-radius:10px;'
      if (node.attrs.title) {
        const label = document.createElement('p')
        label.textContent = node.attrs.title
        label.style.cssText = 'font-size:12px;color:#aaa;text-align:center;padding:4px 0;margin:0;'
        wrapper.appendChild(video)
        wrapper.appendChild(label)
      } else {
        wrapper.appendChild(video)
      }

      return { dom: wrapper }
    }
  },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

async function uploadImageToStorage(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const resp = await fetch('/api/upload-image', { method: 'POST', body: formData })
    if (!resp.ok) return null
    const data = await resp.json()
    return data.url || null
  } catch {
    return null
  }
}

async function uploadVideoToStorage(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const resp = await fetch('/api/upload-video', { method: 'POST', body: formData })
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}))
      throw new Error(err.error || 'Upload failed')
    }
    const data = await resp.json()
    return data.url || null
  } catch (e: any) {
    throw e
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Write something amazing...",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const isInternalChange = useRef(false)
  const contentRef = useRef(content)
  const editorRef = useRef<ReturnType<typeof useEditor>>(null)

  useEffect(() => { contentRef.current = content }, [content])
  useEffect(() => { setIsMounted(true) }, [])

  // ── Image upload ────────────────────────────────────────────────────────────
  const handleImageUpload = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    setIsUploadingImage(true)
    const id = toast.loading(`Uploading ${imageFiles.length > 1 ? imageFiles.length + ' images' : 'image'}...`)

    let ok = 0
    for (const file of imageFiles) {
      const url = await uploadImageToStorage(file)
      if (url && editorRef.current) {
        editorRef.current.chain().focus().setImage({ src: url }).run()
        ok++
      }
    }

    toast.dismiss(id)
    setIsUploadingImage(false)
    ok > 0 ? toast.success(`${ok} image${ok > 1 ? 's' : ''} inserted`) : toast.error('Failed to upload image(s)')
  }

  // ── Video upload ────────────────────────────────────────────────────────────
  const handleVideoUpload = async (files: File[]) => {
    const videoFiles = files.filter(f => f.type.startsWith('video/'))
    if (videoFiles.length === 0) {
      toast.error('Please select a video file (MP4, WebM, MOV, etc.)')
      return
    }

    // Check size client-side (50 MB — Supabase free tier limit)
    const oversized = videoFiles.filter(f => f.size > 50 * 1024 * 1024)
    if (oversized.length > 0) {
      toast.error(`File too large (max 50 MB): ${oversized.map(f => f.name).join(', ')}`)
      return
    }

    setIsUploadingVideo(true)

    for (const file of videoFiles) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      setUploadProgress(`Uploading "${file.name}" (${sizeMB} MB)...`)
      const id = toast.loading(`Uploading video "${file.name}" (${sizeMB} MB)...`)

      try {
        const url = await uploadVideoToStorage(file)
        toast.dismiss(id)
        if (url && editorRef.current) {
          // Insert the custom video node
          editorRef.current.chain().focus().insertContent({
            type: 'video',
            attrs: { src: url, title: file.name.replace(/\.[^/.]+$/, '') },
          }).run()
          toast.success(`Video "${file.name}" inserted!`)
        } else {
          toast.error(`Failed to insert video "${file.name}"`)
        }
      } catch (e: any) {
        toast.dismiss(id)
        toast.error(e?.message || `Failed to upload "${file.name}"`)
      }
    }

    setIsUploadingVideo(false)
    setUploadProgress('')
  }

  // ── TipTap editor ───────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Typography,
      VideoExtension,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg my-4 shadow-md' },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline font-medium hover:text-accent transition-colors' },
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      const latest = contentRef.current
      if (latest && latest !== '<p></p>' && editor.getHTML() !== latest) {
        editor.commands.setContent(latest, { emitUpdate: false })
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
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData
        if (!clipboardData) return false

        // Handle pasted image files (screenshots, etc.)
        const imageFiles: File[] = []
        const videoFiles: File[] = []
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i]
          const file = item.getAsFile()
          if (!file) continue
          if (item.type.startsWith('image/')) imageFiles.push(file)
          else if (item.type.startsWith('video/')) videoFiles.push(file)
        }

        if (imageFiles.length > 0) {
          event.preventDefault()
          handleImageUpload(imageFiles)
          return true
        }
        if (videoFiles.length > 0) {
          event.preventDefault()
          handleVideoUpload(videoFiles)
          return true
        }
        return false
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false
        const dt = event.dataTransfer
        if (!dt) return false

        const imageFiles: File[] = []
        const videoFiles: File[] = []
        for (let i = 0; i < dt.files.length; i++) {
          const file = dt.files[i]
          if (file.type.startsWith('image/')) imageFiles.push(file)
          else if (file.type.startsWith('video/')) videoFiles.push(file)
        }

        if (imageFiles.length > 0) { event.preventDefault(); handleImageUpload(imageFiles); return true }
        if (videoFiles.length > 0) { event.preventDefault(); handleVideoUpload(videoFiles); return true }
        return false
      },
    },
  })

  useEffect(() => {
    if (editor) (editorRef as React.MutableRefObject<typeof editor>).current = editor
  }, [editor])

  useEffect(() => {
    if (!editor) return
    if (isInternalChange.current) { isInternalChange.current = false; return }
    const currentHTML = editor.getHTML()
    if (content !== currentHTML) editor.commands.setContent(content || '', { emitUpdate: false })
  }, [content, editor])

  if (!isMounted) {
    return (
      <div className="border border-border rounded-lg p-4 min-h-[300px] bg-muted/30">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    )
  }
  if (!editor) return null

  // ── Toolbar helpers ─────────────────────────────────────────────────────────
  const addImageByUrl = () => {
    const url = window.prompt('Enter image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const addVideoByUrl = () => {
    const url = window.prompt('Enter video URL (MP4, WebM, etc.):')
    if (url) {
      const name = url.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Video'
      editor.chain().focus().insertContent({ type: 'video', attrs: { src: url, title: name } }).run()
    }
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) await handleImageUpload(files)
    e.target.value = ''
  }

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) await handleVideoUpload(files)
    e.target.value = ''
  }

  const ToolbarButton = ({
    onClick, active = false, disabled = false, children, tooltip,
  }: {
    onClick: () => void; active?: boolean; disabled?: boolean
    children: React.ReactNode; tooltip: string
  }) => (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button" variant="ghost" size="sm"
            onClick={(e) => { e.preventDefault(); onClick() }}
            disabled={disabled}
            className={`h-8 w-8 p-0 ${active
              ? 'bg-accent text-accent-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground'
            }`}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top"><p className="text-xs font-medium">{tooltip}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const UploadButton = ({
    onClick, loading, children, tooltip, color = 'default',
  }: {
    onClick: () => void; loading?: boolean; children: React.ReactNode
    tooltip: string; color?: 'default' | 'purple'
  }) => (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button" variant="ghost" size="sm"
            onClick={onClick} disabled={loading}
            className={`h-8 w-8 p-0 ${
              color === 'purple'
                ? 'text-purple-500 hover:bg-purple-500/10 hover:text-purple-600'
                : 'text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground'
            }`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top"><p className="text-xs font-medium">{tooltip}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const isUploading = isUploadingImage || isUploadingVideo

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border/5 focus-within:ring-primary/20 transition-all duration-300">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/20">

        {/* History */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} tooltip="Undo">
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} tooltip="Redo">
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Formatting */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} tooltip="Bold">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} tooltip="Italic">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} tooltip="Underline">
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} tooltip="Inline Code">
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} tooltip="Heading 1">
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} tooltip="Heading 2">
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} tooltip="Paragraph">
            <Type className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} tooltip="Align Left">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} tooltip="Align Center">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} tooltip="Align Right">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} tooltip="Justify">
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} tooltip="Bullet List">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} tooltip="Ordered List">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} tooltip="Quote">
            <Quote className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Media — Images */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <ToolbarButton onClick={addImageByUrl} tooltip="Insert Image by URL">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <UploadButton onClick={() => imageInputRef.current?.click()} loading={isUploadingImage} tooltip="Upload Image from Device">
            <Upload className="h-4 w-4" />
          </UploadButton>
        </div>

        {/* Media — Videos (purple accent) */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-border/50">
          <UploadButton
            onClick={() => videoInputRef.current?.click()}
            loading={isUploadingVideo}
            tooltip="Upload Video / Screen Recording"
            color="purple"
          >
            <Film className="h-4 w-4" />
          </UploadButton>
          <ToolbarButton onClick={addVideoByUrl} tooltip="Insert Video by URL">
            <Video className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Link & Clear */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }} active={editor.isActive('link')} tooltip="Add Link">
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} tooltip="Clear Formatting">
            <Eraser className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Hidden file inputs */}
        <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageFileChange} className="hidden" />
        <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" />
      </div>

      {/* ── Upload status banner ─────────────────────────────────────────────── */}
      {isUploading && (
        <div className={`flex items-center gap-2 px-4 py-2 border-b text-xs ${
          isUploadingVideo
            ? 'bg-purple-500/10 border-purple-500/20 text-purple-600'
            : 'bg-accent/10 border-accent/20 text-accent'
        }`}>
          <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
          {isUploadingVideo
            ? uploadProgress || 'Uploading video to cloud storage...'
            : 'Uploading image to cloud storage...'}
        </div>
      )}

      {/* ── Editor content ───────────────────────────────────────────────────── */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      {/* ── Footer hint ──────────────────────────────────────────────────────── */}
      <div className="px-4 py-2 border-t border-border/30 bg-muted/10 flex flex-wrap gap-x-4 gap-y-1">
        <p className="text-xs text-muted-foreground">
          🖼️ Paste or drag images • 📹 Use <span className="text-purple-500 font-medium">🎬 Film</span> button to upload screen recordings / videos (MP4, WebM, MOV — up to 50 MB)
        </p>
      </div>
    </div>
  )
}
