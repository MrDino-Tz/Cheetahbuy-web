import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Package,
  FolderTree,
  Image as ImageIcon,
  Sun,
  Moon,
  Bike,
  UserCog
} from 'lucide-react'

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/categories', label: 'Categories', icon: FolderTree },
  { path: '/admin/promos', label: 'Banner Promos', icon: ImageIcon },
  { path: '/admin/vendors', label: 'Vendors', icon: ShoppingBag },
  { path: '/admin/riders', label: 'Riders', icon: Bike },
  { path: '/admin/users', label: 'Users', icon: UserCog },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/orders', label: 'Orders', icon: Package },
  { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      return true
    } else {
      document.documentElement.classList.remove('dark')
      return false
    }
  })

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDark(true)
    }
  }

  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b dark:bg-zinc-900 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/cheetah12post.png" alt="CheetahBuy" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold text-zinc-900 dark:text-white">CheetahBuy Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 border dark:border-zinc-800 rounded-xl">
            {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-white border-r border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 z-40
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b dark:border-zinc-800">
          <Link to="/" className="flex items-center gap-2">
            <img src="/cheetah12post.png" alt="CheetahBuy" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-zinc-900 dark:text-white">CheetahBuy</span>
          </Link>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground">Admin Panel</p>
            <button onClick={toggleTheme} className="p-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all border dark:border-zinc-700 shadow-sm">
              {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13px] font-semibold transition-all
                  ${isActive 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'}
                `}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="size-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="lg:ml-60 min-h-screen pt-16 lg:pt-0 font-sans">
        <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}