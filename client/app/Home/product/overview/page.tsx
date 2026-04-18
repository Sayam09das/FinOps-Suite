import OverviewHero from "./sections/OverviewHero";
import OverviewFeatures from "./sections/OverviewFeatures";
import OverviewCTA from "./sections/OverviewCTA";

export default function OverviewPage() {
  return (
    <main className="space-y-16 py-16">
      <OverviewHero />
      <OverviewFeatures />
      <OverviewCTA />
    </main>
  );
}
