"use client";

import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaGraduationCap } from "react-icons/fa";

const universities = [
  { name: "Chechen State\nMedical University", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-emerald-500 to-teal-600" },
  { name: "Al Farabi Kazakh\nNational University", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329724920/ChatGPT%20Image%20Jul%206,%202026,%2002_51_57%20PM.png", color: "from-blue-500 to-indigo-600" },
  { name: "Kazakh National\nMedical University", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329705549/ChatGPT%20Image%20Jul%206,%202026,%2002_43_27%20PM.png", color: "from-sky-500 to-blue-600" },
  { name: "Andijan State\nMedical Institute", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-amber-500 to-orange-600" },
  { name: "Tashkent Medical\nAcademy", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329724920/ChatGPT%20Image%20Jul%206,%202026,%2002_51_57%20PM.png", color: "from-purple-500 to-indigo-600" },
  { name: "Batumi Shota\nRustaveli University", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329705549/ChatGPT%20Image%20Jul%206,%202026,%2002_43_27%20PM.png", color: "from-rose-500 to-pink-600" },
  { name: "Alte University", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-cyan-500 to-teal-600" },
  { name: "Georgian National\nUniversity SEU", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329724920/ChatGPT%20Image%20Jul%206,%202026,%2002_51_57%20PM.png", color: "from-red-500 to-orange-600" },
];
// ↑ PASTE YOUR UNIVERSITY LOGO IMAGE LINKS IN THE logo: "" FIELDS ABOVE ↑

export default function PopularUniversities() {
  const [page, setPage] = useState(0);
  const perPage = 8;
  const totalPages = Math.ceil(universities.length / perPage);

  const handlePrev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  const handleNext = () => setPage((p) => (p >= totalPages - 1 ? 0 : p + 1));

  const visible = universities.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">

        {/* ─── Title ─── */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider text-center">
            POPULAR UNIVERSITIES ABROAD
          </h2>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* ─── Carousel Container ─── */}
        <div className="relative">

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 hover:border-[#0c2e60] bg-white flex items-center justify-center text-slate-400 hover:text-[#0c2e60] transition-colors shadow-sm z-20"
            aria-label="Previous"
          >
            <FaChevronLeft size={11} />
          </button>

          {/* Cards Grid */}
          <div className="border border-slate-200/80 rounded-2xl px-4 sm:px-6 py-5 sm:py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {visible.map((uni, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow min-h-[130px] sm:min-h-[150px]"
                >
                  {/* University Logo — paste your image link in src="" */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                    {uni.logo ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <img src={uni.logo} alt={uni.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${uni.color} flex items-center justify-center text-white text-sm sm:text-base shadow-sm border border-white/20`}>
                        <FaGraduationCap />
                      </div>
                    )}
                  </div>
                  <h3 className="text-[9px] sm:text-[10px] font-black text-[#0c2e60] leading-tight whitespace-pre-line">
                    {uni.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 hover:border-[#0c2e60] bg-white flex items-center justify-center text-slate-400 hover:text-[#0c2e60] transition-colors shadow-sm z-20"
            aria-label="Next"
          >
            <FaChevronRight size={11} />
          </button>

        </div>
      </div>
    </section>
  );
}
