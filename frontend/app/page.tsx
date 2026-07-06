import React from "react";
import HeroSection from "@/components/sections/hero";
import StatsSection from "@/components/sections/stats";
import ChooseUsSection from "@/components/sections/choose-us";
import StudyIndiaSection from "@/components/sections/study-india";
import StudyAbroadSection from "@/components/sections/study-abroad";
import PopularUniversities from "@/components/sections/popular-universities";
import AdmissionProcessSection from "@/components/sections/admission-process";
import ServicesSection from "@/components/sections/services";
import TestimonialsSection from "@/components/sections/testimonials";
import CTASection from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ChooseUsSection />
      <StudyIndiaSection />
      <StudyAbroadSection />
      <PopularUniversities />
      <AdmissionProcessSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
