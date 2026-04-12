import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    loadUsers()
  }, [])

  const updateRole = async (id: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', id)
    setUsers(users.map(u => u.id === id ? { ...u, role } : u))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Users</h1>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Phone</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>{users.map(user => (<tr key={user.id}><td>{user.full_name || 'N/A'}</td><td>{user.phone || 'N/A'}</td><td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td><td>{new Date(user.created_at).toLocaleDateString()}</td><td><select value={user.role} onChange={(e) => updateRole(user.id, e.target.value)}><option value="CUSTOMER">Customer</option><option value="VENDOR">Vendor</option><option value="RIDER">Rider</option><option value="ADMIN">Admin</option></select></td></tr>))}</tbody>
      </table>
    </div>
  )
}