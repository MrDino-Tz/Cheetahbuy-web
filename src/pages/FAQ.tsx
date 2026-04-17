import { useState, useEffect } from 'react'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus } from 'lucide-react'
import { PageSkeleton } from '../components/ui/skeleton'

const faqs = [
    { q: 'How fast is the delivery?', a: 'Our average delivery time is 15-20 minutes depending on your location and the vendor processing time.' },
    { q: 'What payment methods do you accept?', a: 'We accept M-Pesa, Tigo-Pesa, Airtel Money, and all major Credit/Debit cards.' },
    { q: 'Can I track my order?', a: 'Yes! Once your order is confirmed, you can track your rider in real-time on our map interface.' },
    { q: 'How do I become a vendor?', a: 'You can sign up via our Vendor Registration page. We will review your application within 24 hours.' },
    { q: 'Is there a minimum order value?', a: 'Minimum order values vary by store. Most stores have a minimum of 5,000 TZS.' }
]

export default function FAQ() {
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <div className="bg-white dark:bg-zinc-950 min-h-screen"><Header /><PageSkeleton /><div className="mt-40"><FooterSection /></div></div>

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter italic">Common <span className="text-orange-500 underline decoration-4">Questions</span></h1>
            <p className="text-zinc-500 dark:text-zinc-400">Everything you need to know about the CheetahBuy experience.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`rounded-[32px] border transition-all duration-300 ${openIndex === i ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' : 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900'}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-8 py-7 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">{faq.q}</span>
                  <div className={`p-2 rounded-full transition-transform duration-300 ${openIndex === i ? 'bg-orange-500 text-white rotate-180' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                    <ChevronDown className="size-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-8 pb-8 text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
