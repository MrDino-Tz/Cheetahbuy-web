import { HeroSection } from '../components/ui/hero-section-3'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Clock, MapPin, Smartphone, Truck, Pizza } from 'lucide-react'

const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}
        <section className="py-12 sm:py-24 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-4">Why Choose CheetahBuy?</h2>
              <p className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto">We've built the ultimate delivery network to serve you faster and better than anyone else.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { title: 'Lightning Fast', desc: 'Average delivery time of 15 minutes. We move like a cheetah.', icon: Zap, color: 'text-orange-500' },
                { title: 'Secure Payments', desc: 'Multiple payment options including Mobile Money and Credit Cards.', icon: ShieldCheck, color: 'text-blue-500' },
                { title: 'Live Tracking', desc: 'Track your order in real-time from the store to your door.', icon: MapPin, color: 'text-emerald-500' }
              ].map((feat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="p-8 sm:p-12 min-h-[300px] sm:min-h-[420px] flex flex-col rounded-[32px] sm:rounded-[48px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none"
                >
                  <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-50 dark:bg-zinc-800 w-fit mb-6 sm:mb-10`}>
                    <feat.icon className={`size-6 sm:size-8 ${feat.color}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3">{feat.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-12 sm:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white mb-6 leading-tight">Everything You Need, <br/><span className="text-orange-500">Just a Tap Away.</span></h2>
                <div className="space-y-6 sm:space-y-8">
                  {[
                    { title: 'Select Your Store', desc: 'Choose from thousands of local businesses and restaurants.', icon: Smartphone },
                    { title: 'Place Your Order', desc: 'Pick your items and pay securely using your preferred method.', icon: Clock },
                    { title: 'Rapid Delivery', desc: 'Our rider picks up and delivers to you in minutes.', icon: Truck }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 sm:gap-6">
                      <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-orange-500/20">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mb-1">{step.title}</h3>
                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full blur-[80px] sm:blur-[120px] opacity-10 animate-pulse" />
                <div className="relative h-[450px] sm:h-[600px] flex items-center justify-center scale-75 sm:scale-100">
                    {/* Card 1: Select Store (Back) */}
                    <motion.div 
                      animate={{ y: [0, -10, 0], rotate: [-6, -4, -6] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute z-10 -translate-x-16 sm:-translate-x-32 -translate-y-12 sm:-translate-y-16 p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] sm:rounded-[40px] shadow-xl w-60 sm:w-72 pointer-events-auto"
                    >
                        <div className="flex gap-4 items-center">
                            <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm"><Pizza className="size-5 sm:size-6 text-orange-500" /></div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-black dark:text-white">Cheetah Pizza</h4>
                                <div className="flex gap-1 mt-1">
                                    {[1,2,3,4,5].map(s => <div key={s} className="size-1 sm:size-1.5 bg-orange-400 rounded-full"/>)}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Payment (Middle) */}
                    <motion.div 
                      animate={{ y: [0, 10, 0], rotate: [2, 4, 2] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute z-20 translate-x-2 sm:translate-x-4 p-6 sm:p-8 bg-zinc-900 rounded-[32px] sm:rounded-[40px] shadow-2xl w-60 sm:w-72 border border-zinc-800 pointer-events-auto"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="size-8 sm:size-10 rounded-full bg-emerald-500 flex items-center justify-center text-white"><CheckCircle className="size-5 sm:size-6" /></div>
                            <span className="text-[10px] sm:text-xs font-bold text-white uppercase italic tracking-widest">Payment Secure</span>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                            <div className="h-1 w-16 sm:h-1.5 sm:w-24 bg-zinc-800 rounded-full" />
                            <div className="h-1 sm:h-1.5 w-full bg-zinc-800 rounded-full" />
                        </div>
                        <div className="mt-6 sm:mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-zinc-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                            <span>Total</span>
                            <span className="text-white text-xs sm:text-sm">15,400 TZS</span>
                        </div>
                    </motion.div>

                    {/* Card 3: Delivery (Front) */}
                    <motion.div 
                      animate={{ y: [0, -15, 0], rotate: [-2, 0, -2] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute z-30 translate-x-12 sm:translate-x-24 translate-y-24 sm:translate-y-32 p-6 sm:p-8 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-[32px] sm:rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] w-60 sm:w-72 pointer-events-auto"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20"><Truck className="size-5 sm:size-6" /></div>
                            <div className="flex flex-col">
                                <span className="text-[9px] sm:text-[10px] font-black text-orange-500 uppercase italic">On Its Way</span>
                                <span className="text-lg sm:text-xl font-black dark:text-white tracking-tighter italic">15 Mins</span>
                            </div>
                        </div>
                        <div className="h-1.5 sm:h-2 w-full bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <motion.div animate={{ width: '85%' }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-orange-500" />
                        </div>
                    </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}