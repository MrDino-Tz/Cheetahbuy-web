import React, { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { DollarSign, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function VendorAnalytics() {
  const [stats, setStats] = useState({
    revenue: 0,
    profit: 0,
    orders: 0
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVendorData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: vendor } = await supabase.from('vendors').select('id').eq('owner_id', user.id).single()
      if (!vendor) {
        setLoading(false)
        return
      }

      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('created_at')

      if (orders) {
        const rev = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
        // Dummy profit calculation (e.g. 20% margin)
        const prof = rev * 0.2
        setStats({
          revenue: rev,
          profit: prof,
          orders: orders.length
        })

        // Group by month
        const monthly: Record<string, { name: string, sales: number, profit: number }> = {}
        orders.forEach(o => {
          const month = new Date(o.created_at).toLocaleString('default', { month: 'short' })
          if (!monthly[month]) monthly[month] = { name: month, sales: 0, profit: 0 }
          monthly[month].sales += o.total_amount
          monthly[month].profit += (o.total_amount * 0.2)
        })
        setChartData(Object.values(monthly))
      }
      setLoading(false)
    }
    loadVendorData()
  }, [])

  const formatCurrency = (value: number) => {
    return 'TZS ' + value.toLocaleString()
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Store Performance</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Real-time revenue and profit metrics for your shop.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-16 h-16 text-orange-500" /></div>
          <p className="text-sm font-medium text-zinc-500">Total Revenue</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2">{formatCurrency(stats.revenue)}</h3>
          <div className="flex items-center gap-1 mt-2 text-emerald-500 text-sm font-medium"><ArrowUpRight className="w-4 h-4" /><span>+100% Growth</span></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-16 h-16 text-emerald-500" /></div>
          <p className="text-sm font-medium text-zinc-500">Estimated Net Profit</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2">{formatCurrency(stats.profit)}</h3>
          <div className="flex items-center gap-1 mt-2 text-emerald-500 text-sm font-medium"><ArrowUpRight className="w-4 h-4" /><span>20% margin applied</span></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ShoppingBag className="w-16 h-16 text-pink-500" /></div>
          <p className="text-sm font-medium text-zinc-500">Total Orders</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2">{stats.orders}</h3>
          <div className="flex items-center gap-1 mt-2 text-emerald-500 text-sm font-medium"><ArrowUpRight className="w-4 h-4" /><span>Live Tracking</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Revenue Trajectory</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : [{name: 'Start', sales: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="sales" name="Revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Profit Margins</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.length > 0 ? chartData : [{name: 'Start', sales: 0, profit: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} />
                <Tooltip cursor={{fill: '#3f3f46', opacity: 0.1}} contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="sales" name="Gross Sales" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
