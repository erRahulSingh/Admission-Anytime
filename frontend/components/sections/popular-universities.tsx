"use client";

import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaGraduationCap } from "react-icons/fa";

const universities = [
  { name: "Chechen State\nMedical University", country: "Russia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-emerald-500 to-teal-600" },
  { name: "Al Farabi Kazakh\nNational University", country: "Kazakhstan", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329724920/ChatGPT%20Image%20Jul%206,%202026,%2002_51_57%20PM.png", color: "from-blue-500 to-indigo-600" },
  { name: "Kazakh National\nMedical University", country: "Kazakhstan", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329705549/ChatGPT%20Image%20Jul%206,%202026,%2002_43_27%20PM.png", color: "from-sky-500 to-blue-600" },
  { name: "Andijan State\nMedical Institute", country: "Uzbekistan", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-amber-500 to-orange-600" },
  { name: "Tashkent Medical\nAcademy", country: "Uzbekistan", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329724920/ChatGPT%20Image%20Jul%206,%202026,%2002_51_57%20PM.png", color: "from-purple-500 to-indigo-600" },
  { name: "Batumi Shota\nRustaveli University", country: "Georgia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329705549/ChatGPT%20Image%20Jul%206,%202026,%2002_43_27%20PM.png", color: "from-rose-500 to-pink-600" },
  { name: "Alte University\nGeorgia", country: "Georgia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-cyan-500 to-teal-600" },
  { name: "Georgian National\nUniversity SEU", country: "Georgia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329724920/ChatGPT%20Image%20Jul%206,%202026,%2002_51_57%20PM.png", color: "from-red-500 to-orange-600" },
  { name: "Samarkand State\nMedical University", country: "Uzbekistan", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329705549/ChatGPT%20Image%20Jul%206,%202026,%2002_43_27%20PM.png", color: "from-teal-500 to-emerald-600" },
  { name: "Kazan Federal\nUniversity", country: "Russia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-indigo-500 to-purple-600" },
  { name: "Kursk State\nMedical University", country: "Russia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329724920/ChatGPT%20Image%20Jul%206,%202026,%2002_51_57%20PM.png", color: "from-blue-600 to-sky-600" },
  { name: "Orenburg State\nMedical University", country: "Russia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329705549/ChatGPT%20Image%20Jul%206,%202026,%2002_43_27%20PM.png", color: "from-red-600 to-rose-600" },
  { name: "Tbilisi State\nMedical University", country: "Georgia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-emerald-600 to-green-600" },
  { name: "Asian Medical\nInstitute", country: "Kyrgyzstan", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329724920/ChatGPT%20Image%20Jul%206,%202026,%2002_51_57%20PM.png", color: "from-amber-600 to-yellow-500" },
  { name: "International School\nof Medicine (ISM)", country: "Kyrgyzstan", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329705549/ChatGPT%20Image%20Jul%206,%202026,%2002_43_27%20PM.png", color: "from-violet-600 to-purple-600" },
  { name: "Yerevan State\nMedical University", country: "Armenia", logo: "https://uploads.onecompiler.io/43k3a6e7q/1783329112448/ChatGPT%20Image%20Jul%206,%202026,%2002_41_37%20PM.png", color: "from-pink-600 to-rose-500" },
];

export default function PopularUniversities() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicated array for 100% seamless infinite looping
  const doubleUniversities = [...universities, ...universities];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // 60FPS Continuous Non-Stopping Smooth Glide
  useEffect(() => {
    let animationFrameId: number;

    const step = () => {
      if (scrollRef.current && !isPaused) {
        const container = scrollRef.current;
        // Halfway point is exact duplicate boundary
        const maxScroll = container.scrollWidth / 2;

        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 1.2; // Silky smooth 60fps continuous speed
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <section className="py-10 sm:py-14 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">

        {/* ─── Title ─── */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider text-center">
            POPULAR UNIVERSITIES ABROAD
          </h2>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* ─── Smooth Infinite Slider Container ─── */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 hover:border-[#0c2e60] bg-white flex items-center justify-center text-slate-500 hover:text-[#0c2e60] transition-all shadow-md hover:scale-110 z-20"
            aria-label="Previous"
          >
            <FaChevronLeft size={12} />
          </button>

          {/* Left Fade Edge */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

          {/* Continuous Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {doubleUniversities.map((uni, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[150px] sm:w-[165px] bg-white border border-slate-200 hover:border-[#0c2e60]/30 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-2.5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group/card cursor-pointer"
              >
                {/* University Logo */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 p-1 bg-slate-50 border border-slate-100 group-hover/card:scale-105 transition-transform">
                  {uni.logo ? (
                    <img src={uni.logo} alt={uni.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${uni.color} flex items-center justify-center text-white text-sm sm:text-base shadow-sm`}>
                      <FaGraduationCap />
                    </div>
                  )}
                </div>

                {/* Country Badge */}
                <span className="text-[9px] font-bold text-[#1a6de1] bg-blue-50 px-2 py-0.5 rounded-full">
                  {uni.country}
                </span>

                {/* Name */}
                <h3 className="text-[10px] sm:text-[11px] font-bold text-[#0c2e60] leading-tight whitespace-pre-line group-hover/card:text-[#1a6de1] transition-colors">
                  {uni.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Right Fade Edge */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 hover:border-[#0c2e60] bg-white flex items-center justify-center text-slate-500 hover:text-[#0c2e60] transition-all shadow-md hover:scale-110 z-20"
            aria-label="Next"
          >
            <FaChevronRight size={12} />
          </button>

        </div>
      </div>
    </section>
  );
}
