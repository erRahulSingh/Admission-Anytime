import React from "react";
import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "MBBS Admission 2026–27 in India & Abroad | Admission Anytime | Expert Medical Admission Guidance",
  description: "Planning MBBS Admission 2026–27? Admission Anytime provides expert guidance for MBBS admissions in India and abroad. Get personalized counseling, university selection assistance, documentation support, visa guidance, and complete admission assistance.",
  keywords: [
    "MBBS Admission 2026",
    "MBBS Admission in India",
    "MBBS Abroad",
    "Study MBBS Abroad",
    "Medical Admission Consultant",
    "MBBS Counseling",
    "MBBS Admission Guidance",
    "MBBS in Russia",
    "MBBS in Georgia",
    "MBBS in Kazakhstan",
    "MBBS in Uzbekistan",
    "MBBS in Nepal",
    "NMC Approved Medical Universities",
    "Medical College Admission",
    "NEET Counseling",
    "Study Medicine Abroad",
    "Best MBBS Consultant in India",
  ],
};

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
