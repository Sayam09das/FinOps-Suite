import LandingNavbar from './components/layout/LandingNavbar';
import CTASection from './Home/Landing/Ctasection';
import EmpowerSection from './Home/Landing/Empowersection';
import ExpenseHero from './Home/Landing/Expensehero';
import FinancialDashboard from './Home/Landing/Financialdashboard';
import HeroSection from './Home/Landing/Herosection';
import IntegrateSection from './Home/Landing/Integratesection';
import SendMoneySection from './Home/Landing/Sendmoneysection';
import TrustSection from './Home/Landing/TrustSection';
import LandingFooter from './components/layout/landingFooter';
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <TrustSection />
      <FinancialDashboard />
      <ExpenseHero />
      <SendMoneySection />
      <EmpowerSection />
      <IntegrateSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
