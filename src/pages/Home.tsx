import { HeroSection } from '../components/ui/hero-section-3'
import { Header } from '../components/ui/header'
import FooterSection from '../components/ui/footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
      </main>
      <FooterSection />
    </div>
  )
}