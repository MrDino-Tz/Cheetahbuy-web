import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, Store, Clock, CheckCircle2, Truck, X, AlertCircle, Bike } from 'lucide-react'

interface Order {
  id: string
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  profiles?: { full_name: string }
  vendors?: { name: string }
  rider?: { profiles?: { full_name: string } }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:customer_id(full_name),
        vendors:vendor_id(name),
        rider:rider_id(
          profiles:profiles(full_name)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      const fallback = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (fallback.data) setOrders(fallback.data as any[])
    } else if (data) {
      setOrders(data as Order[])
    }
    setLoading(false)
  }

  const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
    'pending': { label: 'Pending', color: 'text-zinc-600', bgColor: 'bg-zinc-100', icon: Clock },
    'processing': { label: 'Processing', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: AlertCircle },
    'ready': { label: 'Ready', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Package },
    'assigned': { label: 'Assigned', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Bike },
    'shipped': { label: 'Shipped', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Truck },
    'delivered': { label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2 },
    'cancelled': { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100', icon: X }
  }

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(o => o.status?.toLowerCase() === filterStatus.toLowerCase())

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  }

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-500" /> Platform Orders
        </h1>
        <p className="text-zinc-500">Monitor all transactions across the platform.</p>
      </div>

      {/* Status Counts */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {[
          { key: 'all', label: 'All', color: 'text-zinc-600 bg-zinc-100' },
          { key: 'pending', label: 'Pending', color: statusConfig['pending'].color + ' ' + statusConfig['pending'].bgColor },
          { key: 'processing', label: 'Processing', color: statusConfig['processing'].color + ' ' + statusConfig['processing'].bgColor },
          { key: 'ready', label: 'Ready', color: statusConfig['ready'].color + ' ' + statusConfig['ready'].bgColor },
          { key: 'shipped', label: 'Shipped', color: statusConfig['shipped'].color + ' ' + statusConfig['shipped'].bgColor },
          { key: 'delivered', label: 'Delivered', color: statusConfig['delivered'].color + ' ' + statusConfig['delivered'].bgColor },
          { key: 'cancelled', label: 'Cancelled', color: statusConfig['cancelled'].color + ' ' + statusConfig['cancelled'].bgColor }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilterStatus(item.key.toUpperCase())}
            className={`p-3 rounded-xl text-center transition-all ${
              filterStatus === item.key.toUpperCase()
                ? 'ring-2 ring-orange-500 ' + item.color
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-orange-300'
            }`}
          >
            <p className="text-lg font-bold text-zinc-900 dark:text-white">{statusCounts[item.key as keyof typeof statusCounts]}</p>
            <p className="text-xs text-zinc-500 capitalize">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs font-semibold uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Rider</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredOrders.map((o) => {
                const status = statusConfig[o.status?.toLowerCase()] || statusConfig['pending']
                const StatusIcon = status.icon
                return (
                  <tr key={o.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-orange-500">
                        {o.id.substring(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        {o.profiles?.full_name || 'Customer'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <Store className="w-3 h-3" /> {o.vendors?.name || 'Vendor'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {o.rider?.profiles ? (
                        <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Bike className="w-3 h-3" /> {o.rider.profiles.full_name}
                        </p>
                      ) : (
                        <span className="text-xs text-zinc-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                      TSH {(o.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${status.bgColor} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(o.created_at).toLocaleDateString()} {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                )
              })}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-zinc-500">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
