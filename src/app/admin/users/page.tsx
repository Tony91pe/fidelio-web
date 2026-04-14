"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetch_users = async () => {
      const res = await fetch(`/api/admin/users?search=${search}`)
      const data = await res.json()
      setUsers(data.users)
    }
    fetch_users()
  }, [search])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="mb-4 max-w-sm" />
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.type}</td>
              <td className="p-2">{u.suspended ? "Suspended" : "Active"}</td>
              <td className="p-2"><Button size="sm">Actions</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
