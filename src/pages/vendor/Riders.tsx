import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Bike, Phone, MapPin, Clock, CheckCircle2, Package, Navigation, User, Mail } from 'lucide-react'

interface Rider {
  id: string
  profiles?: {
    full_name: string
    phone: string
    email: string
  }
  current_lat?: number
  current_lng?: number
  is_available: boolean
  total_deliveries: number
  rating: number
  vehicle_type: string
  created_at: string
}

interface Order {
  id: string
  status: string
  total_amount: number
  rider_id?: string
  rider?: {
    profiles?: {
      full_name: string
      phone: string
    }
  }
  customer_lat?: number
  customer_lng?: number
  delivery_address?: string
  created_at: string
}

export default function VendorRiders() {
  const [riders, setRiders] = useState<Rider[]>([])
  const [ordersWithRiders, setOrdersWithRiders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'available' | 'in-transit'>('available')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: vendor } = await supabase.from('vendors').select('id').eq('owner_id', user.id).single()
    if (!vendor) { setLoading(false); return }

    const [ridersData, ordersData] = await Promise.all([
      supabase
        .from('riders')
        .select(`
          *,
          profiles:profiles(full_name, phone, email)
        `)
        .order('is_available', { ascending: false }),
      supabase
        .from('orders')
        .select(`
          *,
          rider:rider_id(
            profiles:profiles(full_name, phone)
          )
        `)
        .eq('vendor_id', vendor.id)
        .in('status', ['assigned', 'shipped'])
        .not('rider_id', 'is', null)
    ])

    const ridersWithStats = await Promise.all((ridersData.data || []).map(async (rider: any) => {
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('rider_id', rider.id)
        .eq('status', 'delivered')
      return { ...rider, total_deliveries: count || 0 }
    }))

    setRiders(ridersWithStats)
    setOrdersWithRiders(ordersData.data || [])
    setLoading(false)
  }

  const availableRiders = riders.filter(r => r.is_available)
  const inTransitOrders = ordersWithRiders.filter(o => o.status === 'shipped')

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Bike className="w-6 h-6 text-orange-500" /> Rider Management
        </h1>
        <p className="text-zinc-500">Manage your delivery riders and track deliveries.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{availableRiders.length}</p>
              <p className="text-xs text-zinc-500">Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Navigation className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{inTransitOrders.length}</p>
              <p className="text-xs text-zinc-500">In Transit</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Bike className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{riders.length}</p>
              <p className="text-xs text-zinc-500">Total Riders</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">
                {riders.reduce((sum, r) => sum + (r.total_deliveries || 0), 0)}
              </p>
              <p className="text-xs text-zinc-500">Total Deliveries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-fit">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'available' 
              ? 'bg-orange-500 text-white' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Available Riders ({availableRiders.length})
        </button>
        <button
          onClick={() => setActiveTab('in-transit')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'in-transit' 
              ? 'bg-orange-500 text-white' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Active Deliveries ({inTransitOrders.length})
        </button>
      </div>

      {/* Available Riders - Table View */}
      {activeTab === 'available' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
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
                {riders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Bike className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                      <p className="text-zinc-500">No riders registered yet</p>
                    </td>
                  </tr>
                ) : (
                  riders.map((rider) => (
                    <tr key={rider.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {rider.profiles?.full_name?.charAt(0) || 'R'}
                          </div>
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">{rider.profiles?.full_name || 'Unknown Rider'}</p>
                            <p className="text-xs text-zinc-500">ID: {rider.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {rider.profiles?.email && (
                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                              <Mail className="size-3" />
                              {rider.profiles.email}
                            </div>
                          )}
                          {rider.profiles?.phone && (
                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                              <Phone className="size-3" />
                              {rider.profiles.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Bike className="size-4 text-zinc-400" />
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">{rider.vehicle_type || 'Motorcycle'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{rider.total_deliveries || 0}</span>
                            <span className="text-xs text-zinc-500">deliveries</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-yellow-500">★</span>
                            <span className="text-sm font-medium text-zinc-900 dark:text-white">{(rider.rating || 4.5).toFixed(1)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          rider.is_available
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          <span className={`size-2 rounded-full ${rider.is_available ? 'bg-green-500' : 'bg-zinc-400'}`} />
                          {rider.is_available ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Clock className="size-3" />
                          {new Date(rider.created_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* In Transit Orders */}
      {activeTab === 'in-transit' && (
        <div className="space-y-4">
          {inTransitOrders.length === 0 ? (
            <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <Navigation className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No active deliveries</h3>
              <p className="text-zinc-500 text-sm">Orders with assigned riders will appear here.</p>
            </div>
          ) : (
            inTransitOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm font-mono text-orange-500 font-bold">#{order.id.substring(0, 8).toUpperCase()}</span>
                      <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-zinc-900 dark:text-white">TSH {(order.total_amount || 0).toLocaleString()}</p>
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs font-bold rounded-full">
                        In Transit
                      </span>
                    </div>
                  </div>

                  {/* Rider Info */}
                  {order.rider?.profiles && (
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Assigned Rider</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Bike className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">{order.rider.profiles.full_name}</p>
                          <p className="text-sm text-zinc-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {order.rider.profiles.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  {order.delivery_address && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{order.delivery_address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
