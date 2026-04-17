import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  ArrowUpRight,
  Plus,
  ChevronRight
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

const revenueData = [
  { day: 'Mon', amount: 450000 },
  { day: 'Tue', amount: 320000 },
  { day: 'Wed', amount: 560000 },
  { day: 'Thu', amount: 280000 },
  { day: 'Fri', amount: 490000 },
  { day: 'Sat', amount: 720000 },
  { day: 'Sun', amount: 640000 },
]

interface Stats {
  products: number
  orders: number
  revenue: number
  customers: number
}

interface Order {
  id: string
  status: string
  total_amount: number
  created_at: string
}

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  is_available: boolean
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, revenue: 0, customers: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: vendor, error: vError } = await supabase
          .from('vendors')
          .select('id, name')
          .eq('owner_id', user.id)
          .single()

        if (vError || !vendor) {
          setError('No vendor profile found. Please register as a vendor.')
          setLoading(false)
          return
        }

        const [productsData, ordersData, productsList] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }).eq('vendor_id', vendor.id),
          supabase.from('orders').select('*').eq('vendor_id', vendor.id),
          supabase.from('products').select('id, name, price, image_url, is_available').eq('vendor_id', vendor.id).order('created_at', { ascending: false }).limit(6)
        ])

        const ordersListRaw = ordersData.data || []
        const revValue = ordersListRaw.reduce((sum, o) => sum + (parseFloat(o.total_amount?.toString() || '0')), 0)
        
        const customerIds = new Set(ordersListRaw.filter(o => o.customer_id).map(o => o.customer_id))
        
        setStats({ 
          products: productsData.count || 0, 
          orders: ordersListRaw.length, 
          revenue: revValue,
          customers: customerIds.size
        })
        setRecentOrders(ordersListRaw.slice(0, 5))
        setProducts(productsList.data || [])
      } catch (err) {
        console.error('Dashboard load error:', err)
        setError('Failed to load dashboard data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="size-4 text-green-500" />
      case 'cancelled': return <XCircle className="size-4 text-red-500" />
      case 'pending': 
      case 'processing': return <Clock className="size-4 text-yellow-500" />
      default: return <Package className="size-4 text-zinc-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'pending':
      case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
            <div className="size-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-orange-500">CB</span>
            </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-xl">
        <XCircle className="size-20 mx-auto mb-6 text-red-500 opacity-20" />
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{error}</h2>
        <p className="text-zinc-500 mb-8 max-w-sm mx-auto text-sm">You need a vendor profile to access this dashboard and start selling your products.</p>
        <Link 
            to="/vendor/register" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
        >
            Register Your Shop Now
            <ArrowUpRight className="size-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Business Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your shop operations and track performance.</p>
        </div>
        <div className="flex gap-3">
            <Link 
                to="/vendor/products" 
                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-bold shadow-xl shadow-zinc-900/10 hover:scale-[1.02] transition-all"
            >
                <Plus className="size-4" />
                Add Product
            </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
            { label: 'Products', value: stats.products, icon: ShoppingBag, color: 'orange' },
            { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'blue' },
            { label: 'T. Revenue', value: `TSH ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
            { label: 'Customers', value: stats.customers, icon: TrendingUp, color: 'purple' },
        ].map((stat, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
                <div className="relative flex flex-col gap-4">
                    <div className={`size-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                        <stat.icon className={`size-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{stat.label}</p>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1 break-words leading-tight">{stat.value}</h3>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Revenue Chart */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-black text-zinc-900 dark:text-white">Revenue Stream</h2>
                    <p className="text-xs text-zinc-400">Daily earnings report</p>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB33" />
                        <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            tickFormatter={(val) => `TSH ${val/1000}k`}
                        />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ 
                                backgroundColor: '#18181b', 
                                border: 'none', 
                                borderRadius: '16px',
                                color: '#fff'
                            }}
                        />
                        <Bar 
                            dataKey="amount" 
                            radius={[8, 8, 8, 8]}
                            barSize={32}
                        >
                            {revenueData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 5 ? '#f97316' : '#f9731633'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* Quick Review */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 text-white h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold">Recent Products</h3>
                    <Link to="/vendor/products" className="text-xs text-orange-500 font-bold hover:underline">See All</Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {products.slice(0, 4).map(product => (
                        <div key={product.id} className="group relative aspect-square bg-zinc-800 rounded-2xl overflow-hidden">
                            <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60" />
                            <div className="absolute inset-0 p-3 flex flex-col justify-end">
                                <p className="text-[10px] font-bold truncate">{product.name}</p>
                                <p className="text-[9px] text-orange-500 font-black">TSH {product.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-zinc-600 italic text-sm">No products listed.</div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                  <ShoppingCart className="size-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">Recent Orders</h2>
          </div>
          <Link to="/vendor/orders" className="text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            Fulfill Orders
            <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/30">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Order Reference</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Gross Total</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Processed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic">No historical data available.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                        <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500 uppercase">
                            #{order.id.slice(0, 8)}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)} border border-current opacity-80`}>
                        {getStatusIcon(order.status)}
                        <span className="text-[10px] font-black uppercase tracking-tight">
                          {order.status || 'Received'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-zinc-900 dark:text-white">
                        TSH {parseFloat(order.total_amount?.toString() || '0').toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}