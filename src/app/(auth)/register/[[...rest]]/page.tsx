import { SignUp } from '@clerk/nextjs'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D1A]">
      <SignUp />
    </div>
  )
}
