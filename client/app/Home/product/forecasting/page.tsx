import ForecastingHero from "./sections/ForecastingHero";
import ForecastingAI from "./sections/ForecastingAI";

export default function ForecastingPage() {
  return (
    <main className="space-y-16 py-16">
      <ForecastingHero />
      <ForecastingAI />
    </main>
  );
}
