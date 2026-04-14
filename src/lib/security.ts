import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many password reset attempts',
})

export function checkRateLimit(type: 'login' | 'api' | 'resetPassword'): any {
  switch (type) {
    case 'login':
      return loginLimiter
    case 'api':
      return apiLimiter
    case 'resetPassword':
      return resetPasswordLimiter
    default:
      return apiLimiter
  }
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>\"']/g, '')
    .trim()
    .substring(0, 1000)
}
