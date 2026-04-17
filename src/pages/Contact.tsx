import { useState, useEffect } from 'react'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { PageSkeleton } from '../components/ui/skeleton'

export default function Contact() {
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1 className="text-5xl font-black text-zinc-900 dark:text-white mb-6 italic uppercase">Get in <span className="text-orange-500">Touch</span></h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-12 max-w-md">
                    Have a question or feedback? We'd love to hear from you. Our team is here to help 24/7.
                </p>

                <div className="space-y-8">
                    {[
                        { icon: Mail, title: 'Email Us', info: 'support@cheetahbuy.com' },
                        { icon: Phone, title: 'Call Us', info: '+255 123 456 789' },
                        { icon: MapPin, title: 'Visit Us', info: 'Dar es Salaam, Tanzania' }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-6 items-center group">
                            <div className="size-14 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                <item.icon className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{item.title}</h3>
                                <p className="text-xl font-bold text-zinc-900 dark:text-white">{item.info}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-10 rounded-[48px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800"
            >
                <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-500 ml-4">Full Name</label>
                            <input type="text" className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-500 ml-4">Email Address</label>
                            <input type="email" className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500" placeholder="john@example.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 ml-4">Subject</label>
                        <input type="text" className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500" placeholder="How can we help?" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-500 ml-4">Message</label>
                        <textarea rows={4} className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500" placeholder="Type your message here..."></textarea>
                    </div>
                    <button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-5 rounded-3xl hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all flex items-center justify-center gap-3 group">
                        <span>Send Message</span>
                        <Send className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </form>
            </motion.div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
