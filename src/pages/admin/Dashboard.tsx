import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  ShoppingCart, 
  Package, 
  Users,
  Store,
  CheckCircle,
  XCircle,
  Clock,
  Image,
  TrendingUp,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

const chartData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
]

interface Stats {
  vendors: number
  orders: number
  products: number
  users: number
}

interface RecentOrder {
  id: string
  status: string
  total_price: string
  created_at: string
  profiles?: { full_name: string }
  vendors?: { name: string }
}

interface RecentProduct {
  id: string
  name: string
  price: number
  image_url: string
  vendors?: { name: string }[]
}

interface RecentCategory {
  id: number
  name: string
  image_url: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ vendors: 0, orders: 0, products: 0, users: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])
  const [recentCategories, setRecentCategories] = useState<RecentCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function loadData() {
      const [vendors, orders, products, users] = await Promise.all([
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ])
      
      setStats({
        vendors: vendors.count || 0,
        orders: orders.count || 0,
        products: products.count || 0,
        users: users.count || 0
      })

      const [ordersData, productsData, categoriesData] = await Promise.all([
        supabase.from('orders').select('*, profiles(full_name), vendors(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('id, name, price, image_url, vendors(name)').order('created_at', { ascending: false }).limit(6),
        supabase.from('categories').select('*').order('name').limit(6)
      ])
      
      setRecentOrders(ordersData.data || [])
      setRecentProducts(productsData.data || [])
      setRecentCategories(categoriesData.data || [])
      setLoading(false)
    }
    loadData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="size-4 text-green-500" />
      case 'cancelled': return <XCircle className="size-4 text-red-500" />
      case 'pending': 
      case 'pending_payment': return <Clock className="size-4 text-yellow-500" />
      default: return <Package className="size-4 text-zinc-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'pending':
      case 'pending_payment': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
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

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Real-time overview of the CheetahBuy platform.</p>
        </div>
        <div className="flex gap-3">
            <Link 
                to="/admin/vendors" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-bold shadow-xl shadow-zinc-900/10 hover:scale-[1.02] active:scale-95 transition-all"
            >
                Manage Vendors
                <ChevronRight className="size-4" />
            </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
            { label: 'Total Vendors', value: stats.vendors, icon: Store, color: 'orange', trend: '+12%' },
            { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'blue', trend: '+8%' },
            { label: 'Total Products', value: stats.products, icon: Package, color: 'emerald', trend: '+24%' },
            { label: 'Total Users', value: stats.users, icon: Users, color: 'purple', trend: '+15%' },
        ].map((stat, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-300"
            >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500`} />
                
                <div className="relative flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className={`p-3 bg-${stat.color}-500/10 rounded-2xl`}>
                            <stat.icon className={`size-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                            <TrendingUp className="size-3" />
                            {stat.trend}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{stat.label}</p>
                        <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1 leading-none">{stat.value.toLocaleString()}</h3>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sales Chart */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-black text-zinc-900 dark:text-white">Sales Analytics</h2>
                    <p className="text-xs text-zinc-400">Weekly platform performance</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-orange-500" />
                    <span className="text-xs font-bold text-zinc-500">Gross Sales</span>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB33" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#18181b', 
                                border: 'none', 
                                borderRadius: '16px',
                                color: '#fff'
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#f97316" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* Quick Actions / Categories */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-[32px] p-6 text-white shadow-xl shadow-orange-500/20">
                <h3 className="text-xl font-black mb-2">Category Overview</h3>
                <p className="text-white/80 text-sm mb-6">Manage and organize your platform catalog with ease.</p>
                <div className="grid grid-cols-3 gap-3">
                    {recentCategories.slice(0, 3).map(cat => (
                        <div key={cat.id} className="group relative aspect-square bg-white/20 rounded-2xl overflow-hidden hover:bg-white/30 transition-all cursor-pointer">
                            <img src={cat.image_url} className="w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                                <span className="text-[10px] font-black uppercase text-center">{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <Link to="/admin/categories" className="mt-6 flex items-center justify-center gap-2 py-3 bg-white text-orange-600 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all">
                    View All Categories
                    <ArrowUpRight className="size-4" />
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Recent Activities</h3>
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                <Package className="size-5 text-zinc-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold truncate">{order.profiles?.full_name}</p>
                                <p className="text-[10px] text-zinc-500">New order placed</p>
                            </div>
                            <div className="ml-auto text-[10px] font-bold text-orange-500">
                                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
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
              <div className="p-2 bg-orange-500/10 rounded-xl">
                  <TrendingUp className="size-5 text-orange-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">Recent Transactions</h2>
          </div>
          <Link to="/admin/orders" className="flex items-center gap-1 text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
            View Ledger
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/30">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Hash ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Entity / Customer</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Operational Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-zinc-400 uppercase tracking-widest text-right">Transaction Amnt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic">
                    No transaction history found in this sector.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                        <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">
                            {order.id.slice(0, 12).toUpperCase()}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{order.profiles?.full_name || 'Anonymous'}</span>
                            <span className="text-[10px] text-zinc-500">{order.vendors?.name || 'Cheetah Logistics'}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)} border border-current opacity-80 shadow-sm`}>
                        {getStatusIcon(order.status)}
                        <span className="text-[10px] font-black uppercase tracking-tight">
                          {order.status?.replace('_', ' ') || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-zinc-900 dark:text-white">TSH {parseFloat(order.total_price || '0').toLocaleString()}</span>
                            <span className="text-[10px] text-zinc-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentOrders.length === 0 ? (
                <div className="px-6 py-12 text-center text-zinc-400 italic">No transaction history found.</div>
            ) : (
                recentOrders.map((order) => (
                    <div key={order.id} className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">
                                {order.id.slice(0, 12).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold">
                                {new Date(order.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{order.profiles?.full_name || 'Anonymous'}</span>
                            <span className="text-[10px] text-zinc-500">{order.vendors?.name || 'Cheetah Logistics'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base font-black text-zinc-900 dark:text-white">
                                TSH {parseFloat(order.total_price || '0').toLocaleString()}
                            </span>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)} border border-current opacity-80`}>
                                {getStatusIcon(order.status)}
                                <span className="text-[10px] font-black uppercase tracking-tight">
                                    {order.status?.replace('_', ' ') || 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </motion.div>
    </div>
  )
}