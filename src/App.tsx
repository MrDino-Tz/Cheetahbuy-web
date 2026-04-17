import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from './lib/supabase'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NetworkStatus } from './components/NetworkStatus'
import Home from './pages/Home'
import Download from './pages/Download'
import VendorLayout from './pages/vendor/Layout'
import VendorDashboard from './pages/vendor/Dashboard'
import VendorOrders from './pages/vendor/Orders'
import VendorProducts from './pages/vendor/Products'
import VendorAnalytics from './pages/vendor/Analytics'
import VendorSettings from './pages/vendor/Settings'
import AdminLayout from './pages/admin/Layout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminCategories from './pages/admin/Categories'
import AdminPromos from './pages/admin/Promos'
import AdminCustomers from './pages/admin/Customers'
import AdminOrders from './pages/admin/Orders'
import AdminAnalytics from './pages/admin/Analytics'
import AdminVendors from './pages/admin/Vendors'
import AdminSettings from './pages/admin/Settings'
import Riders from './pages/admin/Riders'
import Users from './pages/admin/Users'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Help from './pages/Help'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import FoodDelivery from './pages/FoodDelivery'
import GroceryDelivery from './pages/GroceryDelivery'
import ExpressDelivery from './pages/ExpressDelivery'
import Pickup from './pages/Pickup'

