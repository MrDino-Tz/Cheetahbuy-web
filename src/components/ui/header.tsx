import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sun, Moon } from 'lucide-react';
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

const services = [
  { title: 'Food Delivery', description: 'Order from local restaurants', href: '#' },
  { title: 'Grocery Delivery', description: 'Fresh groceries delivered fast', href: '#' },
  { title: 'Express Delivery', description: 'Ultra-fast delivery', href: '#' },
  { title: 'Pharmacy', description: 'Medicines & health products', href: '#' },
  { title: 'Flowers & Gifts', description: 'Send surprises to loved ones', href: '#' },
  { title: 'Pet Supplies', description: 'Everything your pet needs', href: '#' },
];

const navLinks = [
  { title: 'Home', href: '/' },
  { title: 'Become a Vendor', href: '/vendor/register' },
  { title: 'About Us', href: '/about' },
  { title: 'Contact', href: '/contact' },
];

export function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => 
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/cheetah_logo.webp" 
              alt="CheetahBuy" 
              className="w-10 h-10 object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Nav Links */}
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

            {/* Services Dropdown */}
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
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Theme Toggle */}
            <button 
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-500 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all"
                aria-label="Toggle theme"
            >
                {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>

            <div className="flex items-center gap-3">
              <Link
                to="/vendor/login"
                className="hidden sm:block text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
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
          </div>
        </div>
      </div>
    </header>
  );
}