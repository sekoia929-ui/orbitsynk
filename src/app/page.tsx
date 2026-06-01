import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import IntegrationTicker from '@/components/IntegrationTicker'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesSection from '@/components/FeaturesSection'
import SocialProofSection from '@/components/SocialProofSection'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <IntegrationTicker />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
