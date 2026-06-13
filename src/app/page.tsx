import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import IntegrationTicker from '../components/IntegrationTicker'
import ProblemSection from '../components/ProblemSection'
import AboutSection from '../components/AboutSection'
import SolutionSection from '../components/SolutionSection'
import HowItWorksSection from '../components/HowItWorksSection'
import FeaturesSection from '../components/FeaturesSection'
import CaseStudiesSection from '../components/CaseStudiesSection'
import SocialProofSection from '../components/SocialProofSection'
import PricingSection from '../components/PricingSection'
import FAQSection from '../components/FAQSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main>
      {/* Navbar sits on top of the hero */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Navbar />
      </div>
      <HeroSection />
      <IntegrationTicker />
      <ProblemSection />
      <AboutSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CaseStudiesSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
