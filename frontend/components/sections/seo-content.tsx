"use client";

import React from "react";
import Link from "next/link";
import { FaPhoneAlt, FaWhatsapp, FaArrowRight } from "react-icons/fa";

const keywords = [
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
  "NMC Approved Universities",
  "NEET Counseling",
];

export default function SEOContentSection() {
  return (
    <section className="py-10 sm:py-14 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Title */}
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-black text-[#0c2e60] tracking-wide uppercase">
              MBBS Admission Guidance for Students Across India
            </h2>
            <div className="h-0.5 bg-[#3b82f6]/30 w-12 rounded" />
          </div>

          {/* Grid Content */}
          <div className="space-y-4 text-[11px] sm:text-xs font-semibold text-slate-500 leading-relaxed">
            <p>
              Admission Anytime provides professional guidance for students seeking MBBS admissions in India and abroad. Our experienced counselors assist with career counseling, college selection, documentation, admission procedures, visa guidance, and post-admission support. Whether you are planning to study in a government medical college, private institution, deemed university, or an internationally recognized medical university, we provide personalized guidance based on your academic profile and career aspirations.
            </p>
            <p>
              Our services are designed to help students and parents understand the admission process clearly so they can make informed decisions with confidence. We align our counsel with the latest National Medical Commission (NMC) guidelines and WHO listings to ensure credentials verification and license practice ease.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
