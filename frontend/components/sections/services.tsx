"use client";

import React from "react";
import {
  FaUserTie,
  FaUniversity,
  FaCheckDouble,
  FaClipboardCheck,
  FaFilePdf,
  FaCoins,
  FaAward,
  FaCcVisa,
  FaPlane,
  FaCompass,
  FaUserShield,
} from "react-icons/fa";

const serviceList = [
  { title: "Career\nCounselling", icon: <FaUserTie />, bg: "bg-[#0c2e60]" },
  { title: "University\nSelection", icon: <FaUniversity />, bg: "bg-[#16a34a]" },
  { title: "Eligibility\nEvaluation", icon: <FaCheckDouble />, bg: "bg-[#0ea5e9]" },
  { title: "Application\nProcessing", icon: <FaClipboardCheck />, bg: "bg-[#7c3aed]" },
  { title: "Documentation\nSupport", icon: <FaFilePdf />, bg: "bg-[#f59e0b]" },
  { title: "Education Loan\nGuidance", icon: <FaCoins />, bg: "bg-[#16a34a]" },
  { title: "Scholarship\nAssistance", icon: <FaAward />, bg: "bg-[#ef4444]" },
  { title: "Visa\nSupport", icon: <FaCcVisa />, bg: "bg-[#7c3aed]" },
  { title: "Travel\nAssistance", icon: <FaPlane />, bg: "bg-[#14b8a6]" },
  { title: "Pre-Departure\nGuidance", icon: <FaCompass />, bg: "bg-[#0ea5e9]" },
  { title: "Post Admission\nSupport", icon: <FaUserShield />, bg: "bg-[#0c2e60]" },
];

export default function ServicesSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">

        {/* Title */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider text-center">
            OUR ADMISSION SERVICES
          </h2>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* Services Grid in bordered container */}
        <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-6 bg-slate-50/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3 sm:gap-4">
            {serviceList.map((s, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center text-center gap-3.5 hover:shadow-lg hover:border-slate-300 hover:scale-[1.04] hover:-translate-y-1 transition-all duration-300 min-h-[110px] sm:min-h-[135px] cursor-pointer group"
              >
                <div className="text-[#0c2e60] text-2xl sm:text-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {s.icon}
                </div>
                <h3 className="text-[9px] sm:text-[10px] font-black text-[#0c2e60] leading-tight whitespace-pre-line tracking-wide">
                  {s.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
