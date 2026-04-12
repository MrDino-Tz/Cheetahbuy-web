import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Download from './pages/Download'
import VendorLayout from './pages/vendor/Layout'
import VendorDashboard from './pages/vendor/Dashboard'
import VendorOrders from './pages/vendor/Orders'
import VendorProducts from './pages/vendor/Products'
import VendorAnalytics from './pages/vendor/Analytics'
import AdminLayout from './pages/admin/Layout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminCategories from './pages/admin/Categories'
import AdminPromos from './pages/admin/Promos'
import AdminCustomers from './pages/admin/Customers'
import AdminOrders from './pages/admin/Orders'
import AdminAnalytics from './pages/admin/Analytics'
import AdminVendors from './pages/admin/Vendors'
import AdminSettings from './pages/admin/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<Download />} />

        {/* Vendor routes - login/register for vendors */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="promos" element={<AdminPromos />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Vendor Login/Register - public but redirects if already logged in */}
        <Route path="/vendor/login" element={<VendorLoginRedirect />} />
        <Route path="/vendor/register" element={<VendorRegisterRedirect />} />
        <Route path="/admin/login" element={<AdminLoginRedirect />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

function VendorLoginRedirect() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'VENDOR') {
          navigate('/vendor')
        } else if (profile?.role === 'ADMIN') {
          navigate('/admin')
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [navigate])

  if (loading) return <div className="p-8">Loading...</div>
  return <VendorLogin />
}

function VendorRegisterRedirect() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'VENDOR') {
          navigate('/vendor')
        } else if (profile?.role === 'ADMIN') {
          navigate('/admin')
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [navigate])

  if (loading) return <div className="p-8">Loading...</div>
  return <VendorRegister />
}

function AdminLoginRedirect() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'ADMIN') {
          navigate('/admin')
        } else if (profile?.role === 'VENDOR') {
          navigate('/vendor')
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [navigate])

  if (loading) return <div className="p-8">Loading...</div>
  return <AdminLogin />
}

// Simple vendor login form
function VendorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else if (data.user) {
      const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      
      if (profileError) {
        alert('Profile not found. Please register as a vendor first.')
        await supabase.auth.signOut()
      } else if (profile?.role === 'VENDOR') {
        navigate('/vendor')
      } else if (profile?.role === 'ADMIN') {
        navigate('/admin')
      } else {
        alert('Not a vendor account. Your role is: ' + (profile?.role || 'unknown'))
        await supabase.auth.signOut()
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <span className="text-white text-3xl font-bold">🦁</span>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Vendor Login</h2>
          <p className="text-zinc-500 font-medium">Manage your digital storefront.</p>
        </div>
        <div className="space-y-2">
           <label className="text-sm font-bold text-zinc-600 block pl-1">Email Address</label>
           <input type="email" placeholder="shop@cheetahbuy.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" required />
        </div>
        <div className="space-y-2">
           <label className="text-sm font-bold text-zinc-600 block pl-1">Secure Password</label>
           <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white p-4 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
        <p className="mt-8 text-center text-zinc-500 font-medium">
          Don't have a shop? <Link to="/vendor/register" className="text-orange-500 font-bold hover:underline">Register as Vendor</Link>
        </p>
      </form>
    </div>
  )
}

// Simple vendor register form
function VendorRegister() {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', shop_name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.full_name, role: 'VENDOR' } }
    })
    if (error) {
      alert(error.message)
    } else if (data.user) {
      // Wait a moment for auth to process
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create profile record with role VENDOR
      const { error: profileError } = await supabase.from('profiles').upsert([{ 
        id: data.user.id, 
        full_name: formData.full_name,
        phone: formData.phone || null,
        role: 'VENDOR'
      }], { onConflict: 'id' })
      
      if (profileError) {
        console.error('Profile error:', profileError)
      }
      
      // Create vendor record
      const { error: vendorError } = await supabase.from('vendors').insert([{ 
        owner_id: data.user.id, 
        name: formData.shop_name,
        phone: formData.phone || null
      }])
      
      if (vendorError) {
        console.error('Vendor error:', vendorError)
      }
      
      alert('Registration successful! Please check your email to verify, then login.')
      navigate('/vendor/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Become a Vendor</h2>
        <input type="text" placeholder="Full Name" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-3 border rounded-lg mb-4" required />
        <input type="text" placeholder="Shop Name" value={formData.shop_name} onChange={e => setFormData({...formData, shop_name: e.target.value})} className="w-full p-3 border rounded-lg mb-4" required />
        <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-lg mb-4" />
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-lg mb-4" required />
        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 border rounded-lg mb-4" required />
        <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white p-3 rounded-lg font-medium hover:bg-orange-600">
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p className="mt-4 text-center text-zinc-600">
          Already have an account? <Link to="/vendor/login" className="text-orange-500">Login</Link>
        </p>
      </form>
    </div>
  )
}

// Simple admin login form
function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role === 'ADMIN') {
        navigate('/admin')
      } else {
        alert('Not an admin account')
        await supabase.auth.signOut()
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-lg mb-4" required />
        <button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white p-3 rounded-lg font-medium hover:bg-zinc-800">
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  )
}