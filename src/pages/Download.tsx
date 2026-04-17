import { useState, useEffect } from 'react'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { Smartphone, Zap, ShieldCheck, Star, QrCode, ArrowRight } from 'lucide-react'
import { PageSkeleton } from '../components/ui/skeleton'

export default function DownloadPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <div className="bg-white dark:bg-zinc-950 min-h-screen"><Header /><PageSkeleton /><div className="mt-40"><FooterSection /></div></div>

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Left */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative z-10"
            >
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                    <Star className="size-4" />
                    <span>Rated 4.9/5 by 12k+ Users</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-zinc-900 dark:text-white mb-8 tracking-tighter leading-[0.9] italic uppercase italic">
                    Bring the <span className="text-orange-500">Speed</span> <br/>to Your Pocket.
                </h1>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-lg">
                    Experience the full power of CheetahBuy. Real-time tracking, exclusive in-app offers, and 15-minute delivery at your fingertips.
                </p>

                {/* App Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <button className="group relative flex items-center gap-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-5 rounded-[28px] hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl active:scale-95">
                        <div className="size-8 flex items-center justify-center">
                            <svg className="size-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold uppercase opacity-60">Available on</p>
                            <p className="text-lg font-black tracking-tighter italic uppercase">App Store</p>
                        </div>
                    </button>
                    <button className="group relative flex items-center gap-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white px-8 py-5 rounded-[28px] hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95">
                        <div className="size-8 flex items-center justify-center">
                            <svg className="size-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.609-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold uppercase opacity-60 dark:opacity-40">Get it on</p>
                            <p className="text-lg font-black tracking-tighter italic uppercase">Google Play</p>
                        </div>
                    </button>
                </div>

                {/* QR Section */}
                <div className="flex items-center gap-6 p-6 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 max-w-sm">
                    <div className="size-20 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
                        <QrCode className="size-full text-zinc-900" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1 uppercase italic">Scan to download</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">Point your camera to the QR code and get the app instantly.</p>
                    </div>
                </div>
            </motion.div>

            {/* Visual Right */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex justify-center lg:justify-end"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-orange-500/20 blur-[120px] rounded-full" />
                
                {/* Custom Phone Mock for Download Page */}
                <div className="relative w-[300px] h-[600px] bg-zinc-900 rounded-[3.5rem] p-3 border-4 border-zinc-800 shadow-2xl rotate-3">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-20" />
                    <div className="h-full w-full bg-zinc-950 rounded-[3rem] overflow-hidden relative">
                        {/* Mock App Interface */}
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500 to-orange-600 p-8 flex flex-col items-center justify-center text-center">
                            <div className="size-20 rounded-3xl bg-white shadow-2xl flex items-center justify-center mb-8">
                                <span className="text-3xl font-black text-orange-500 italic">CB</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 italic">CheetahBuy</h3>
                            <p className="text-white/80 text-sm mb-12">Fastest delivery in Africa</p>
                            
                            <div className="w-full space-y-3">
                                <div className="h-12 w-full bg-white/10 rounded-2xl animate-pulse" />
                                <div className="h-12 w-full bg-white/10 rounded-2xl animate-pulse" />
                                <div className="h-12 w-full bg-white/10 rounded-2xl animate-pulse shadow-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Phone Shadow */}
                <div className="absolute -z-10 w-[300px] h-[600px] bg-zinc-200 dark:bg-zinc-800 rounded-[3.5rem] translate-x-12 translate-y-12 blur-sm opacity-50" />
            </motion.div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}