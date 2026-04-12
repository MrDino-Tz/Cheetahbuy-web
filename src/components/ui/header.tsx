'use client';
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from "../../lib/utils";

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
  { title: 'About Us', href: '#' },
  { title: 'Contact', href: '#' },
];

export function Header() {
  const [servicesOpen, setServicesOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">🦁</span>
            </div>
            <span className="text-xl font-bold text-zinc-900">CheetahBuy</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-orange-500 transition-colors"
              >
                {link.title}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-orange-500 transition-colors"
              >
                Services
                <ChevronDown className={cn("size-4 transition-transform", servicesOpen && "rotate-180")} />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl border shadow-xl p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="p-3 rounded-lg hover:bg-zinc-50 transition-colors"
                      >
                        <span className="block text-sm font-medium text-zinc-900">{item.title}</span>
                        <span className="block text-xs text-zinc-500">{item.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Auth Buttons - Download App CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/vendor/login"
              className="text-sm font-medium text-zinc-600 hover:text-orange-500 transition-colors"
            >
              Vendor Login
            </Link>
            <Link
              to="/download"
              className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Get App
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}