import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, User, Clock, CheckCircle2, Truck, Timer, ChevronRight, Filter } from 'lucide-react'

interface OrderItem { 
  id: string; 
  quantity: number; 
  product_id: string;
  price_at_purchase: number;
}

interface Order { 
  id: string; 
  status: string; 
  total_amount: number; 
  payment_method: string;
  created_at: string; 
  profiles?: { full_name: string }; 
}

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')

  const statusMap: Record<string, { label: string, color: string, icon: any }> = {
    'pending': { label: 'Pending', color: 'bg-zinc-100 text-zinc-600', icon: Clock },
    'processing': { label: 'Processing', color: 'bg-blue-100 text-blue-600', icon: Timer },
    'shipped': { label: 'In Transit', color: 'bg-orange-100 text-orange-600', icon: Truck },
    'delivered': { label: 'Delivered', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
    'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-600', icon: Package }
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: vendor } = await supabase.from('vendors').select('id').eq('owner_id', user.id).single()
    if (!vendor) { setLoading(false); return }

    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles:customer_id(full_name)')
      .eq('vendor_id', vendor.id)
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data as Order[])
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
    }
  }

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(o => o.status?.toLowerCase() === filterStatus.toLowerCase())

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-500" /> Incoming Orders
          </h1>
          <p className="text-zinc-500">Manage order fulfillment and tracking for your shop.</p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
           <button 
             onClick={() => setFilterStatus('ALL')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === 'ALL' ? 'bg-orange-500 text-white shadow-md' : 'text-zinc-500'}`}
           >
             All
           </button>
           {statusOptions.slice(0, 3).map(s => (
             <button 
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${filterStatus === s ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500'}`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => {
          const status = statusMap[order.status?.toLowerCase()] || statusMap['pending']
          const Icon = status.icon
          
          return (
            <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row">
                
                {/* Status Column */}
                <div className={`p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r dark:border-zinc-800 min-w-[140px] ${status.color.replace('text-', 'bg-').replace('100', '50/30')}`}>
                   <Icon className={`w-8 h-8 mb-2 ${status.color.split(' ')[1]}`} />
                   <span className={`text-xs font-black uppercase tracking-wider ${status.color.split(' ')[1]}`}>{status.label}</span>
                </div>

                {/* Info Area */}
                <div className="flex-1 p-6">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-orange-500 font-bold">#{order.id.substring(0, 8).toUpperCase()}</span>
                          <span className="text-zinc-300 dark:text-zinc-700">•</span>
                          <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleString()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <User className="w-5 h-5 text-zinc-400" /> {order.profiles?.full_name || 'Anonymous Customer'}
                        </h3>
                      </div>

                      <div className="flex flex-col items-end">
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">TSH {(order.total_amount || 0).toLocaleString()}</p>
                        <p className="text-xs text-zinc-500 font-medium">via {order.payment_method}</p>
                      </div>
                   </div>

                   <div className="mt-6 flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-zinc-500">Update Status:</span>
                      <div className="flex flex-wrap gap-2">
                         {statusOptions.map(opt => (
                           <button 
                             key={opt}
                             onClick={() => updateStatus(order.id, opt)}
                             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border transition-all
                               ${order.status?.toLowerCase() === opt 
                                 ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:text-zinc-900' 
                                 : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-orange-500 hover:text-orange-500'}`}
                           >
                             {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Actions Arrow */}
                <div className="p-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/30 group-hover:bg-orange-500 transition-all cursor-pointer">
                   <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-white" />
                </div>

              </div>
            </div>
          )
        })}

        {filteredOrders.length === 0 && (
          <div className="p-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
             <Package className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
             <h2 className="text-xl font-bold text-zinc-900 dark:text-white">No {filterStatus !== 'ALL' ? filterStatus : ''} orders found</h2>
             <p className="text-zinc-500 mt-2">Your shipment queue is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  )
}
