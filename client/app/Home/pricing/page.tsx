import FeatureComparison from "./FeatureComparison";
import PricingCards from "./PricingCards";
import PricingCTA from "./PricingCTA";
import PricingFAQ from "./PricingFAQ";
import PricingHero from "./PricingHero";
import WhyChoosePricing from "./WhyChoosePricing";

export default function PricingPage() {
  return (
    <main className="flex-1">
      <div className="page-shell">
        <PricingHero />
        <PricingCards />
        <FeatureComparison />
        <WhyChoosePricing />
        <PricingFAQ />
        <PricingCTA />
      </div>
    </main>
  );
}
