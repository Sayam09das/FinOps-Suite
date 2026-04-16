import LandingNavbar from "@/app/components/layout/LandingNavbar";
import LandingFooter from "@/app/components/layout/landingFooter";
import AboutHero from "./AboutHero";
import OurStoryMission from "./OurStoryMission";
import WhatWeOffer from "./WhatWeOffer";
import WhyChooseUs from "./WhyChooseUs";
import TeamCreatorSection from "./TeamCreatorSection";
import CTA from "./CTA";

export default function AboutPage() {
  return (
    <>
      <LandingNavbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-5 pb-20">
        <AboutHero />
        <OurStoryMission />
        <WhatWeOffer />
        <WhyChooseUs />
        <TeamCreatorSection />
        <CTA />
      </div>
      <LandingFooter />
    </>
  );
}



