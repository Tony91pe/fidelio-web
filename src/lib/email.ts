import { Resend } from 'resend'

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendEmail({
  to,
  subject,
  template,
  data,
}: {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}) {
  const resend = getResendClient()
  
  const htmlContent = `
    <h1>${data.title || subject}</h1>
    <p>${data.message || ''}</p>
  `

  return await resend.emails.send({
    from: 'Fidelio <noreply@fidelio.com>',
    to,
    subject,
    html: htmlContent,
  })
}

export async function sendWelcomeEmail(to: string, customerName: string, shopName: string, points: number) {
  const resend = getResendClient()

  return await resend.emails.send({
    from: 'Fidelio <noreply@fidelio.com>',
    to,
    subject: `Welcome to ${shopName}!`,
    html: `
      <h1>Welcome ${customerName}!</h1>
      <p>You just earned ${points} points at ${shopName}</p>
    `,
  })
}

export async function sendWinbackEmail(to: string, customerName: string, shopName: string, points: number, days: number) {
  const resend = getResendClient()

  return await resend.emails.send({
    from: 'Fidelio <noreply@fidelio.com>',
    to,
    subject: `Come back to ${shopName}!`,
    html: `
      <h1>Hi ${customerName},</h1>
      <p>You have ${points} points waiting for you at ${shopName}</p>
      <p>You haven't visited in ${days} days - come back soon!</p>
    `,
  })
}
