import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { FileText, Shield, Eye, Lock } from 'lucide-react'

export default function Privacy() {
  const lastUpdated = "April 17, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 text-orange-500 font-bold text-sm uppercase tracking-widest mb-4">
              <Shield className="size-5" />
              <span>Security First</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6">Privacy Policy</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Last Updated: {lastUpdated}</p>
          </motion.div>

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <FileText className="size-4 text-zinc-500" />
                </div>
                1. Information We Collect
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                We collect information you provide directly to us, such as when you create or modify your account, request delivery services, contact customer support, or otherwise communicate with us. This information may include name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Eye className="size-4 text-zinc-500" />
                </div>
                2. How We Use Your Information
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                We use the information we collect to provide, maintain, and improve our Services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, and more.
              </p>
            </section>

            <section className="p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center">
                    <Lock className="size-4 text-emerald-500" />
                </div>
                3. Data Security
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg italic">
                CheetahBuy uses industry-standard encryption and strict access controls to ensure your personal and payment data is protected across our entire fulfillment network.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">4. Contact Us</h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                If you have any questions about this Privacy Policy, please contact us at <span className="text-orange-500 font-bold underline">privacy@cheetahbuy.com</span>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
