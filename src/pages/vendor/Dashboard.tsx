import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  ShoppingBag, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Image as ImageIcon
} from 'lucide-react'

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
        
        // Get unique customers (defensive check)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <XCircle className="size-16 mx-auto mb-4 text-red-500 opacity-50" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{error}</h2>
        <Link to="/vendor/register" className="inline-block mt-4 text-orange-500 font-bold hover:underline">Register your shop →</Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 rounded-2xl dark:bg-orange-900/20">
              <ShoppingBag className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Products</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.products}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-2xl dark:bg-blue-900/20">
              <ShoppingCart className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Orders</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.orders}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-2xl dark:bg-emerald-900/20">
              <DollarSign className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Revenue</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">TSH {(stats.revenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 rounded-2xl dark:bg-purple-900/20">
              <TrendingUp className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Customers</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.customers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link 
          to="/vendor/products" 
          className="px-5 py-2.5 bg-orange-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Manage Products
        </Link>
        <Link 
          to="/vendor/orders" 
          className="px-5 py-2.5 bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl text-sm font-bold shadow-sm hover:bg-zinc-50 transition-all"
        >
          View All Orders
        </Link>
      </div>

      {/* My Products */}
      <div className="bg-white rounded-xl border shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">My Products</h2>
          <Link to="/vendor/products" className="text-sm text-orange-500 hover:text-orange-600">
            View All
          </Link>
        </div>
        <div className="p-6">
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="size-12 mx-auto mb-2 opacity-50" />
              <p>No products yet. Add your first product!</p>
              <Link to="/vendor/products" className="text-orange-500 hover:text-orange-600 text-sm">Add Product →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {products.map(product => (
                <Link key={product.id} to="/vendor/products" className="group">
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden mb-2 relative">
                    {product.image_url ? (
                      <>
                        {imageLoading[product.id] !== false && (
                          <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse z-10" />
                        )}
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onLoad={() => setImageLoading(prev => ({ ...prev, [product.id]: false }))}
                          onError={() => setImageLoading(prev => ({ ...prev, [product.id]: false }))}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <ImageIcon className="size-8" />
                      </div>
                    )}
                    {!product.is_available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs">Unavailable</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-sm text-orange-500 font-bold">TSH {parseFloat(product.price?.toString() || '0').toLocaleString()}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Orders</h2>
          <Link to="/vendor/orders" className="text-sm text-orange-500 hover:text-orange-600">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No orders yet. Start selling to see orders here!
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-sm font-mono text-zinc-900 dark:text-white">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm capitalize text-zinc-600 dark:text-zinc-400">
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-white">
                      TSH {parseFloat(order.total_amount?.toString() || '0').toLocaleString()}
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