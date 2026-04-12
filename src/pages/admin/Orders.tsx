import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, Store, Clock } from 'lucide-react'

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  profiles?: { full_name: string }
  vendors?: { name: string }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      // Fetch real data with joined profiles and vendors
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:customer_id (full_name),
          vendors:vendor_id (name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        // Fallback simple fetch if exact foreign keys aren't set
        const fallback = await supabase.from('orders').select('*').order('created_at', { ascending: false })
        if (fallback.data) setOrders(fallback.data as any[])
      } else if (data) {
        setOrders(data as Order[])
      }
      setLoading(false)
    }
    loadOrders()
  }, [])

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-500" /> Platform Orders
        </h1>
        <p className="text-zinc-500">Monitor live transactions passing between customers and vendors.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs font-semibold uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Participants</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {orders.map((o) => (
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
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                       <Store className="w-3 h-3" /> {o.vendors?.name || 'Vendor'}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    TSH {(o.total_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${o.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                      ${o.status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                      ${o.status?.toLowerCase() === 'in transit' ? 'bg-orange-100 text-orange-700' : ''}
                      ${o.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-zinc-100 text-zinc-700'}
                    `}>
                      {o.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 
                      {new Date(o.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No live orders found in the database.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
