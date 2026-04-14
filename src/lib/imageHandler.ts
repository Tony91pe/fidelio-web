import { vercel } from '@vercel/blob'
import sharp from 'sharp'
import { randomBytes } from 'crypto'

export async function uploadImage(file: File, shopId: string) {
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) throw new Error('File too large')

  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) throw new Error('Invalid file type')

  const buffer = await file.arrayBuffer()
  let processed = Buffer.from(buffer)

  try {
    processed = await sharp(processed)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
  } catch (e) {
    processed = Buffer.from(buffer)
  }

  const filename = `${shopId}/${Date.now()}-${randomBytes(4).toString('hex')}.webp`

  try {
    const blob = await vercel.put(filename, processed, { access: 'public' })
    return { url: blob.url, filename: blob.pathname }
  } catch (e) {
    console.error('Upload failed:', e)
    throw new Error('Upload failed')
  }
}

export async function deleteImage(filename: string) {
  try {
    await vercel.del(filename)
  } catch (e) {
    console.error('Delete failed:', e)
  }
}
