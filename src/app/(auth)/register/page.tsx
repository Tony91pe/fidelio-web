import { SignUp } from '@clerk/nextjs'

export default function RegisterPage() {
  return (
    <div style={{minHeight:'100vh',background:'#0D0D1A',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <SignUp afterSignUpUrl="/dashboard" />
    </div>
  )
}
