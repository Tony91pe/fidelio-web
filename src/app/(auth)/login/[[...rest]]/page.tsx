import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D1A]">
      <SignIn afterSignInUrl="/dashboard" redirectUrl="/dashboard" />
    </div>
  )
}
