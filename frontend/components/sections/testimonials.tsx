"use client";

import React, { useState, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    name: "MBBS Student, Russia",
    rating: 5,
    review:
      "The counseling team helped me understand every step of the admission process. They answered all my questions, guided me in choosing the right university, and supported me until I reached campus. I truly appreciate their professionalism and dedication.",
    image: "https://uploads.onecompiler.io/43k3a6e7q/1783323963436/4-removebg-preview.png",
  },
  {
    name: "MBBS Student, Georgia",
    rating: 5,
    review:
      "Admission Anytime made my admission journey smooth and stress-free. The documentation and visa guidance were handled professionally, and my parents felt confident throughout the process.",
    image: "https://uploads.onecompiler.io/43k3a6e7q/1783324025279/cheerful-curly-business-girl-wearing-glasses.jpg",
  },
  {
    name: "MBBS Student, Kazakhstan",
    rating: 5,
    review:
      "I was confused about choosing between several universities. Their counselors explained the advantages of each option without pushing me toward a specific college. That honesty helped me make the right decision.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "MBBS Student, Uzbekistan",
    rating: 5,
    review:
      "From career counseling to university joining, the team remained available whenever I needed assistance. Their support didn't end after admission, which made a big difference.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000); // Slide every 4 seconds
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const getVisibleTestimonials = () => {
    const list = [];
    for (let i = 0; i < visibleCount; i++) {
      const idx = (currentIndex + i) % testimonials.length;
      list.push(testimonials[idx]);
    }
    return list;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="pt-0 pb-10 sm:pb-14 bg-white select-none">
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
        <div 
          className="relative flex items-center px-4 sm:px-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 hover:border-[#0c2e60] bg-white flex items-center justify-center text-slate-400 hover:text-[#0c2e60] transition-all shadow-sm z-20 cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous"
          >
            <FaChevronLeft size={11} />
          </button>

          {/* Testimonial Cards Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full transition-all duration-500 ease-in-out">
            {visibleTestimonials.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 min-h-[170px]"
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
                <p className="text-[11px] sm:text-[12px] text-slate-500 font-medium leading-relaxed italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 hover:border-[#0c2e60] bg-white flex items-center justify-center text-slate-400 hover:text-[#0c2e60] transition-all shadow-sm z-20 cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next"
          >
            <FaChevronRight size={11} />
          </button>

        </div>
      </div>
    </section>
  );
}
