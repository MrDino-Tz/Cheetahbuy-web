import { useState, useEffect } from 'react'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { Pizza, Star, Clock, MapPin, Search } from 'lucide-react'
import { PageSkeleton } from '../components/ui/skeleton'

export default function FoodDelivery() {
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
        <div className="pt-32 pb-20 bg-orange-500 text-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <Pizza className="size-4" />
                        <span>Hot & Fresh</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Food you love, <br/>delivered fast.</h1>
                    <p className="text-xl text-orange-50 opacity-90 mb-10 leading-relaxed">
                        Order from your favorite local restaurants and get your meal delivered to your doorstep in minutes.
                    </p>
                    <div className="max-w-md relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-orange-500" />
                        <input type="text" placeholder="Enter your delivery address..." className="w-full bg-white rounded-3xl pl-14 pr-6 py-5 text-lg text-zinc-900 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-xl" />
                    </div>
                </motion.div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[50%] h-full opacity-10 pointer-events-none">
                <Pizza className="size-full animate-spin-slow" />
            </div>
        </div>

        {/* Features */}
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
                {[
                    { title: 'Wide Selection', desc: 'Choose from hundreds of local restaurants and cuisines.', icon: Star },
                    { title: 'Rapid Delivery', desc: 'Our riders ensure your food arrives hot and fresh.', icon: Clock },
                    { title: 'Live Tracking', desc: 'Follow your food journey from kitchen to your door.', icon: MapPin }
                ].map((feat, i) => (
                    <div key={i} className="space-y-4">
                        <div className="size-14 rounded-2xl bg-orange-50 dark:bg-zinc-900 flex items-center justify-center text-orange-500 shadow-sm">
                            <feat.icon className="size-7" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white uppercase italic">{feat.title}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{feat.desc}</p>
                    </div>
                ))}
            </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
