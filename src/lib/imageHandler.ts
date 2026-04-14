import { put, del } from '@vercel/blob'
import { randomBytes } from 'crypto'

export async function uploadImage(file: File, shopId: string) {
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) throw new Error('File too large')

  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) throw new Error('Invalid file type')

  const buffer = await file.arrayBuffer()
  const filename = `${shopId}/${Date.now()}-${randomBytes(4).toString('hex')}.webp`

  try {
    const blob = await put(filename, buffer, { access: 'public' })
    return { url: blob.url, filename: blob.pathname }
  } catch (e) {
    console.error('Upload failed:', e)
    throw new Error('Upload failed')
  }
}

export async function deleteImage(filename: string) {
  try {
    await del(filename)
  } catch (e) {
    console.error('Delete failed:', e)
  }
}
