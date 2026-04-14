import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/plans", label: "Plans", icon: "💰" },
    { href: "/admin/shops", label: "Shops", icon: "🏪" },
    { href: "/admin/qr", label: "QR Codes", icon: "📱" },
    { href: "/admin/automations", label: "Automations", icon: "🤖" },
    { href: "/admin/notifications", label: "Notifications", icon: "🔔" },
    { href: "/admin/images", label: "Images", icon: "🖼️" },
    { href: "/admin/map", label: "Map", icon: "🗺️" },
    { href: "/admin/logs", label: "Logs", icon: "📋" },
    { href: "/admin/security", label: "Security", icon: "🔒" },
    { href: "/admin/legal", label: "Legal", icon: "⚖️" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white overflow-y-auto shadow-lg">
        <div className="p-4 font-bold text-xl border-b">Fidelio Admin</div>
        <nav className="space-y-1 p-4">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
