"use client";

import React, { useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Ananya Sharma",
    rating: 5,
    review:
      "Admission Anytime helped me get admission in AIIMS through proper guidance. The team is very supportive and professional.",
    image: "https://uploads.onecompiler.io/43k3a6e7q/1783323963436/4-removebg-preview.png", // ← PASTE STUDENT IMAGE LINK HERE
  },
  {
    name: "Rohan Mehta",
    rating: 5,
    review:
      "I got admission in Kazakh National Medical University. The whole process was smooth from admission to visa and travel.",
    image: "https://uploads.onecompiler.io/43k3a6e7q/1783323963436/4-removebg-preview.png", // ← PASTE STUDENT IMAGE LINK HERE
  },
  {
    name: "Riya Singh",
    rating: 5,
    review:
      "Excellent support and transparent process. My daughter is now studying MBBS in Georgia. Thank you Admission Anytime!",
    image: "https://uploads.onecompiler.io/43k3a6e7q/1783324025279/cheerful-curly-business-girl-wearing-glasses.jpg", // ← PASTE STUDENT IMAGE LINK HERE
  },
];

export default function TestimonialsSection() {
  const [page, setPage] = useState(0);

  return (
    <section className="pt-0 pb-10 sm:pb-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">

        {/* Title */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider text-center">
            WHAT OUR STUDENTS & PARENTS SAY
          </h2>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* Cards with side arrows */}
        <div className="relative flex items-center">

          {/* Left Arrow */}
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 hover:border-[#0c2e60] bg-white flex items-center justify-center text-slate-400 hover:text-[#0c2e60] transition-colors shadow-sm z-20"
            aria-label="Previous"
          >
            <FaChevronLeft size={11} />
          </button>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full px-2">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                {/* Profile row */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 flex-shrink-0">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0c2e60] to-[#0F4C81] flex items-center justify-center text-white text-lg font-black">
                        {t.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[13px] sm:text-[14px] font-black text-[#0c2e60] leading-tight">
                      {t.name}
                    </h4>
                    <div className="flex gap-0.5 text-[#f59e0b] mt-1">
                      {Array.from({ length: t.rating }).map((_, si) => (
                        <FaStar key={si} size={11} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review */}
                <p className="text-[11px] sm:text-[12px] text-slate-500 font-medium leading-relaxed">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => setPage((p) => p + 1)}
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
