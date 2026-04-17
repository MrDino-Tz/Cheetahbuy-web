import { useState, useEffect } from 'react'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { Search, Book, MessageSquare, LifeBuoy } from 'lucide-react'
import { PageSkeleton } from '../components/ui/skeleton'

export default function Help() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <div className="bg-white dark:bg-zinc-950 min-h-screen"><Header /><PageSkeleton /><div className="mt-40"><FooterSection /></div></div>

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">How can we <span className="text-orange-500 underline decoration-8 underline-offset-8">help</span> you?</h1>
            <div className="max-w-2xl mx-auto relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search for articles, guides..." 
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] pl-14 pr-6 py-5 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
                />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
                { title: 'Getting Started', icon: Book, items: ['Creating an account', 'First order guide', 'Payment methods'] },
                { title: 'Orders & Returns', icon: MessageSquare, items: ['Track your order', 'Cancelation policy', 'Refund process'] },
                { title: 'Technical Support', icon: LifeBuoy, items: ['App troubleshooting', 'Notification issues', 'Account security'] }
            ].map((box, i) => (
                <div key={i} className="p-8 rounded-[40px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none hover:scale-[1.02] transition-transform">
                    <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                        <box.icon className="size-6 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{box.title}</h3>
                    <ul className="space-y-3">
                        {box.items.map((item, j) => (
                            <li key={j} className="text-zinc-500 dark:text-zinc-400 hover:text-orange-500 cursor-pointer transition-colors text-sm font-medium">• {item}</li>
                        ))}
                    </ul>
                </div>
            ))}
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
