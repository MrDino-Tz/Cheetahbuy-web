import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Layout.css'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const menuItems = isAdmin ? [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/vendors', label: 'Vendors', icon: '🏪' },
    { path: '/admin/categories', label: 'Categories', icon: '📁' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
  ] : [
    { path: '/vendor', label: 'Dashboard', icon: '📊' },
    { path: '/vendor/products', label: 'Products', icon: '🛍️' },
    { path: '/vendor/orders', label: 'Orders', icon: '📦' },
  ]

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="logo">{isAdmin ? 'Admin' : 'Vendor'}</h2>
        <nav>
          {menuItems.map(item => (
            <a 
              key={item.path} 
              href={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}