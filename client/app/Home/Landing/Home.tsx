import Ctasection from "./Ctasection";
import Empowersection from "./Empowersection";
import Financialdashboard from "./Financialdashboard";
import Integratesection from "./Integratesection";
import Sendmoneysection from "./Sendmoneysection";
import TrustSection from "./TrustSection";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="page-shell">
        <TrustSection />
        <Financialdashboard />
        <Sendmoneysection />
        <Integratesection />
        <Empowersection />
        <Ctasection />
      </div>
    </main>
  );
}
