"use client";

import React from "react";
import {
  FaGraduationCap,
  FaHospital,
  FaNotesMedical,
  FaStethoscope,
  FaUserNurse,
  FaBuilding,
  FaAward,
  FaShieldAlt,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

export default function MBBSIndiaPage() {
  return (
    <div className="bg-gradient-to-br from-[#f8fafc] via-[#edf4fe] to-[#f1f5f9] min-h-screen py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 space-y-16">
        
        {/* ─── Banner Title ─── */}
        <div className="bg-[#0c2e60] text-white p-8 md:p-16 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#f9a825]/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          
          <span className="inline-block bg-[#f9a825] text-text-dark font-black text-[10px] sm:text-[11px] px-4 py-1.5 uppercase tracking-widest rounded-md shadow-sm">
            National Counseling Guidance (2026-27)
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
            STUDY MBBS IN INDIA
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-semibold">
            India is home to some of the world's most respected medical institutions, offering excellent education, experienced faculty, advanced research facilities, and extensive clinical exposure.
          </p>
        </div>

        {/* ─── Info Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* General Seat distribution info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#f9a825] rounded-full"></span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0c2e60] tracking-tight uppercase flex items-center gap-2">
                  <FaStethoscope className="text-primary-500" /> Seat Distribution Structure
                </h2>
              </div>
              
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                Medical seats in India are categorized under two main bodies: the Medical Counselling Committee (MCC) for 15% All India Quota and State Counseling Authorities for 85% home state quotas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 hover:border-primary-100 hover:bg-white transition-all duration-300">
                  <h4 className="font-black text-xs text-primary-500 uppercase tracking-wider mb-2">15% All India Quota (AIQ)</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Open to all qualified aspirants nationwide. Allocated directly by MCC in multiple rounds based on NEET merit.
                  </p>
                </div>
                <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 hover:border-primary-100 hover:bg-white transition-all duration-300">
                  <h4 className="font-black text-xs text-[#f9a825] uppercase tracking-wider mb-2">85% State Quotas</h4>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Reserved for domicile residents of respective states. Conducted by respective state medical boards.
                  </p>
                </div>
              </div>
            </div>

            {/* Assistance Categories */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#f9a825] rounded-full"></span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0c2e60] tracking-tight uppercase">
                  Institutions We Assist Admissions For
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Government */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3">
                  <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                    <FaBuilding className="text-lg" />
                  </div>
                  <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Government Medical Colleges</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Government medical colleges remain the first choice for many students because of their affordable tuition fees, highly qualified faculty, extensive hospital exposure, and strong academic reputation. We guide students through counseling procedures to maximize their admission opportunities based on merit.
                  </p>
                </div>

                {/* Private */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3">
                  <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                    <FaHospital className="text-lg" />
                  </div>
                  <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Private Medical Colleges</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Private medical colleges offer excellent infrastructure, modern laboratories, advanced teaching methodologies, and quality clinical training. Our counselors help students compare institutions based on academics, fee structure, accreditation, and career opportunities.
                  </p>
                </div>

                {/* Deemed */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3">
                  <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                    <FaGraduationCap className="text-lg" />
                  </div>
                  <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Deemed Universities</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Several reputed deemed universities provide high-quality medical education with modern teaching facilities and research opportunities. We help students identify institutions that align with their career aspirations and educational preferences.
                  </p>
                </div>

                {/* Premier */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-3">
                  <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                    <FaAward className="text-lg" />
                  </div>
                  <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Premier Institutions (AIIMS & BHU)</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Premier institutions are highly competitive and require careful planning. Admission Anytime provides guidance regarding eligibility, counseling procedures, documentation, and important admission updates to help students navigate these opportunities effectively.
                  </p>
                </div>

              </div>
            </div>

            {/* Cut-offs table */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#f9a825] rounded-full"></span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0c2e60] tracking-tight uppercase flex items-center gap-2">
                  <FaNotesMedical className="text-primary-500" /> NEET 2026 Expected Cutoffs
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase">
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2">Govt Seat Cutoff</th>
                      <th className="py-3 px-2">Deemed Seat Cutoff</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-dark font-semibold divide-y divide-slate-50">
                    <tr>
                      <td className="py-4 px-2 font-black text-[#0c2e60]">General / UR</td>
                      <td className="py-4 px-2 text-[#16a34a] font-extrabold">615 - 625 Marks</td>
                      <td className="py-4 px-2">250 - 450 Marks</td>
                      <td className="py-4 px-2"><span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">High Merit</span></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-2 font-black text-[#0c2e60]">OBC</td>
                      <td className="py-4 px-2 text-[#16a34a] font-extrabold">610 - 618 Marks</td>
                      <td className="py-4 px-2">220 - 400 Marks</td>
                      <td className="py-4 px-2"><span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">High Merit</span></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-2 font-black text-[#0c2e60]">SC</td>
                      <td className="py-4 px-2 text-[#f9a825] font-extrabold">495 - 515 Marks</td>
                      <td className="py-4 px-2">150 - 300 Marks</td>
                      <td className="py-4 px-2"><span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">Medium Merit</span></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-2 font-black text-[#0c2e60]">ST</td>
                      <td className="py-4 px-2 text-[#f9a825] font-extrabold">470 - 490 Marks</td>
                      <td className="py-4 px-2">130 - 280 Marks</td>
                      <td className="py-4 px-2"><span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">Medium Merit</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right sidebar column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Ask a Senior Counselor block */}
            <div className="bg-[#0c2e60] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="space-y-3">
                <span className="w-10 h-10 bg-white/10 text-[#f9a825] rounded-xl flex items-center justify-center text-lg border border-white/10">
                  <FaUserNurse />
                </span>
                <h3 className="text-lg font-black tracking-wide uppercase">Ask a Senior Counselor</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  Confused about counseling rounds, choice filling orders, or deemed college fees? Speak directly to our counselors.
                </p>
              </div>

              <a
                href="/contact"
                className="w-full block text-center bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-3.5 rounded-xl shadow-lg transition-all text-xs tracking-wider uppercase"
              >
                Free Counseling Call
              </a>
            </div>

            {/* Why Choose MBBS in India block */}
            <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="space-y-2 flex items-center gap-2">
                <span className="w-10 h-10 bg-primary-50 text-[#0c2e60] rounded-xl flex items-center justify-center text-lg">
                  <FaShieldAlt />
                </span>
                <h3 className="text-base font-black text-[#0c2e60] uppercase tracking-wider">Why MBBS in India?</h3>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                Studying MBBS in India offers several long-term advantages:
              </p>

              <ul className="space-y-3 pt-2">
                {[
                  "High academic standards",
                  "Experienced medical faculty",
                  "Excellent hospital exposure",
                  "Strong clinical training",
                  "Research opportunities",
                  "Wide specialization options",
                  "Recognized medical qualifications",
                  "Opportunities in government and private sectors"
                ].map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                    <FaCheckCircle className="text-[#16a34a] text-sm mt-0.5 flex-shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
              
              <p className="text-[10px] text-text-muted italic leading-relaxed pt-3 border-t border-slate-100">
                Students who secure admission in Indian medical colleges benefit from a robust healthcare ecosystem and exposure to diverse clinical cases.
              </p>
            </div>

          </div>

        </div>

        {/* ─── Closing CTA ─── */}
        <div className="bg-gradient-to-r from-[#0a1c2c] to-[#0c2e60] text-white rounded-3xl p-8 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#f9a825] bg-white/5 border border-[#f9a825]/30 px-3 py-1 rounded-full">
              Your Journey Begins Today
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none">
              Your Medical Journey Starts With The Right Decision
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              At Admission Anytime, we are committed to making that decision easier by providing accurate information, personalized counseling, and complete admission assistance. Whether your destination is a prestigious medical college in India or an internationally recognized university abroad, our experienced team is here to guide you every step of the way.
            </p>
            
            <div className="pt-4">
              <a
                href="/contact"
                className="inline-block bg-[#16a34a] hover:bg-[#15803d] hover:shadow-green-600/30 hover:-translate-y-0.5 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all text-xs tracking-wider uppercase"
              >
                Book Your Free Counseling Session
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
