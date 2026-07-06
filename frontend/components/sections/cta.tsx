"use client";

import React from "react";
import Link from "next/link";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEdit,
  FaUsers,
  FaGlobe,
  FaHandshake,
  FaMedkit,
  FaUserTie,
} from "react-icons/fa";

export default function CTASection() {
  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">

        {/* ─── Capsule Banner ─── */}
        <div className="bg-gradient-to-r from-[#0a1f3f] via-[#0c2e60] to-[#0a1f3f] rounded-[24px] sm:rounded-[30px] px-5 sm:px-8 md:px-10 py-4 sm:py-5 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-2xl relative overflow-hidden">

          {/* Left: Doctor + Text */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 relative z-10">
            {/* Doctor circle — set your image URL below */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/30 bg-slate-700 flex-shrink-0 flex items-center justify-center">
              {/* Replace DOCTOR_IMAGE_URL with your actual image link */}
              {true ? (
                <img src="https://i.ibb.co/fzrtCBTP/Chat-GPT-Image-Jul-6-2026-03-16-34-PM.png" alt="Doctor" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-black">👨‍⚕️</span>
              )}
            </div>

            <div className="text-center sm:text-left">
              <span className="text-[11px] sm:text-[13px] font-extrabold text-white/70 tracking-wider uppercase block">
                DON&apos;T WAIT! LIMITED SEATS AVAILABLE
              </span>
              <h2 className="text-[18px] sm:text-[22px] md:text-[26px] font-black text-[#f9a825] tracking-tight italic mt-0.5">
                GET FREE COUNSELING NOW!
              </h2>
            </div>
          </div>

          {/* Right: 3 CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold px-5 py-3 rounded-xl text-[11px] sm:text-[12px] flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
            >
              <FaWhatsapp size={14} /> WHATSAPP NOW
            </a>
            <a
              href="tel:01202611111"
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-extrabold px-4 py-2 sm:py-2.5 rounded-xl flex flex-col items-center shadow-md transition-all hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-1.5 text-[11px] sm:text-[12px]">
                <FaPhoneAlt size={11} /> CALL NOW
              </span>
            </a>
            <Link
              href="/contact"
              className="bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black px-5 py-3 rounded-xl text-[11px] sm:text-[12px] flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
            >
              <FaEdit size={12} /> APPLY NOW
            </Link>
          </div>
        </div>

        {/* ─── Trust Bar ─── */}
        <div className="flex flex-wrap justify-center items-center gap-x-10 md:gap-x-16 gap-y-4 px-2">
          {[
            { icon: <FaUsers className="text-lg" />, text: "Trusted by 25,000+ Students" },
            { icon: <FaGlobe className="text-lg" />, text: "Pan India Presence" },
            { icon: <FaUserTie className="text-lg" />, text: "Expert Counselor Team" },
            { icon: <FaHandshake className="text-lg" />, text: "End to End Support" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-[11px] sm:text-[12px] font-black text-[#0c2e60] tracking-wide"
            >
              <span className="text-[#0c2e60]">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* ─── Floating WhatsApp Button ─── */}
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-green-500/30 hover:scale-110 transition-transform z-50"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>

      </div>
    </section>
  );
}
