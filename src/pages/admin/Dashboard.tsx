import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  ShoppingBag, 
  ShoppingCart, 
  Package, 
  Users,
  Store,
  CheckCircle,
  XCircle,
  Clock,
  Image
} from 'lucide-react'

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 rounded-2xl dark:bg-orange-900/20">
              <Store className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Vendors</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.vendors}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-2xl dark:bg-blue-900/20">
              <ShoppingCart className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Orders</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.orders}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-2xl dark:bg-green-900/20">
              <Package className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Products</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.products}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 rounded-2xl dark:bg-purple-900/20">
              <Users className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Users</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.users}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link 
          to="/admin/vendors" 
          className="px-5 py-2.5 bg-orange-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Manage Vendors
        </Link>
        <Link 
          to="/admin/categories" 
          className="px-5 py-2.5 bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl text-[13px] font-bold shadow-sm hover:bg-zinc-50 transition-all"
        >
          Manage Categories
        </Link>
      </div>

      {/* Recent Categories */}
      <div className="bg-white rounded-xl border shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Categories</h2>
          <Link to="/admin/categories" className="text-sm text-orange-500 hover:text-orange-600">
            Manage
          </Link>
        </div>
        <div className="p-6">
          {recentCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="size-12 mx-auto mb-2 opacity-50" />
              <p>No categories yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {recentCategories.map(cat => (
                <div key={cat.id} className="text-center">
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden mb-2 relative">
                    {cat.image_url ? (
                      <>
                        {imageLoading[`cat-${cat.id}`] !== false && (
                          <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse z-10" />
                        )}
                        <img 
                          src={cat.image_url} 
                          alt={cat.name} 
                          className="w-full h-full object-cover"
                          onLoad={() => setImageLoading(prev => ({ ...prev, [`cat-${cat.id}`]: false }))}
                          onError={() => setImageLoading(prev => ({ ...prev, [`cat-${cat.id}`]: false }))}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <Image className="size-8" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{cat.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl border shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Products</h2>
          <Link to="/admin/vendors" className="text-sm text-orange-500 hover:text-orange-600">
            View All
          </Link>
        </div>
        <div className="p-6">
          {recentProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="size-12 mx-auto mb-2 opacity-50" />
              <p>No products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {recentProducts.map(product => (
                <div key={product.id} className="text-center">
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden mb-2 relative">
                    {product.image_url ? (
                      <>
                        {imageLoading[`prod-${product.id}`] !== false && (
                          <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse z-10" />
                        )}
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          onLoad={() => setImageLoading(prev => ({ ...prev, [`prod-${product.id}`]: false }))}
                          onError={() => setImageLoading(prev => ({ ...prev, [`prod-${product.id}`]: false }))}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <Package className="size-8" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-sm text-orange-500 font-bold">TSH {parseFloat(product.price.toString()).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-orange-500 hover:text-orange-600">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-sm font-mono text-zinc-900 dark:text-white">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">
                      {order.profiles?.full_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">
                      {order.vendors?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-white">
                      TSH {parseFloat(order.total_price || '0').toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}