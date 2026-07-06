"use client";

import React from "react";
import {
  FaUser,
  FaFileContract,
  FaFileAlt,
  FaEnvelopeOpenText,
  FaPassport,
  FaPlane,
  FaUniversity,
  FaArrowRight,
} from "react-icons/fa";

const steps = [
  { step: 1, title: "Free Counseling", icon: <FaUser />, bg: "bg-[#16a34a]" },
  { step: 2, title: "College Selection", icon: <FaFileContract />, bg: "bg-[#14b8a6]" },
  { step: 3, title: "Documentation", icon: <FaFileAlt />, bg: "bg-[#0c2e60]" },
  { step: 4, title: "Admission Letter", icon: <FaEnvelopeOpenText />, bg: "bg-[#7c3aed]" },
  { step: 5, title: "Visa", icon: <FaPassport />, bg: "bg-[#f59e0b]" },
  { step: 6, title: "Travel", icon: <FaPlane />, bg: "bg-[#ef4444]" },
  { step: 7, title: "University Joining", icon: <FaUniversity />, bg: "bg-[#16a34a]" },
];

export default function AdmissionProcessSection() {
  return (
    <section className="py-5 sm:py-7 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6">

        {/* Title */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider text-center">
            OUR ADMISSION PROCESS
          </h2>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* Steps Row */}
        <div className="max-w-[1100px] mx-auto flex flex-wrap justify-between items-start gap-y-6 w-full">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center w-[90px] sm:w-[110px] md:w-[130px] relative">
              {/* Circle */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${s.bg} text-white flex items-center justify-center text-xl sm:text-2xl shadow-lg`}>
                {s.icon}
              </div>
              {/* Label */}
              <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-2.5">
                Step {s.step}
              </span>
              <span className="text-[10px] sm:text-[11px] font-black text-[#0c2e60] mt-0.5 leading-tight">
                {s.title}
              </span>

              {/* Arrow absolute-positioned to the right of each step (except the last one) */}
              {i < 6 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+45px)] xl:left-[calc(50%+55px)] -translate-y-1/2 text-slate-300">
                  <FaArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
