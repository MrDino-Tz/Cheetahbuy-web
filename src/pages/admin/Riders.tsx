import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { AddUserModal } from '../../components/AddUserModal'
import { 
  Bike, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  UserPlus
} from 'lucide-react'

interface Rider {
  id: string
  full_name: string
  email: string
  phone: string | null
  created_at: string
  is_online: boolean
  total_deliveries: number
  rating: number
  vehicle_type: string
}

export default function Riders() {
  const [riders, setRiders] = useState<Rider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchRiders()
  }, [])

  async function fetchRiders() {
    setLoading(true)
    try {
      // First get all profiles and filter by role in code
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('All profiles:', allProfiles)
      console.log('Profiles error:', profilesError)
      
      // Filter profiles that have rider role (case insensitive)
      const riderProfiles = (allProfiles || []).filter(p => 
        p.role && p.role.toLowerCase() === 'rider'
      )
      
      console.log('Filtered riders:', riderProfiles)
      
      const ridersWithStats = await Promise.all(riderProfiles.map(async (profile) => {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('rider_id', profile.id)
          .eq('status', 'delivered')
        
        return {
          id: profile.id,
          full_name: profile.full_name || 'Unknown Rider',
          email: profile.email || '',
          phone: profile.phone || null,
          created_at: profile.created_at,
          is_online: profile.is_online || false,
          total_deliveries: count || 0,
          rating: profile.rating || 4.5,
          vehicle_type: profile.vehicle_type || 'Motorcycle'
        }
      }))
      
      setRiders(ridersWithStats)
    } catch (error) {
      console.error('Error fetching riders:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleRiderStatus(riderId: string, currentStatus: boolean) {
    try {
      await supabase
        .from('profiles')
        .update({ is_online: !currentStatus })
        .eq('id', riderId)
      
      fetchRiders()
    } catch (error) {
      console.error('Error updating rider status:', error)
    }
  }

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = 
      rider.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phone?.includes(searchTerm)
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'online' && rider.is_online) ||
      (filterStatus === 'offline' && !rider.is_online)
    
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: riders.length,
    online: riders.filter(r => r.is_online).length,
    offline: riders.filter(r => !r.is_online).length,
    deliveries: riders.reduce((acc, r) => acc + r.total_deliveries, 0)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Rider Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage delivery riders and track their performance
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
        >
          <UserPlus className="size-4" />
          Add Rider
        </button>
      </div>

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        role="RIDER"
        onUserAdded={fetchRiders}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Bike className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Riders</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="size-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Online Now</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.online}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-zinc-500/10 flex items-center justify-center">
              <XCircle className="size-5 text-zinc-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Offline</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.offline}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <MapPin className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Deliveries</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{stats.deliveries}</p>
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
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('online')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === 'online' 
                ? 'bg-green-500 text-white' 
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilterStatus('offline')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === 'offline' 
                ? 'bg-zinc-500 text-white' 
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800'
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      {/* Riders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="size-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 mt-4">Loading riders...</p>
        </div>
      ) : filteredRiders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <Bike className="size-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">No riders found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rider</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Vehicle</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Performance</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredRiders.map((rider) => (
                  <tr key={rider.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {rider.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{rider.full_name}</p>
                          <p className="text-xs text-zinc-500">ID: {rider.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {rider.email && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Mail className="size-3" />
                            {rider.email}
                          </div>
                        )}
                        {rider.phone && (
                          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <Phone className="size-3" />
                            {rider.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Bike className="size-4 text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">{rider.vehicle_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">{rider.total_deliveries}</span>
                          <span className="text-xs text-zinc-500">deliveries</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-yellow-500">★</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">{rider.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRiderStatus(rider.id, rider.is_online)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          rider.is_online
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        <span className={`size-2 rounded-full ${rider.is_online ? 'bg-green-500' : 'bg-zinc-400'}`} />
                        {rider.is_online ? 'Online' : 'Offline'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Clock className="size-3" />
                        {new Date(rider.created_at).toLocaleDateString()}
                      </div>
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
