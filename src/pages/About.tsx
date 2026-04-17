import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { Target, Users, Zap, ShieldCheck } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight italic uppercase">
              The <span className="text-orange-500">Fastest</span> <br/>Way to Buy.
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              At CheetahBuy, we're not just a delivery company. We're a technology platform focused on connecting local businesses with their communities through speed and reliability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <div className="p-10 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <div className="size-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                <Target className="size-8 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                To empower local economies by providing the infrastructure needed for businesses of all sizes to reach their customers instantly.
              </p>
            </div>
            <div className="p-10 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <div className="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                <Users className="size-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Our Community</h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We support thousands of independent restaurants and shops across Tanzania, creating opportunities for riders and growth for vendors.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white text-center mb-12 uppercase tracking-tighter">Our Core Values</h2>
            {[
              { title: 'Speed is Everything', desc: 'In our world, minutes matter. We optimize every second of the logistics chain.', icon: Zap, color: 'text-orange-500' },
              { title: 'Reliability First', desc: 'Accuracy and safety are the foundation of our trust with customers.', icon: ShieldCheck, color: 'text-emerald-500' }
            ].map((val, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 ${val.color} flex-shrink-0`}>
                  <val.icon className="size-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{val.title}</h3>
                  <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
