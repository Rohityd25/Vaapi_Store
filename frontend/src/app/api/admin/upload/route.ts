import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    
    let fileStr = body?.file
    if (!fileStr) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const result = await uploadImage(fileStr, 'vaapi-products')
        return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
      } catch (cloudErr: any) {
        console.warn('Cloudinary upload error, using raw URL/data fallback:', cloudErr.message)
      }
    }

    // Fallback: return file URL directly (base64 or http URL)
    return NextResponse.json({ url: fileStr })
  } catch (error: any) {
    console.error('Image Upload API Error:', error)
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 })
  }
}
