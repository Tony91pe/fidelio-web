import Sidebar from '@/components/dashboard/Sidebar'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0F0F1A] text-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
