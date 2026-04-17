import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Sun, Moon, Menu, X, ArrowRight, Home as HomeIcon, ShoppingBag, Info, Phone } from 'lucide-react';
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

const services = [
  { title: 'Food Delivery', description: 'Order from local restaurants', href: '#', icon: ShoppingBag },
  { title: 'Grocery Delivery', description: 'Fresh groceries delivered fast', href: '#', icon: ShoppingBag },
  { title: 'Express Delivery', description: 'Ultra-fast delivery', href: '#', icon: ShoppingBag },
  { title: 'Pharmacy', description: 'Medicines & health products', href: '#', icon: ShoppingBag },
];

const navLinks = [
  { title: 'Home', href: '/', icon: HomeIcon },
  { title: 'Become a Vendor', href: '/vendor/register', icon: ShoppingBag },
  { title: 'About Us', href: '/about', icon: Info },
  { title: 'Contact', href: '/contact', icon: Phone },
];

export function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => 
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const logoPath = `${import.meta.env.BASE_URL}cheetah12post.png`.replace(/\/+/g, '/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group relative z-50">
            <img 
              src={logoPath} 
              alt="CheetahBuy" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
              >
                {link.title}
              </Link>
            ))}

            <div className="relative">
              <button
                onMouseEnter={() => setServicesOpen(true)}
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
              >
                Services
                <ChevronDown className={cn("size-4 transition-transform duration-200", servicesOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseLeave={() => setServicesOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-2xl p-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {services.map((item) => (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="flex flex-col p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                        >
                          <span className="block text-sm font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">{item.title}</span>
                          <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.description}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 relative z-50">
            <button 
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-500 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all"
            >
                {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/vendor/login"
                className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/download"
                className="relative overflow-hidden group px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-2xl shadow-xl shadow-zinc-900/10 hover:shadow-orange-500/20 transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Get App</span>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu - Replicated Dashboard Style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                  <img src={logoPath} alt="CheetahBuy" className="w-10 h-10 object-contain" />
                  <span className="text-xl font-bold dark:text-white">CheetahBuy</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900">
                  <X className="size-5 dark:text-white" />
                </button>
              </div>

              <div className="p-4 space-y-8">
                <nav className="space-y-1">
                  <p className="px-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Main Navigation</p>
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.title}
                        to={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-sm font-bold text-zinc-900 dark:text-white border border-transparent hover:border-orange-500/20 transition-all"
                      >
                        <Icon className="size-5 text-orange-500" />
                        {link.title}
                      </Link>
                    );
                  })}
                </nav>

                <div className="space-y-2">
                  <p className="px-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Our Services</p>
                  <div className="grid gap-2">
                    {services.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50"
                      >
                        <div className="size-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <ShoppingBag className="size-4" />
                        </div>
                        <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t dark:border-zinc-800 space-y-4">
                  <Link
                    to="/vendor/login"
                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 font-bold text-zinc-900 dark:text-white text-sm"
                  >
                    Login to Store
                  </Link>
                  <Link
                    to="/download"
                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-orange-500 text-white font-black uppercase italic tracking-tighter shadow-lg shadow-orange-500/20 text-sm"
                  >
                    Download App
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}