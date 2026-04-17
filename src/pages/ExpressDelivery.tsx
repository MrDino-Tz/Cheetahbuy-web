import { useState, useEffect } from 'react'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { Zap, Truck, Package, Clock, ShieldCheck } from 'lucide-react'
import { PageSkeleton } from '../components/ui/skeleton'

export default function ExpressDelivery() {
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
        <div className="pt-32 pb-20 bg-zinc-900 text-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 bg-orange-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <Zap className="size-4" />
                        <span>Fastest Choice</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight italic">Anything Delivered, <br/><span className="text-orange-500">In 15 Minutes.</span></h1>
                    <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                        Need it now? Our Express Delivery handles everything from single items to urgent documents with lightning speed.
                    </p>
                    <button className="bg-white text-zinc-900 px-10 py-5 rounded-[24px] font-black text-xl hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95">
                        Book Express Now
                    </button>
                </motion.div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[60%] h-full opacity-5 pointer-events-none">
                <Truck className="size-full -rotate-12 translate-x-20" />
            </div>
        </div>

        {/* Stats */}
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
                {[
                    { label: 'Avg Speed', value: '15 min', icon: Zap },
                    { label: 'Riders Active', value: '5k+', icon: Truck },
                    { label: 'Orders Delivered', value: '1M+', icon: Package },
                    { label: 'Delivery Rating', value: '4.9/5', icon: ShieldCheck }
                ].map((stat, i) => (
                    <div key={i} className="p-10 rounded-[48px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center">
                        <stat.icon className="size-8 text-orange-500 mb-6" />
                        <span className="text-4xl font-black text-zinc-900 dark:text-white mb-2 tracking-tighter italic">{stat.value}</span>
                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
