import CloseHero from "./sections/CloseHero";
import CloseWorkflow from "./sections/CloseWorkflow";

export default function ClosePage() {
  return (
    <main className="space-y-16 py-16">
      <CloseHero />
      <CloseWorkflow />
    </main>
  );
}
