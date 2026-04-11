import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div style={{minHeight:'100vh',background:'#0D0D1A',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <SignIn afterSignInUrl="/dashboard" />
    </div>
  )
}
