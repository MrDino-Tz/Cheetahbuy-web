import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Package, User, Clock, CheckCircle2, Truck, Timer, ChevronRight, Bike, X } from 'lucide-react'

interface Rider {
  id: string
  profiles?: { full_name: string; phone: string }
  is_available: boolean
  vehicle_type: string
  rating: number
}

interface Order {
  id: string
  status: string
  total_amount: number
  payment_method: string
  created_at: string
  rider_id?: string
  profiles?: { full_name: string }
  rider?: { profiles?: { full_name: string; phone: string } }
}

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [riders, setRiders] = useState<Rider[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [showRiderModal, setShowRiderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const statusMap: Record<string, { label: string, color: string, icon: any }> = {
    'pending': { label: 'Pending', color: 'bg-zinc-100 text-zinc-600', icon: Clock },
    'pending_payment': { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-600', icon: Clock },
    'processing': { label: 'Processing', color: 'bg-blue-100 text-blue-600', icon: Timer },
    'ready': { label: 'Ready', color: 'bg-purple-100 text-purple-600', icon: Package },
    'assigned': { label: 'Assigned', color: 'bg-orange-100 text-orange-600', icon: Bike },
    'shipped': { label: 'In Transit', color: 'bg-orange-100 text-orange-600', icon: Truck },
    'delivered': { label: 'Delivered', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
    'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-600', icon: X }
  }

  const statusOptions = ['pending_payment', 'pending', 'processing', 'ready', 'assigned', 'shipped', 'delivered', 'cancelled']

  useEffect(() => { 
    loadOrders() 
    loadRiders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('No user logged in')
      setLoading(false)
      return
    }

    // Get vendor for current user
    const { data: vendor } = await supabase.from('vendors').select('id, name').eq('owner_id', user.id).single()
    console.log('Vendor:', vendor)
    console.log('User ID:', user.id)
    
    // Get ALL orders (temporarily show all for debugging)
    const { data: allOrders, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:customer_id(full_name),
        rider:rider_id(
          profiles:profiles(full_name, phone)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50)
    
    console.log('All orders:', allOrders?.length, allOrders)
    console.log('Error:', error)
    
    // TEMPORARY: Show ALL orders for debugging
    setOrders((allOrders || []) as Order[])
    setLoading(false)
  }

  async function loadRiders() {
    const { data } = await supabase
      .from('riders')
      .select('*, profiles:profiles(full_name, phone)')
      .eq('is_available', true)
    
    if (data) setRiders(data as Rider[])
  }

  const updateStatus = async (id: string, newStatus: string) => {
    let autoAssignedRider = null
    const currentOrder = orders.find(o => o.id === id)
    
    // Auto-assign rider when status changes to "ready"
    if (newStatus === 'ready' && currentOrder && !currentOrder.rider_id) {
      const availableRiders = riders.filter(r => r.is_available)
      if (availableRiders.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableRiders.length)
        autoAssignedRider = availableRiders[randomIndex]
        
        const { data: riderProfile } = await supabase
          .from('riders')
          .select('profile_id')
          .eq('id', autoAssignedRider.id)
          .single()
        
        const riderUserId = riderProfile?.profile_id || autoAssignedRider.id
        
        const { error: assignError } = await supabase
          .from('orders')
          .update({ status: 'assigned', rider_id: riderUserId })
          .eq('id', id)
        
        if (!assignError) {
          await supabase.from('riders').update({ is_available: false }).eq('id', autoAssignedRider.id)
          
          const { data: updatedOrder } = await supabase
            .from('orders')
            .select(`
              *,
              profiles:customer_id(full_name),
              rider:rider_id(
                profiles:profiles(full_name, phone)
              )
            `)
            .eq('id', id)
            .single()
          
          if (updatedOrder) {
            setOrders(orders.map(o => o.id === id ? updatedOrder : o))
            loadRiders()
            return
          }
        }
      }
    }
    
    const { error } = await supabase.from('orders').update({ status: newStatus.toUpperCase().replace(' ', '_') }).eq('id', id)
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
    }
  }

  const assignRider = async (orderId: string, riderId: string) => {
    // Get the profile_id (user's ID) for the rider
    const { data: riderProfile } = await supabase
      .from('riders')
      .select('profile_id')
      .eq('id', riderId)
      .single()
    
    const riderUserId = riderProfile?.profile_id || riderId
    
    const { error } = await supabase
      .from('orders')
      .update({ rider_id: riderUserId, status: 'assigned' })
      .eq('id', orderId)
    
    if (!error) {
      const rider = riders.find(r => r.id === riderId)
      setOrders(orders.map(o => o.id === orderId ? { 
        ...o, 
        rider_id: riderUserId, 
        status: 'assigned',
        rider: { profiles: rider?.profiles }
      } : o))
    }
    setShowRiderModal(false)
    setSelectedOrder(null)
  }

  const openRiderModal = (orderId: string) => {
    setSelectedOrder(orderId)
    setShowRiderModal(true)
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
      {/* Rider Assignment Modal */}
      {showRiderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Assign Rider</h3>
              <button onClick={() => setShowRiderModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            
            {riders.length === 0 ? (
              <div className="text-center py-8">
                <Bike className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                <p className="text-zinc-500">No riders available</p>
                <p className="text-sm text-zinc-400 mt-1">Riders will appear here when online</p>
              </div>
            ) : (
              <div className="space-y-3">
                {riders.map((rider) => (
                  <button
                    key={rider.id}
                    onClick={() => selectedOrder && assignRider(selectedOrder, rider.id)}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center gap-4 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                  >
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      <Bike className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {rider.profiles?.full_name || 'Rider'}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {rider.profiles?.phone} • {rider.vehicle_type || 'Motorcycle'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-500">Available</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-500" /> Incoming Orders
          </h1>
          <p className="text-zinc-500">Manage order fulfillment and rider assignment.</p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
           <button 
             onClick={() => setFilterStatus('ALL')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${filterStatus === 'ALL' ? 'bg-orange-500 text-white shadow-md' : 'text-zinc-500'}`}
           >
             All
           </button>
           {['pending', 'ready', 'assigned', 'shipped'].map(s => (
             <button 
               key={s}
               onClick={() => setFilterStatus(s)}
               className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all capitalize ${filterStatus === s ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500'}`}
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
            <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-md transition-all">
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-mono text-orange-500 font-bold">#{order.id.substring(0, 8).toUpperCase()}</span>
                          <span className="text-zinc-300 dark:text-zinc-700">•</span>
                          <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleString()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <User className="w-5 h-5 text-zinc-400" /> {order.profiles?.full_name || 'Anonymous Customer'}
                        </h3>
                        {order.rider?.profiles && (
                          <p className="text-sm text-blue-600 flex items-center gap-1">
                            <Bike className="w-4 h-4" /> Rider: {order.rider.profiles.full_name}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">TSH {(order.total_amount || 0).toLocaleString()}</p>
                        <p className="text-xs text-zinc-500 font-medium">via {order.payment_method}</p>
                      </div>
                   </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                       {!order.rider_id && order.status === 'ready' && (
                         <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                           <Bike className="w-4 h-4" />
                           Auto-assigning rider...
                         </div>
                       )}
                       {order.rider_id && order.status === 'ready' && (
                         <button 
                           onClick={() => openRiderModal(order.id)}
                           className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors"
                         >
                           <Bike className="w-4 h-4" />
                           Change Rider
                         </button>
                       )}
                      <span className="text-sm font-medium text-zinc-500">Update Status:</span>
                      <div className="flex flex-wrap gap-2">
                         {['ready', 'shipped', 'delivered', 'cancelled'].map(opt => (
                           <button 
                             key={opt}
                             onClick={() => updateStatus(order.id, opt)}
                             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border transition-all capitalize
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
