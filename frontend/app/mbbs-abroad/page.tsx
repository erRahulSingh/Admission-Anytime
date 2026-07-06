"use client";

import React from "react";
import StudyAbroadSection from "@/components/sections/study-abroad";
import { FaGraduationCap, FaPlaneDeparture, FaGlobeAmericas, FaClipboardCheck } from "react-icons/fa";

export default function MBBSAbroadListingPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Banner */}
      <div className="bg-[#0b1c2c] text-white py-16 px-4 border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto text-center space-y-4">
          <span className="text-secondary-500 font-extrabold uppercase text-xs tracking-widest flex items-center justify-center gap-1.5">
            <FaGlobeAmericas /> Globally Accredited Programs
          </span>
          <h1 className="text-3xl md:text-5xl font-black">
            Study MBBS Abroad (2026-27)
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
            Choose from NMC compliant medical universities in Georgia, Russia, Kazakhstan, Kyrgyzstan, Uzbekistan, and Nepal.
          </p>
        </div>
      </div>

      {/* Benefits Overview */}
      <div className="max-w-[1280px] mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "English Medium Lectures",
            description: "No local language barriers. Program curriculum and exams are conducted 100% in English.",
            icon: <FaGraduationCap />,
          },
          {
            title: "Affordable Budgets",
            description: "Tuition structures starting from ₹1.8 Lakhs/year. Subsidized government hostels.",
            icon: <FaPlaneDeparture />,
          },
          {
            title: "WHO & NMC Listed",
            description: "Fully compliant with the National Medical Commission (NMC) 54-month study rules.",
            icon: <FaClipboardCheck />,
          },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-premium border border-slate-100 shadow-lg shadow-slate-100/50 flex gap-4 items-start">
            <div className="w-11 h-11 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-text-dark mb-1">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Renders the full country card grid */}
      <StudyAbroadSection />
    </div>
  );
}
