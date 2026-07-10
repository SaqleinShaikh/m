import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const BUCKET_NAME = 'images'

async function ensureBucketExists() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === BUCKET_NAME)
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'],
      fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    })
    if (error) {
      console.error('Failed to create bucket:', error)
    }
  }
}

export async function GET() {
  try {
    await ensureBucketExists()
    const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).list('', {
      sortBy: { column: 'created_at', order: 'desc' },
    })
    if (error) throw error

    const { data: { publicUrl: baseUrl } } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl('')

    const images = (data || [])
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

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error listing images:', error)
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 })
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

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop() || 'png'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileName = `${timestamp}-${randomStr}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(fileName)

    return NextResponse.json({
      name: fileName,
      url: urlData.publicUrl,
      size: file.size,
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
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
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
