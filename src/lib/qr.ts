import QRCode from 'qrcode'
import crypto from 'crypto'

export interface QRData {
  code: string
  type: 'static' | 'dynamic'
  payload: Record<string, any>
  expiresAt?: Date
}

export async function generateQRCode(data: QRData): Promise<string> {
  const payload = JSON.stringify(data.payload)
  const qrData = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${data.code}?payload=${Buffer.from(payload).toString('base64')}`
  
  const dataUrl = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 1,
  })
  
  return dataUrl
}

export function generateQRCode(data: QRData): Promise<string> {
  const payload = JSON.stringify(data.payload)
  const qrData = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${data.code}`
  
  return QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 1,
  })
}

export function validateQRCode(code: string): boolean {
  return /^[a-zA-Z0-9-_]{20,}$/.test(code)
}

export function generateSecureQRCode(): string {
  return crypto.randomBytes(16).toString('hex')
}

export async function logQRScan(qrCode: string, shopId: string, metadata?: Record<string, any>) {
  const scan = {
    qrCode,
    shopId,
    scannedAt: new Date(),
    metadata,
  }
  return scan
}
