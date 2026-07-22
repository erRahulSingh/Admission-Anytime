import React from "react";
import { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";

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
  return <HomePageContent />;
}
