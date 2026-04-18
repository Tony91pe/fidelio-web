import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken  = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

function getClient() {
  if (!accountSid || !authToken) throw new Error('Twilio non configurato')
  return twilio(accountSid, authToken)
}

export async function sendSMS(to: string, body: string): Promise<boolean> {
  if (!accountSid || !authToken || !fromNumber) {
    console.warn('[SMS] Twilio non configurato, SMS non inviato')
    return false
  }
  try {
    const client = getClient()
    await client.messages.create({ body, from: fromNumber, to })
    return true
  } catch (err) {
    console.error('[SMS] Errore invio:', err)
    return false
  }
}

export async function sendWinbackSMS(to: string, customerName: string, shopName: string, points: number) {
  return sendSMS(to,
    `Ciao ${customerName}! 👋 Ti manca ${shopName}? Hai ${points} punti Fidelio che ti aspettano. Torna a trovarci!`
  )
}

export async function sendBirthdaySMS(to: string, customerName: string, shopName: string, bonusPoints: number) {
  return sendSMS(to,
    `🎂 Buon compleanno ${customerName}! Un regalo da ${shopName}: +${bonusPoints} punti Fidelio sul tuo account. Vieni a festeggiar con noi!`
  )
}

export async function sendRewardSMS(to: string, customerName: string, shopName: string, rewardTitle: string) {
  return sendSMS(to,
    `🎁 ${customerName}, hai sbloccato un premio da ${shopName}: "${rewardTitle}". Mostralo in negozio per riscattarlo!`
  )
}

export async function sendPointsSMS(to: string, customerName: string, shopName: string, points: number, total: number) {
  return sendSMS(to,
    `✅ +${points} punti da ${shopName}! Hai ora ${total} punti Fidelio. — fidelio: getfidelio.app`
  )
}
