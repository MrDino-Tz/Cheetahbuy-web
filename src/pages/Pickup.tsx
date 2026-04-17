import { useState, useEffect } from 'react'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { PageSkeleton } from '../components/ui/skeleton'
import { 
    ShoppingBasket as Bag,
    MapPin as Pin,
    Clock as Time,
    CheckCircle as Check,
    Search as SearchIcon
} from 'lucide-react'

export default function Pickup() {
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
        <div className="pt-32 pb-20 bg-blue-600 text-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <Pin className="size-4" />
                        <span>Order & Collect</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Order Ahead, <br/><span className="text-blue-200">Skip the Queue.</span></h1>
                    <p className="text-xl text-blue-50 opacity-90 mb-10 leading-relaxed">
                        Why wait? Browse local stores, place your order, and pick it up yourself when it's ready. Save on delivery fees!
                    </p>
                    <div className="max-w-md relative">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-blue-600" />
                        <input type="text" placeholder="Search for nearby pickup points..." className="w-full bg-white rounded-3xl pl-14 pr-6 py-5 text-lg text-zinc-900 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-xl" />
                    </div>
                </motion.div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[50%] h-full opacity-10 pointer-events-none">
                <Pin className="size-full scale-110 translate-x-10" />
            </div>
        </div>

        {/* Steps */}
        <section className="py-24 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-16 text-center italic uppercase">How Pickup Works</h2>
            <div className="grid md:grid-cols-3 gap-16">
                {[
                    { title: 'Order in App', desc: 'Select "Pickup" at checkout and choose your preferred time.', icon: Bag },
                    { title: 'Wait for Alert', desc: 'We will notify you the exact moment your order is ready for collection.', icon: Time },
                    { title: 'Grab & Go', desc: 'Skip the line, show your digital receipt, and take your items.', icon: Check }
                ].map((step, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center">
                        <div className="size-20 rounded-[32px] bg-blue-50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 flex items-center justify-center text-blue-600 mb-8 shadow-sm">
                            <step.icon className="size-10" />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 italic uppercase tracking-tighter">{step.title}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">{step.desc}</p>
                        {i < 2 && (
                            <div className="hidden lg:block absolute top-10 left-[70%] w-full h-[2px] bg-zinc-100 dark:bg-zinc-900" />
                        )}
                    </div>
                ))}
            </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
