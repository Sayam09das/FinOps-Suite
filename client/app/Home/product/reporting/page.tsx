import ReportingHero from "./sections/ReportingHero";
import ReportingCharts from "./sections/ReportingCharts";

export default function ReportingPage() {
  return (
    <main className="space-y-16 py-16">
      <ReportingHero />
      <ReportingCharts />
    </main>
  );
}
