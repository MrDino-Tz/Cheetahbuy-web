import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { Users, Store, ArrowUpRight, TrendingUp, DollarSign } from 'lucide-react'

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    transactions: 0,
    revenue: 0,
  })
  
  const [adoptionData, setAdoptionData] = useState<any[]>([])
  const [volumeData, setVolumeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      // 1. Fetch Basic Metrics
      const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: vCount } = await supabase.from('vendors').select('*', { count: 'exact', head: true })
      const { data: orders } = await supabase.from('orders').select('total_amount, created_at')
      
      const totalRev = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
      
      setStats({
        users: uCount || 0,
        vendors: vCount || 0,
        transactions: orders?.length || 0,
        revenue: totalRev
      })

      // 2. Prepare Adoption Velocity (Users & Vendors over time)
      const { data: pDates } = await supabase.from('profiles').select('created_at').order('created_at')
      const { data: vDates } = await supabase.from('vendors').select('created_at').order('created_at')
      
      // Group by month
      const months: Record<string, { name: string, users: number, stores: number }> = {}
      
      pDates?.forEach(p => {
        const month = new Date(p.created_at).toLocaleString('default', { month: 'short' })
        if (!months[month]) months[month] = { name: month, users: 0, stores: 0 }
        months[month].users++
      })
      
      vDates?.forEach(v => {
        const month = new Date(v.created_at).toLocaleString('default', { month: 'short' })
        if (!months[month]) months[month] = { name: month, users: 0, stores: 0 }
        months[month].stores++
      })

      // Cumulative Adoption
      let runningUsers = 0
      let runningStores = 0
      const adoption = Object.values(months).map(m => {
        runningUsers += m.users
        runningStores += m.stores
        return { ...m, users: runningUsers, stores: runningStores }
      })
      
      setAdoptionData(adoption)

      // 3. Prepare Transaction Volume (Revenue per period)
      // Group orders by day or week
      const volume: Record<string, { name: string, volume: number }> = {}
      orders?.forEach(o => {
        const date = new Date(o.created_at).toLocaleDateString(undefined, { weekday: 'short' })
        if (!volume[date]) volume[date] = { name: date, volume: 0 }
        volume[date].volume += (o.total_amount || 0)
      })
      
      setVolumeData(Object.values(volume))
      
      setLoading(false)
    }
    loadData()
  }, [])

  const formatCurrency = (value: number) => {
    return 'TSH ' + value.toLocaleString()
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Headquarters Real-Time Analytics</h1>
        <p className="text-zinc-500">Live platform telemetry powered by Supabase Engine.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16 text-blue-500" /></div>
          <p className="text-sm font-medium text-zinc-500">Total Users</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2">{stats.users}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Store className="w-16 h-16 text-purple-500" /></div>
          <p className="text-sm font-medium text-zinc-500">Registered Vendors</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2">{stats.vendors}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-16 h-16 text-emerald-500" /></div>
          <p className="text-sm font-medium text-zinc-500">Platform Transactions</p>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-2">{stats.transactions}</h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-16 h-16 text-orange-500" /></div>
          <p className="text-sm font-medium text-zinc-500">Total Capital Handled</p>
          <h3 className="text-2xl font-black text-orange-600 mt-2 block w-full truncate">TSH {stats.revenue.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Dynamic Graph 1 */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">User & Vendor Adoption Velocity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adoptionData.length > 0 ? adoptionData : [{name: 'Start', users: 0, stores: 0}]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorStores" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="#3f3f46" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} />
                <Tooltip contentStyle={{backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Legend />
                <Area type="monotone" name="Total Users" dataKey="users" stroke="#3b82f6" fill="url(#colorUsers)" strokeWidth={3} />
                <Area type="monotone" name="Vendor Stores" dataKey="stores" stroke="#a855f7" fill="url(#colorStores)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Dynamic Graph 2 */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Daily Transaction Volume</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData.length > 0 ? volumeData : [{name: 'None', volume: 0}]} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="#3f3f46" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa'}} tickFormatter={(v) => `${(v/1000)}k`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} formatter={(value) => formatCurrency(value as number)} contentStyle={{backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Bar dataKey="volume" name="Money Moved" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
