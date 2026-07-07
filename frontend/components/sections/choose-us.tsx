"use client";

import React from "react";
import {
  FaUserTie,
  FaEye,
  FaUniversity,
  FaFileAlt,
  FaPassport,
  FaUserShield,
} from "react-icons/fa";

const benefits = [
  { title: "Personalized\nCareer Counseling", icon: <FaUserTie /> },
  { title: "Transparent\nAdmission Process", icon: <FaEye /> },
  { title: "Access to\nTop Medical Colleges", icon: <FaUniversity /> },
  { title: "Complete\nDocumentation Assistance", icon: <FaFileAlt /> },
  { title: "Visa &\nTravel Support", icon: <FaPassport /> },
  { title: "Continued Support\nAfter Admission", icon: <FaUserShield /> },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">

        {/* ─── Section Title ─── */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider text-center">
            WHY CHOOSE ADMISSION ANYTIME?
          </h2>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* ─── Benefits Grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 min-h-[120px] sm:min-h-[140px] group cursor-default"
            >
              <div className="text-[#0c2e60] text-3xl sm:text-4xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {b.icon}
              </div>
              <h3 className="text-[10px] sm:text-[11px] font-black text-[#0c2e60] leading-snug whitespace-pre-line tracking-wide">
                {b.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
