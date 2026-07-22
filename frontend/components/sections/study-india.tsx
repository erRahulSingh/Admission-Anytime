"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaGlobe } from "react-icons/fa";

type TabName = "GOVERNMENT\nCOLLEGES" | "PRIVATE\nCOLLEGES" | "DEEMED\nUNIVERSITIES" | "COUNSELLING\nGUIDANCE";

const tabs: TabName[] = [
  "GOVERNMENT\nCOLLEGES",
  "PRIVATE\nCOLLEGES",
  "DEEMED\nUNIVERSITIES",
  "COUNSELLING\nGUIDANCE",
];

const tabContents: Record<TabName, [string, string][]> = {
  "GOVERNMENT\nCOLLEGES": [
    ["AIIMS", "KGMU Lucknow"],
    ["BHU", "MAMC Delhi"],
    ["JIPMER", "AFMC Pune"],
    ["AMU", "CMC Vellore"],
    ["MMC Chennai", "& Many More"],
  ],
  "PRIVATE\nCOLLEGES": [
    ["KMC Manipal", "St. John's"],
    ["MS Ramaiah", "Hamdard Delhi"],
    ["DY Patil Pune", "PSG Coimbatore"],
    ["Kalinga", "JSS Mysore"],
    ["SRM Chennai", "& Many More"],
  ],
  "DEEMED\nUNIVERSITIES": [
    ["Amrita Kochi", "SRM Chennai"],
    ["Bharati Vidyapeeth", "MGM Mumbai"],
    ["GITAM Vizag", "DY Patil Mumbai"],
    ["Saveetha Chennai", "Kalinga"],
    ["Jawaharlal Nehru", "& Many More"],
  ],
  "COUNSELLING\nGUIDANCE": [
    ["AIQ Seat Allocation", "State Domicile"],
    ["Choice Filling", "Cut-off Predictor"],
    ["Document Verify", "Security Deposit"],
    ["Seat Surrender", "Stray Round"],
    ["Direct Callback", "& Many More"],
  ],
};

const countries = [
  {
    name: "GEORGIA",
    code: "ge",
    slug: "georgia",
    color: "border-t-red-500",
    bullets: ["25+ Universities", "Low Fees", "European Education", "WHO/NMC Approved"],
  },
  {
    name: "RUSSIA",
    code: "ru",
    slug: "russia",
    color: "border-t-blue-500",
    bullets: ["Top Government Universities", "WHO Approved", "English Medium", "Low Cost"],
  },
  {
    name: "KAZAKHSTAN",
    code: "kz",
    slug: "kazakhstan",
    color: "border-t-cyan-500",
    bullets: ["Affordable Fees", "WHO Approved", "Indian Food", "Modern Infrastructure"],
  },
  {
    name: "UZBEKISTAN",
    code: "uz",
    slug: "uzbekistan",
    color: "border-t-emerald-500",
    bullets: ["English Medium", "Government Universities", "High FMGE Results"],
  },
  {
    name: "KYRGYZSTAN",
    code: "kg",
    slug: "kyrgyzstan",
    color: "border-t-red-500",
    bullets: ["Affordable Fees", "NMC Approved", "Good Clinical Exposure"],
  },
  {
    name: "ARMENIA",
    code: "am",
    slug: "armenia",
    color: "border-t-orange-500",
    bullets: ["Top Quality Education", "NMC/WHO Approved", "Affordable Fees", "Safe Environment"],
  },
  {
    name: "PHILIPPINES",
    code: "ph",
    slug: "philippines",
    color: "border-t-yellow-500",
    bullets: ["US Education Pattern", "English Speaking Country", "High FMGE Pass Rate"],
  },
  {
    name: "EGYPT",
    code: "eg",
    slug: "egypt",
    color: "border-t-red-600",
    bullets: ["Top Government Universities", "WHO Listed", "Clinical Rotations", "Affordable Fees"],
  },
  {
    name: "NEPAL",
    code: "np",
    slug: "nepal",
    color: "border-t-blue-700",
    bullets: ["NMC Approved", "Indian Curriculum", "Near India"],
  },
  {
    name: "BANGLADESH",
    code: "bd",
    slug: "bangladesh",
    color: "border-t-emerald-600",
    bullets: ["Top Government Colleges", "NMC/WHO Approved", "Similar Syllabus", "Affordable Fees"],
  },
];

