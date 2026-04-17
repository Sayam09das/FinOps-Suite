import AboutHero from "./AboutHero";
import OurStoryMission from "./OurStoryMission";
import TeamCreatorSection from "./TeamCreatorSection";
import WhatWeOffer from "./WhatWeOffer";
import WhyChooseUs from "./WhyChooseUs";

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="page-shell">
        <AboutHero />
        <OurStoryMission />
        <WhatWeOffer />
        <WhyChooseUs />
        <TeamCreatorSection />
      </div>
    </main>
  );
}
