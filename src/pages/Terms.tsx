import { Link } from 'react-router-dom'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'
import { motion } from 'framer-motion'
import { Scale, Gavel, AlertCircle, HelpCircle } from 'lucide-react'

export default function Terms() {
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
            <div className="flex items-center gap-3 text-blue-500 font-bold text-sm uppercase tracking-widest mb-4">
              <Scale className="size-5" />
              <span>Legal Guidelines</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter italic">Terms of Service</h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Last Updated: {lastUpdated}</p>
          </motion.div>

          <div className="space-y-12">
            <section className="relative p-10 rounded-[48px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-orange-500">
                    <Scale className="size-32" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center">
                        <Gavel className="size-4 text-zinc-500" />
                    </div>
                    1. Acceptance of Terms
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg relative z-10">
                    By accessing or using the CheetahBuy application or website, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                </p>
            </section>

            <section className="px-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <AlertCircle className="size-4 text-zinc-500" />
                </div>
                2. Use of Services
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-4">
                You must be at least 18 years old to use the Services. You agree to use the Services only for purposes that are permitted by these Terms and any applicable law, regulation, or generally accepted practices or guidelines in the relevant jurisdictions.
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 text-lg">
                <li>You are responsible for maintaining account confidentiality.</li>
                <li>You may not use the services for any illegal activities.</li>
                <li>Abuse of promotions or referral systems is strictly prohibited.</li>
              </ul>
            </section>

            <section className="px-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <HelpCircle className="size-4 text-zinc-500" />
                </div>
                3. Limitation of Liability
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                To the maximum extent permitted by law, CheetahBuy shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section className="px-6 pt-12 border-t dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                For more details regarding our policies, please visit our <Link to="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
