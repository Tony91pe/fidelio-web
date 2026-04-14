'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface User {
  id: string
  type: 'MERCHANT' | 'CUSTOMER'
  name: string
  email: string
  suspended: boolean
  createdAt: string
  lastActivityAt: string | null
}

export function AdminPasswordManager() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [search])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users?search=${search}&limit=100`)
      const data = await res.json()
      setUsers(data.users)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!selectedUser) return
    setResetting(true)

    try {
      const res = await fetch('/api/admin/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id }),
      })

      if (!res.ok) throw new Error('Failed to reset password')

      const data = await res.json()
      toast.success(`Password reset. Temp: ${data.tempPassword}`)
      setResetModalOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      toast.error('Reset failed')
    } finally {
      setResetting(false)
    }
  }

  const handleForceLogout = async () => {
    if (!selectedUser) return
    setResetting(true)

    try {
      const res = await fetch('/api/admin/force-logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id }),
      })

      if (!res.ok) throw new Error('Failed to force logout')

      toast.success(`${selectedUser.name} logged out`)
      setLogoutModalOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      toast.error('Logout failed')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="capitalize">{user.type.toLowerCase()}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={user.suspended ? 'text-red-500' : 'text-green-500'}>
                  {user.suspended ? 'Suspended' : 'Active'}
                </span>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {user.lastActivityAt
                  ? new Date(user.lastActivityAt).toLocaleDateString()
                  : 'Never'}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user)
                    setResetModalOpen(true)
                  }}
                >
                  Reset Password
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user)
                    setLogoutModalOpen(true)
                  }}
                >
                  Force Logout
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset password for {selectedUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={resetting}>
              {resetting ? 'Resetting...' : 'Confirm Reset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to force logout {selectedUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleForceLogout} disabled={resetting}>
              {resetting ? 'Logging out...' : 'Confirm Logout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
