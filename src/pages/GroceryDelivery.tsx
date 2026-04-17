import { useState, useEffect } from 'react'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { ShoppingBasket, Leaf, Zap, ShieldCheck, Search } from 'lucide-react'
import { PageSkeleton } from '../components/ui/skeleton'

export default function GroceryDelivery() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <div className="bg-white dark:bg-zinc-950 min-h-screen"><Header /><PageSkeleton /><div className="mt-40"><FooterSection /></div></div>

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="pt-32 pb-20 bg-emerald-600 text-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <ShoppingBasket className="size-4" />
                        <span>Fresh Essentials</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight italic">Fresh Groceries, <br/>Instantly Delivered.</h1>
                    <p className="text-xl text-emerald-50 opacity-90 mb-10 leading-relaxed">
                        Skip the line. Get fresh produce, household essentials, and pantry staples delivered in under 30 minutes.
                    </p>
                    <div className="max-w-md relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-emerald-600" />
                        <input type="text" placeholder="Search for milk, eggs, bread..." className="w-full bg-white rounded-3xl pl-14 pr-6 py-5 text-lg text-zinc-900 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-xl" />
                    </div>
                </motion.div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[50%] h-full opacity-10 pointer-events-none">
                <Leaf className="size-full rotate-45" />
            </div>
        </div>

        {/* Categories */}
        <section className="py-24 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-12 uppercase">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { name: 'Fresh Produce', icon: Leaf, color: 'bg-emerald-500' },
                    { name: 'Dairy & Eggs', icon: Zap, color: 'bg-yellow-500' },
                    { name: 'Pantry Staples', icon: ShoppingBasket, color: 'bg-orange-500' },
                    { name: 'Household', icon: ShieldCheck, color: 'bg-blue-500' }
                ].map((cat, i) => (
                    <div key={i} className="group p-8 rounded-[48px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all cursor-pointer">
                        <div className={`size-16 rounded-3xl ${cat.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                            <cat.icon className="size-8" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{cat.name}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Browse 200+ items</p>
                    </div>
                ))}
            </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
