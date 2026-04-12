import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Users, Clock, ShieldCheck, Search } from 'lucide-react'

interface Customer {
  id: string
  full_name: string
  phone: string
  role: string
  created_at: string
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCustomers() {
      // In Supabase, the public.profiles or public.users table contains the metadata
      // If we don't have a direct 'profiles' table with 'created_at', we fallback safely.
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('id', { ascending: false })
      
      if (data) setCustomers(data as Customer[])
      setLoading(false)
    }
    loadCustomers()
  }, [])

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-500" /> Platform Customers
        </h1>
        <p className="text-zinc-500">Monitor all shopper accounts registered on CheetahBuy.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl overflow-hidden">
        <div className="p-4 border-b dark:border-zinc-800">
           <div className="relative max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
             <input type="text" placeholder="Search customers..." className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs font-semibold uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                        {c.full_name ? c.full_name[0].toUpperCase() : 'C'}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{c.full_name || 'Anonymous'}</p>
                        <p className="text-xs text-zinc-500 font-mono">ID: {c.id.substring(0,8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {c.phone || 'No phone provided'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
