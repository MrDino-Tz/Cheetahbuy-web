import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ShieldCheck, Truck, Clock, Store } from 'lucide-react'

interface Vendor {
  id: string
  name: string
  phone: string
  created_at: string
  owner_id: string
  profiles?: { email: string, full_name: string }
}

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVendors() {
      // In Supabase, if we have foreign keys correctly set up:
      // We can select '*, profiles(email, full_name)'
      // If the FK is not set up perfectly, we fallback to just fetching vendors.
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setVendors(data as Vendor[])
      setLoading(false)
    }
    loadVendors()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Store className="w-6 h-6 text-orange-500" /> Registered Vendors
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">View and manage all approved store vendors across the platform.</p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-4">Shop Details</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Registration Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  
                  {/* Shop Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                        {vendor.name ? vendor.name.substring(0, 1).toUpperCase() : 'V'}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{vendor.name}</p>
                        <p className="text-xs text-zinc-500 font-mono">ID: {vendor.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {vendor.phone || 'No phone provided'}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Clock className="w-4 h-4" />
                      {new Date(vendor.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active
                    </div>
                  </td>

                </tr>
              ))}
              
              {vendors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    <Truck className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                    <p className="text-lg font-medium">No vendors registered yet</p>
                    <p className="text-sm">Wait for new owners to sign up via the platform.</p>
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
