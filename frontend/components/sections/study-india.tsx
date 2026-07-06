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
    name: "NEPAL",
    code: "np",
    slug: "nepal",
    color: "border-t-blue-700",
    bullets: ["NMC Approved", "Indian Curriculum", "Near India"],
  },
  {
    name: "CHINA",
    code: "cn",
    slug: "china",
    color: "border-t-red-600",
    bullets: ["Top Medical Universities", "Modern Hospitals", "WHO Listed"],
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

            {/* Tabs */}
            <div className="grid grid-cols-4 border-b border-slate-100 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 text-[8px] sm:text-[9px] font-bold uppercase text-center leading-tight whitespace-pre-line transition-all outline-none ${activeTab === tab
                    ? "border-b-2 border-[#16a34a] text-[#16a34a] font-extrabold"
                    : "text-[#0c2e60] hover:text-[#0F4C81]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content: List + Image */}
            <div className="grid grid-cols-12 gap-3 flex-1">
              {/* Two-column college list */}
              <div className="col-span-7 space-y-2">
                {tabContents[activeTab].map(([col1, col2], idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-x-2">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#0c2e60]">
                      <FaCheckCircle className="text-[#16a34a] text-[11px] flex-shrink-0" />
                      <span className="truncate">{col1}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#0c2e60]">
                      <FaCheckCircle className="text-[#16a34a] text-[11px] flex-shrink-0" />
                      <span className="truncate">{col2}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* College Image — Replace COLLEGE_IMAGE_URL with your link, then change false to true */}
              <div className="col-span-5 rounded-xl overflow-hidden border border-slate-100 shadow-sm min-h-[140px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                {true ? (
                  <img src="https://uploads.onecompiler.io/43k3a6e7q/1783327566613/ChatGPT%20Image%20Jul%206,%202026,%2002_15_48%20PM.png" alt="College Building" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🏛️</span>
                )}
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

          {/* Countries Grid — top 3 big, bottom 4 smaller */}
          <div className="space-y-4">

            {/* Top Row: Georgia, Russia, Kazakhstan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {countries.slice(0, 3).map((c) => (
                <div key={c.slug} className={`bg-white border border-slate-100 ${c.color} border-t-[3px] rounded-xl p-4 flex flex-col justify-between min-h-[180px] hover:shadow-md transition-shadow`}>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                        <img src={`https://flagcdn.com/w80/${c.code}.png`} alt={`${c.name} Flag`} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-black text-[#0c2e60] tracking-wide">{c.name}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {c.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-600">
                          <span className="text-[#16a34a] mt-0.5">✔</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/mbbs-abroad/${c.slug}`} className="mt-3 block text-center bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-2 rounded-lg text-[9px] sm:text-[10px] tracking-wider transition-colors">
                    View Universities
                  </Link>
                </div>
              ))}
            </div>

            {/* Bottom Row: Uzbekistan, Kyrgyzstan, Nepal, China */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {countries.slice(3).map((c) => (
                <div key={c.slug} className={`bg-white border border-slate-100 ${c.color} border-t-[3px] rounded-xl p-3 sm:p-4 flex flex-col justify-between min-h-[160px] hover:shadow-md transition-shadow`}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5.5 h-5.5 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                        <img src={`https://flagcdn.com/w80/${c.code}.png`} alt={`${c.name} Flag`} className="w-full h-full object-cover" />
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
                  <Link href={`/mbbs-abroad/${c.slug}`} className="mt-2 block text-center bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-1.5 sm:py-2 rounded-lg text-[9px] tracking-wider transition-colors">
                    View Universities
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

