"use client";

import React from "react";
import {
  FaAward,
  FaHandshake,
  FaUserShield,
  FaGraduationCap,
  FaHeartbeat,
  FaUserTie,
  FaBuilding,
  FaBriefcaseMedical,
} from "react-icons/fa";

const trustFactors = [
  {
    title: "25+ Years Experience",
    desc: "Over two decades of expert education guidance and career mentoring.",
    icon: <FaAward />,
  },
  {
    title: "25,000+ Students Guided",
    desc: "Successfully counseled and guided thousands of medical candidates.",
    icon: <FaGraduationCap />,
  },
  {
    title: "Personalized Counseling",
    desc: "Candid recommendations tailored to your goals, budget, and NEET score.",
    icon: <FaUserTie />,
  },
  {
    title: "Transparent & Ethical",
    desc: "100% upfront fee declarations without unrealistic promises or hidden costs.",
    icon: <FaHandshake />,
  },
  {
    title: "End-to-End Assistance",
    desc: "From initial college profiling and documentation to pre-departure briefing.",
    icon: <FaUserShield />,
  },
  {
    title: "India & Abroad",
    desc: "Unbiased guidance for government/private seats in India and leading international targets.",
    icon: <FaBuilding />,
  },
  {
    title: "Student-First Philosophy",
    desc: "Dedicated support team remains active during and after your university joining.",
    icon: <FaHeartbeat />,
  },
  {
    title: "Academic Success Focus",
    desc: "Long-term mentoring guides with clinical exposure and FMGE/NExT resources.",
    icon: <FaBriefcaseMedical />,
  },
];

export default function TrustSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Title */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <div className="text-center">
            <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider">
              WHY YOU CAN TRUST ADMISSION ANYTIME
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Our EEAT Integrity & Standards</p>
          </div>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* Grid of Trust Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trustFactors.map((factor, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg hover:border-slate-350 hover:-translate-y-1 transition-all duration-300 group cursor-default"
            >
              <div className="text-[#0c2e60] text-3xl sm:text-4xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {factor.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-[#0c2e60] tracking-wide group-hover:text-[#3b82f6] transition-colors">
                  {factor.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed font-semibold">
                  {factor.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
