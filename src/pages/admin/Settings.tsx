import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Save, Settings, Shield, Bell, Globe, DollarSign, Wrench } from 'lucide-react'

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [config, setConfig] = useState({
    platform_name: 'CheetahBuy',
    support_email: 'support@cheetahbuy.com',
    currency: 'TSH',
    delivery_fee: 5000,
    tax_percentage: 15,
    maintenance_mode: false,
    auto_approve_vendors: false
  })

  // In a real app, we'd fetch this from a 'platform_config' table
  // For now we persist it in state to show the UI/UX flow.
  
  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-orange-500" /> Platform Configuration
        </h1>
        <p className="text-zinc-500">Fine-tune CheetahBuy's global operations and financial parameters.</p>
      </div>

      <div className="grid gap-6">
        
        {/* General Options */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-white font-bold border-b pb-4 dark:border-zinc-800">
            <Globe className="w-5 h-5 text-blue-500" /> General Branding
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Platform Name</label>
              <input 
                type="text" 
                value={config.platform_name}
                onChange={e => setConfig({...config, platform_name: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Support Email</label>
              <input 
                type="email" 
                value={config.support_email}
                onChange={e => setConfig({...config, support_email: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
              />
            </div>
          </div>
        </section>

        {/* Financial Settings */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-white font-bold border-b pb-4 dark:border-zinc-800">
            <DollarSign className="w-5 h-5 text-emerald-500" /> Global Economics
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Base Delivery Fee (TSH)</label>
              <input 
                type="number" 
                value={config.delivery_fee}
                onChange={e => setConfig({...config, delivery_fee: parseInt(e.target.value)})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">VAT / Tax (%)</label>
              <input 
                type="number" 
                value={config.tax_percentage}
                onChange={e => setConfig({...config, tax_percentage: parseInt(e.target.value)})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Universal Currency</label>
              <select className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium">
                <option>TZS (TSH)</option>
                <option>USD ($)</option>
                <option>KES (Ksh)</option>
              </select>
            </div>
          </div>
        </section>

        {/* System & Security */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-white font-bold border-b pb-4 dark:border-zinc-800">
            <Shield className="w-5 h-5 text-purple-500" /> System Integrity
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">Maintenance Mode</p>
                <p className="text-sm text-zinc-500 italic">Lock all customer apps for server upgrades.</p>
              </div>
              <button 
                onClick={() => setConfig({...config, maintenance_mode: !config.maintenance_mode})}
                className={`w-14 h-8 rounded-full transition-all relative ${config.maintenance_mode ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.maintenance_mode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">Auto-Approve Vendors</p>
                <p className="text-sm text-zinc-500 italic">Automatically verify store owners upon registration (High Risk).</p>
              </div>
              <button 
                onClick={() => setConfig({...config, auto_approve_vendors: !config.auto_approve_vendors})}
                className={`w-14 h-8 rounded-full transition-all relative ${config.auto_approve_vendors ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${config.auto_approve_vendors ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-end gap-4 pb-12">
        <button className="px-6 py-3 font-semibold text-zinc-500 hover:text-zinc-800 transition-colors">Discard</button>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
          ) : success ? (
             <>Saved Successfully!</>
          ) : (
             <><Save className="w-5 h-5" /> Save Changes</>
          )}
        </button>
      </div>
    </div>
  )
}