export default function App() {
  return (
    <BrowserRouter>
      <NetworkStatus />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<Download />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/food-delivery" element={<FoodDelivery />} />
        <Route path="/grocery-delivery" element={<GroceryDelivery />} />
        <Route path="/express-delivery" element={<ExpressDelivery />} />
        <Route path="/pickup" element={<Pickup />} />

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
          <Route path="settings" element={<VendorSettings />} />
          <Route path="riders" element={<Riders />} />
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
          <Route path="riders" element={<Riders />} />
          <Route path="users" element={<Users />} />
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
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const BRAND_ORANGE = "#F97316"
  const DARK_BG = "#0a0a0f"
  const CARD_BG = "#141419"
  const INPUT_BG = "#e8ecfd"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else if (data.user) {
      // Check profile role
      const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      
      if (profileError || !profile) {
        alert('Profile not found. Please register as a vendor first.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }
      
      // Check if user is admin
      if (profile?.role === 'ADMIN') {
        navigate('/admin')
        setLoading(false)
        return
      }
      
      // Check if user has vendor profile
      if (profile?.role !== 'VENDOR') {
        alert('Not a vendor account. Your role is: ' + (profile?.role || 'unknown'))
        await supabase.auth.signOut()
        setLoading(false)
        return
      }
      
      // Check if vendor record exists
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('owner_id', data.user.id)
        .single()
      
      if (vendorError || !vendor) {
        alert('Vendor profile not found. Please register as a vendor first.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }
      
      navigate('/vendor')
    }
    setLoading(false)
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: DARK_BG }}
    >
      {/* Auth Card */}
      <div 
        className="w-full max-w-lg rounded-[32px] sm:rounded-[48px] p-8 sm:p-12 border border-zinc-900 dark:border-zinc-800/50"
        style={{ backgroundColor: CARD_BG }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/cheetah12post.png" alt="CheetahBuy" className="w-12 h-12 object-contain" />
        </div>

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 sm:mb-3 tracking-tight">Vendor Login</h1>
          <p className="text-zinc-500 text-sm sm:text-base font-medium">Manage your digital storefront.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@haset.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-14 px-4 border-0 text-gray-900 placeholder:text-gray-500 rounded-xl text-base outline-none"
              style={{ backgroundColor: INPUT_BG }}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-14 px-4 pr-12 border-0 text-gray-900 placeholder:text-gray-500 rounded-xl text-base outline-none"
                style={{ backgroundColor: INPUT_BG }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl font-semibold text-lg mt-4 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "white", color: "#0a0a0f" }}
          >
            {loading ? (
              <div className="size-6 border-2 border-gray-400/30 border-t-gray-900 rounded-full animate-spin mx-auto" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-500 text-base mt-8">
          Don't have a shop?{' '}
          <Link to="/vendor/register" className="font-semibold hover:underline" style={{ color: BRAND_ORANGE }}>
            Register as Vendor
          </Link>
        </p>
      </div>
    </div>
  )
}

// Simple vendor register form
function VendorRegister() {
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', shop_name: '', phone: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const BRAND_ORANGE = "#F97316"
  const DARK_BG = "#0a0a0f"
  const CARD_BG = "#141419"
  const INPUT_BG = "#e8ecfd"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.full_name, role: 'VENDOR' } }
      })
      
      if (signUpError) {
        alert(signUpError.message)
        setLoading(false)
        return
      }
      
      if (signUpData.user) {
        // Create profile record
        const { error: profileError } = await supabase.from('profiles').upsert([{ 
          id: signUpData.user.id, 
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          role: 'VENDOR'
        }], { onConflict: 'id' })
        
        if (profileError) {
          console.error('Profile error:', profileError)
        }
        
        // Create vendor record
        const { error: vendorError } = await supabase.from('vendors').insert([{ 
          owner_id: signUpData.user.id, 
          name: formData.shop_name,
          phone: formData.phone || null
        }])
        
        if (vendorError) {
          console.error('Vendor error:', vendorError)
        }
        
        alert('Registration successful! Please check your email to verify, then login.')
        navigate('/vendor/login')
      } else if (signUpData.session === null) {
        // User needs to verify email
        alert('Registration successful! Please check your email to verify your account.')
        navigate('/vendor/login')
      }
    } catch (err) {
      console.error('Registration error:', err)
      alert('Registration failed. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: DARK_BG }}
    >
      {/* Auth Card */}
      <div 
        className="w-full max-w-xl rounded-[32px] sm:rounded-[48px] p-8 sm:p-12 border border-zinc-900 dark:border-zinc-800/50 shadow-2xl"
        style={{ backgroundColor: CARD_BG }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/cheetah12post.png" alt="CheetahBuy" className="w-12 h-12 object-contain" />
        </div>

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 sm:mb-3 tracking-tight">Become a Vendor</h1>
          <p className="text-zinc-500 text-sm sm:text-base font-medium">Join the fastest delivery network in the region.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name & Shop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">
                Full Identity
              </label>
              <input
                type="text"
                placeholder="CEO / Admin Name"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className="w-full h-14 px-5 bg-zinc-800 border-0 text-white placeholder:text-zinc-600 rounded-2xl text-base outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">
                Shop Designation
              </label>
              <input
                type="text"
                placeholder="Brand Name"
                value={formData.shop_name}
                onChange={e => setFormData({...formData, shop_name: e.target.value})}
                className="w-full h-14 px-5 bg-zinc-800 border-0 text-white placeholder:text-zinc-600 rounded-2xl text-base outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-orange-500"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+255 700 000 000"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full h-14 px-4 border-0 text-gray-900 placeholder:text-gray-500 rounded-xl text-base outline-none"
              style={{ backgroundColor: INPUT_BG }}
            />
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@haset.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full h-14 px-4 border-0 text-gray-900 placeholder:text-gray-500 rounded-xl text-base outline-none"
              style={{ backgroundColor: INPUT_BG }}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full h-14 px-4 pr-12 border-0 text-gray-900 placeholder:text-gray-500 rounded-xl text-base outline-none"
                style={{ backgroundColor: INPUT_BG }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl font-semibold text-lg mt-4 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "white", color: "#0a0a0f" }}
          >
            {loading ? (
              <div className="size-6 border-2 border-gray-400/30 border-t-gray-900 rounded-full animate-spin mx-auto" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-gray-500 text-base mt-8">
          Already have an account?{' '}
          <Link to="/vendor/login" className="font-semibold hover:underline" style={{ color: BRAND_ORANGE }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-20 relative overflow-hidden">
        {/* Dark Admin Background blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(#f9731611_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-900/50 dark:bg-white/5 rounded-full blur-[160px]" />

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md relative z-10"
        >
            <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[48px] border-4 border-zinc-900 dark:border-white shadow-[12px_12px_0px_0px_#18181b] dark:shadow-[12px_12px_0px_0px_#ffffff] space-y-6">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="size-16 rounded-3xl bg-zinc-900 dark:bg-white flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <span className="text-white dark:text-zinc-900 text-3xl font-bold">⚙️</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">Admin Portal</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold text-[9px] sm:text-xs uppercase tracking-[0.2em] mt-2">Security Clearance Required</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block pl-1">Credentials ID</label>
                        <input type="email" placeholder="admin@cheetahbuy.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl outline-none focus:border-zinc-900 dark:focus:border-white dark:text-white transition-all font-mono text-sm" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block pl-1">Security Key</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl outline-none focus:border-zinc-900 dark:focus:border-white dark:text-white transition-all font-mono text-sm" required />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white p-4 rounded-2xl font-black text-lg hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2 transition-all disabled:opacity-50">
                    {loading ? 'Decrypting...' : 'Access Terminal'}
                </button>
                
                <div className="text-center pt-4">
                    <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors">Return to Base</Link>
                </div>
            </form>
        </motion.div>
    </div>
  )
}