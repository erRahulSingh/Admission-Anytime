"use client";

import React from "react";
import {
  FaShieldAlt,
  FaEyeSlash,
  FaFileAlt,
  FaPassport,
  FaHotel,
  FaPlaneArrival,
  FaBookReader,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";

const benefits = [
  { title: "Official\nAdmission", icon: <FaShieldAlt /> },
  { title: "No Hidden\nCharges", icon: <FaEyeSlash /> },
  { title: "Complete\nDocumentation", icon: <FaFileAlt /> },
  { title: "Visa\nAssistance", icon: <FaPassport /> },
  { title: "Hostel\nAssistance", icon: <FaHotel /> },
  { title: "Airport\nPickup", icon: <FaPlaneArrival /> },
  { title: "FMGE / NExT\nGuidance", icon: <FaBookReader /> },
  { title: "Education\nLoan", icon: <FaGlobe /> },
  { title: "Parents\nSupport", icon: <FaUsers /> },
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
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md hover:border-slate-300 transition-all duration-300 min-h-[110px] sm:min-h-[130px]"
            >
              <div className="text-[#0c2e60] text-3xl sm:text-4xl flex items-center justify-center">
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