export default function StudyIndiaSection() {
  const [activeTab, setActiveTab] = useState<TabName>("GOVERNMENT\nCOLLEGES");

  return (
    <section className="py-10 sm:py-14 bg-slate-50 border-y border-slate-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* ═══════════════════════════════════
            LEFT: STUDY MBBS IN INDIA
            ═══════════════════════════════════ */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 sm:p-6 flex-1 flex flex-col">

            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                <img src="https://flagcdn.com/w80/in.png" alt="India Flag" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[16px] sm:text-[18px] font-black text-[#0c2e60] tracking-wide uppercase">
                STUDY MBBS IN INDIA
              </h3>
            </div>

            {/* 4 Header Categories (2x2 Grid) with college names 1-by-1 underneath each header */}
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                {/* Header 1: GOVT COLLEGES */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-2">
                  <h4 className="text-[10px] sm:text-[11px] font-black text-[#16a34a] uppercase tracking-wider border-b border-emerald-100 pb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-[#16a34a] rounded-full inline-block"></span>
                    GOVT COLLEGES
                  </h4>
                  <div className="space-y-1">
                    {["AIIMS", "BHU", "JIPMER", "AMU", "MMC Chennai", "KGMU Lucknow", "MAMC Delhi", "AFMC Pune", "CMC Vellore"].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-[#0c2e60]">
                        <FaCheckCircle className="text-[#16a34a] text-[10px] flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Header 2: PRIVATE COLLEGES */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-2">
                  <h4 className="text-[10px] sm:text-[11px] font-black text-[#0F4C81] uppercase tracking-wider border-b border-blue-100 pb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-[#0F4C81] rounded-full inline-block"></span>
                    PRIVATE COLLEGES
                  </h4>
                  <div className="space-y-1">
                    {["KMC Manipal", "St. John's", "MS Ramaiah", "Hamdard Delhi", "DY Patil Pune", "PSG Coimbatore", "Kalinga", "JSS Mysore"].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-[#0c2e60]">
                        <FaCheckCircle className="text-[#16a34a] text-[10px] flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Header 3: DEEMED UNIVERSITIES */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-2">
                  <h4 className="text-[10px] sm:text-[11px] font-black text-purple-700 uppercase tracking-wider border-b border-purple-100 pb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-purple-600 rounded-full inline-block"></span>
                    DEEMED UNIVERSITIES
                  </h4>
                  <div className="space-y-1">
                    {["Amrita Kochi", "SRM Chennai", "Bharati Vidyapeeth", "MGM Mumbai", "GITAM Vizag", "DY Patil Mumbai", "Saveetha"].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-[#0c2e60]">
                        <FaCheckCircle className="text-[#16a34a] text-[10px] flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Header 4: COUNSELLING GUIDANCE */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-2">
                  <h4 className="text-[10px] sm:text-[11px] font-black text-amber-600 uppercase tracking-wider border-b border-amber-100 pb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-amber-500 rounded-full inline-block"></span>
                    COUNSELLING GUIDANCE
                  </h4>
                  <div className="space-y-1">
                    {["AIQ Allocation", "State Domicile", "Choice Filling", "Cut-off Predictor", "Document Verify", "Security Deposit"].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-[#0c2e60]">
                        <FaCheckCircle className="text-[#16a34a] text-[10px] flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* College Image at BOTTOM of box */}
              <div className="w-full rounded-xl overflow-hidden border border-slate-200/80 shadow-md h-[130px] sm:h-[140px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group mt-auto">
                <img
                  src="/indian_medical_college.png"
                  alt="Medical College Building"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://uploads.onecompiler.io/43k3a6e7q/1783327566613/ChatGPT%20Image%20Jul%206,%202026,%2002_15_48%20PM.png";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <Link
            href="/mbbs-india"
            className="block text-center bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-3.5 text-[12px] sm:text-[13px] tracking-wider transition-colors"
          >
            EXPLORE INDIA ADMISSIONS
          </Link>
        </div>

        {/* ═══════════════════════════════════
            RIGHT: STUDY MBBS ABROAD
            ═══════════════════════════════════ */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sm:p-6">

          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#0c2e60] flex-shrink-0">
              <FaGlobe className="text-base" />
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-black text-[#0c2e60] tracking-wide uppercase">
              STUDY MBBS ABROAD
            </h3>
          </div>

          {/* Countries Grid — Unified 10 Countries in 1x2 Grid for Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {countries.map((c) => (
              <div key={c.slug} className={`bg-white border border-slate-100 ${c.color} border-t-[3px] rounded-xl p-3 sm:p-4 flex flex-col justify-between min-h-[160px] sm:min-h-[175px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                      <img src={`https://flagcdn.com/w80/${c.code}.png`} alt={`${c.name} Flag`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black text-[#0c2e60] tracking-wide">{c.name}</span>
                  </div>
                  <ul className="space-y-1">
                    {c.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-1 text-[9px] sm:text-[10px] font-semibold text-slate-600">
                        <span className="text-[#16a34a] mt-0.5">✔</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/mbbs-abroad/${c.slug}`} className="mt-2.5 block text-center bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-[10px] tracking-wider transition-colors">
                  View Universities
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

