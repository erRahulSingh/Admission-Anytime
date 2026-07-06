"use client";

import React from "react";
import { FaGraduationCap, FaArrowRight, FaHospital, FaNotesMedical, FaStethoscope, FaUserNurse } from "react-icons/fa";

export default function MBBSIndiaPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 space-y-12">
        
        {/* Banner Title */}
        <div className="bg-[#0b1c2c] text-white p-8 md:p-14 rounded-premium text-center space-y-4 shadow-xl">
          <span className="text-secondary-500 font-extrabold uppercase text-xs tracking-widest">
            National Counseling Guidance
          </span>
          <h1 className="text-3xl md:text-5xl font-black">
            Pursue MBBS in India (2026-27)
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
            Get accurate seat counseling info for government, private, and deemed university quotas.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-premium border border-slate-100 shadow-lg space-y-6">
              <h2 className="text-2xl font-black text-text-dark flex items-center gap-2">
                <FaStethoscope className="text-primary-500" /> General Seat Distribution Structure
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Medical seats in India are categorized under two main bodies: the Medical Counselling Committee (MCC) for 15% All India Quota and State Counseling Authorities for 85% home state quotas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="border border-slate-100 p-5 rounded-xl bg-slate-50/50">
                  <h4 className="font-extrabold text-sm text-primary-500 uppercase tracking-wider mb-2">15% All India Quota (AIQ)</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Open to all qualified aspirants nationwide. Allocated directly by MCC in multiple rounds based on NEET merit.
                  </p>
                </div>
                <div className="border border-slate-100 p-5 rounded-xl bg-slate-50/50">
                  <h4 className="font-extrabold text-sm text-secondary-600 uppercase tracking-wider mb-2">85% State Quotas</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Reserved for domicile residents of respective states. Conducted by respective state medical boards.
                  </p>
                </div>
              </div>
            </div>

            {/* Cut-off table card */}
            <div className="bg-white p-8 rounded-premium border border-slate-100 shadow-lg space-y-6">
              <h2 className="text-2xl font-black text-text-dark flex items-center gap-2">
                <FaNotesMedical className="text-primary-500" /> NEET 2026 Expected Cutoffs
              </h2>
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
                  <tbody className="text-text-dark font-medium divide-y divide-slate-50">
                    <tr>
                      <td className="py-4 px-2 font-bold">General / UR</td>
                      <td className="py-4 px-2 text-primary-500 font-extrabold">615 - 625 Marks</td>
                      <td className="py-4 px-2">250 - 450 Marks</td>
                      <td className="py-4 px-2"><span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">High Merit</span></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-2 font-bold">OBC</td>
                      <td className="py-4 px-2 text-primary-500 font-extrabold">610 - 618 Marks</td>
                      <td className="py-4 px-2">220 - 400 Marks</td>
                      <td className="py-4 px-2"><span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">High Merit</span></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-2 font-bold">SC</td>
                      <td className="py-4 px-2 text-primary-500 font-extrabold">495 - 515 Marks</td>
                      <td className="py-4 px-2">150 - 300 Marks</td>
                      <td className="py-4 px-2"><span className="bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">Medium Merit</span></td>
                    </tr>
                    <tr>
                      <td className="py-4 px-2 font-bold">ST</td>
                      <td className="py-4 px-2 text-primary-500 font-extrabold">470 - 490 Marks</td>
                      <td className="py-4 px-2">130 - 280 Marks</td>
                      <td className="py-4 px-2"><span className="bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">Medium Merit</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column: Quick callback widget */}
          <div className="lg:col-span-4 bg-white border border-slate-100 p-6 md:p-8 rounded-premium shadow-lg space-y-6">
            <div className="space-y-2">
              <span className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                <FaUserNurse />
              </span>
              <h3 className="text-lg font-black text-text-dark">Ask a Senior Counselor</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Confused about counseling rounds, choice filling orders, or deemed college fees? Speak directly to our counselors.
              </p>
            </div>
            <a
              href="/contact"
              className="w-full block text-center bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-xs"
            >
              Get Free India Counseling Callback
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
