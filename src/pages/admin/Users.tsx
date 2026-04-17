import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  Users as UsersIcon, 
  Bike, 
  Store, 
  User,
  Shield,
  Phone,
  Mail,
  Clock,
  Search,
  Filter,
  Edit3,
  Check,
  X
} from 'lucide-react'

interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  created_at: string
  avatar_url: string | null
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<string>('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('All profiles:', data)
      console.log('Error:', error)
      
      if (data) setUsers(data as UserProfile[])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateUserRole(userId: string, newRole: string) {
    try {
      await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      setEditingId(null)
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return <Shield className="size-4" />
      case 'VENDOR': return <Store className="size-4" />
      case 'RIDER': return <Bike className="size-4" />
      default: return <User className="size-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'VENDOR': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'RIDER': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'CUSTOMER': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.phone || '').includes(searchTerm)
    
    const matchesFilter = filterRole === 'all' || user.role?.toUpperCase() === filterRole.toUpperCase()
    
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: users.length,
    customers: users.filter(u => u.role?.toUpperCase() === 'CUSTOMER').length,
    vendors: users.filter(u => u.role?.toUpperCase() === 'VENDOR').length,
    riders: users.filter(u => u.role?.toUpperCase() === 'RIDER').length,
    admins: users.filter(u => u.role?.toUpperCase() === 'ADMIN').length,
  }

  const roles = ['ADMIN', 'VENDOR', 'RIDER', 'CUSTOMER']

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <UsersIcon className="size-6 text-orange-500" />
            All Users
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage all platform users and their roles
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-zinc-500/10 flex items-center justify-center">
              <UsersIcon className="size-5 text-zinc-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Users</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <User className="size-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Customers</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.customers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Store className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Vendors</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.vendors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Bike className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Riders</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.riders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Shield className="size-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Admins</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'CUSTOMER', 'VENDOR', 'RIDER', 'ADMIN'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterRole === role 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800'
              }`}
            >
              {role === 'all' ? 'All' : role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="size-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 mt-4">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <UsersIcon className="size-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {(user.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{user.full_name || 'Unknown User'}</p>
                          <p className="text-xs text-zinc-500">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Mail className="size-3" />
                            {user.email}
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Phone className="size-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
                          >
                            {roles.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => updateUserRole(user.id, editRole)}
                            className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <Check className="size-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role || 'N/A'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Clock className="size-3" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setEditingId(user.id)
                          setEditRole(user.role || 'CUSTOMER')
                        }}
                        className="p-2 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                      >
                        <Edit3 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
