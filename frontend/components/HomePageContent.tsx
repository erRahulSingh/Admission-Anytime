"use client";

import React from "react";
import FormPopupWrapper from "@/components/FormPopupWrapper";
import HeroSection from "@/components/sections/hero";
import StatsSection from "@/components/sections/stats";
import ChooseUsSection from "@/components/sections/choose-us";
import CoursesSection from "@/components/sections/courses";
import StudyIndiaSection from "@/components/sections/study-india";
import StudyAbroadSection from "@/components/sections/study-abroad";
import PopularUniversities from "@/components/sections/popular-universities";
import AdmissionProcessSection from "@/components/sections/admission-process";
import ServicesSection from "@/components/sections/services";
import FAQSection from "@/components/sections/faq";
import TestimonialsSection from "@/components/sections/testimonials";
import CTASection from "@/components/sections/cta";
import TrustSection from "@/components/sections/trust";

export default function HomePageContent() {
  return (
    <FormPopupWrapper>
      <HeroSection />
      <StatsSection />
      <CoursesSection />
      <ServicesSection />
      <ChooseUsSection />
      <StudyIndiaSection />
      <StudyAbroadSection />
      <PopularUniversities />
      <AdmissionProcessSection />
      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </FormPopupWrapper>
  );
}
