import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const BUCKET_NAME = 'videos'

// Supabase free tier max file size is 50 MB.
// Pro plan users can raise this in the Supabase dashboard under Storage > Policies.
const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB client-side guard

async function ensureBucketExists() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const exists = buckets?.some((b) => b.name === BUCKET_NAME)
    if (!exists) {
      // ⚠️  Do NOT pass fileSizeLimit or allowedMimeTypes here —
      // those parameters are validated against Supabase plan limits
      // and will throw 413 on the free tier, preventing bucket creation.
      // Configure size limits & MIME restrictions from the Supabase dashboard instead.
      const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
      })
      if (error) {
        console.error('Failed to create videos bucket:', error)
      }
    }
  } catch (err) {
    console.error('ensureBucketExists error:', err)
  }
}

export async function GET() {
  try {
    await ensureBucketExists()
    const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).list('', {
      sortBy: { column: 'created_at', order: 'desc' },
    })
    if (error) throw error

    const videos = (data || [])
      .filter((f) => f.name !== '.emptyFolderPlaceholder')
      .map((file) => {
        const { data: urlData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(file.name)
        return {
          name: file.name,
          url: urlData.publicUrl,
          size: file.metadata?.size ?? 0,
          created_at: file.created_at,
        }
      })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error listing videos:', error)
    return NextResponse.json({ error: 'Failed to list videos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureBucketExists()

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Only video files are allowed' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_SIZE_BYTES / (1024 * 1024)} MB` },
        { status: 413 }
      )
    }

    const fileExt = file.name.split('.').pop() || 'mp4'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    // Sanitise original name for display context in the stored filename
    const baseName = file.name
      .replace(/\.[^/.]+$/, '')             // strip extension
      .replace(/[^a-z0-9]/gi, '-')          // replace non-alphanumeric
      .toLowerCase()
      .slice(0, 40)                          // cap length
    const fileName = `${timestamp}-${randomStr}-${baseName}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(fileName)

    return NextResponse.json(
      {
        name: fileName,
        url: urlData.publicUrl,
        size: file.size,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('name')

    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([fileName])
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
