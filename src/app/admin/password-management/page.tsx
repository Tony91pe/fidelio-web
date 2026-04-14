import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminPasswordManager } from '@/components/admin/AdminPasswordManager'

export default async function PasswordManagementPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Password Management</h1>
        <p className="text-gray-500 mt-2">Manage user passwords and sessions</p>
      </div>

      <AdminPasswordManager />
    </div>
  )
}
