"use client";

import React from "react";
import {
  FaBriefcaseMedical,
  FaCapsules,
  FaGraduationCap,
  FaBuilding,
  FaGlobe,
  FaUserNurse,
} from "react-icons/fa";

const programCategories = [
  {
    title: "Government Medical Colleges",
    subtitle: "Highly Competitive & Prestigious Seats",
    icon: <FaGraduationCap />,
    bg: "from-[#ef4444]/10 to-[#ef4444]/5",
    border: "border-red-100 hover:border-red-300",
    iconColor: "text-[#ef4444] bg-[#ef4444]/10",
    courses: ["AIIMS", "BHU", "JIPMER", "AMU", "MMC Chennai", "KGMU Lucknow", "State Colleges"],
  },
  {
    title: "Private & Deemed Universities",
    subtitle: "Premium Domestic Infrastructure",
    icon: <FaBuilding />,
    bg: "from-[#3b82f6]/10 to-[#3b82f6]/5",
    border: "border-blue-100 hover:border-blue-300",
    iconColor: "text-[#3b82f6] bg-[#3b82f6]/10",
    courses: ["Private Colleges", "Deemed Universities", "KMC Manipal", "SRM Chennai", "DY Patil", "Management Seats"],
  },
  {
    title: "MBBS Abroad Programs",
    subtitle: "NMC & WHO Approved International Seats",
    icon: <FaGlobe />,
    bg: "from-[#10b981]/10 to-[#10b981]/5",
    border: "border-emerald-100 hover:border-emerald-300",
    iconColor: "text-[#10b981] bg-[#10b981]/10",
    courses: ["English Medium", "Georgia", "Russia", "Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Egypt", "Armenia", "Philippines"],
  },
  {
    title: "Other Medical Degrees",
    subtitle: "Alternative Clinical Career Paths",
    icon: <FaBriefcaseMedical />,
    bg: "from-[#ec4899]/10 to-[#ec4899]/5",
    border: "border-pink-100 hover:border-pink-300",
    iconColor: "text-[#ec4899] bg-[#ec4899]/10",
    courses: ["BDS (Dental)", "BAMS (Ayurveda)", "BHMS (Homeopathy)", "BPT (Physiotherapy)"],
  },
  {
    title: "Nursing & Pharmacy",
    subtitle: "Critical Allied Healthcare Programs",
    icon: <FaCapsules />,
    bg: "from-[#f59e0b]/10 to-[#f59e0b]/5",
    border: "border-amber-100 hover:border-amber-300",
    iconColor: "text-[#f59e0b] bg-[#f59e0b]/10",
    courses: ["B.Sc Nursing", "M.Sc Nursing", "D.Pharm", "B.Pharm", "M.Pharm"],
  },
  {
    title: "Licensing & Academic Support",
    subtitle: "End-to-End Career Tracking",
    icon: <FaUserNurse />,
    bg: "from-[#8b5cf6]/10 to-[#8b5cf6]/5",
    border: "border-violet-100 hover:border-violet-300",
    iconColor: "text-[#8b5cf6] bg-[#8b5cf6]/10",
    courses: ["FMGE Screening Guidance", "NExT Exam Prep", "Internship Guidance", "Clinical Practicals"],
  },
];

export default function CoursesSection() {
  return (
    <section className="py-10 sm:py-14 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Title */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <div className="text-center">
            <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider">
              MEDICAL PROGRAMS WE HELP WITH
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Explore Popular Programs</p>
          </div>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {programCategories.map((cat, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${cat.bg} border ${cat.border} rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-[#0c2e60]/5 transition-all duration-300 transform hover:-translate-y-1.5 group`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-sm ${cat.iconColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#0c2e60] tracking-wide">
                      {cat.title}
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-400">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200/60 w-full" />

                {/* Pills List */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.courses.map((course, ci) => (
                    <span
                      key={ci}
                      className="bg-white/80 border border-slate-200/50 rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#0c2e60] shadow-sm tracking-wide hover:bg-[#3b82f6] hover:text-white hover:border-[#3b82f6] transition-all duration-200 cursor-default"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
