import ReconciliationHero from "./sections/ReconciliationHero";
import ReconciliationFlow from "./sections/ReconciliationFlow";
import ReconciliationCTA from "./sections/ReconciliationCTA";

export default function ReconciliationPage() {
  return (
    <main className="space-y-16 py-16">
      <ReconciliationHero />
      <ReconciliationFlow />
      <ReconciliationCTA />
    </main>
  );
}
