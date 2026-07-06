"use client";

import React from "react";
import {
  FaUserTie,
  FaUniversity,
  FaFilePdf,
  FaCcVisa,
  FaCoins,
  FaMoneyBillWave,
  FaPlane,
  FaHotel,
  FaShieldAlt,
  FaTaxi,
  FaUserShield,
  FaBookReader,
  FaHospitalUser,
} from "react-icons/fa";

const serviceList = [
  { title: "Career\nCounseling", icon: <FaUserTie />, bg: "bg-[#0c2e60]" },
  { title: "College\nSelection", icon: <FaUniversity />, bg: "bg-[#16a34a]" },
  { title: "Documentation", icon: <FaFilePdf />, bg: "bg-[#0ea5e9]" },
  { title: "Visa\nAssistance", icon: <FaCcVisa />, bg: "bg-[#7c3aed]" },
  { title: "Education\nLoan", icon: <FaCoins />, bg: "bg-[#f59e0b]" },
  { title: "Forex\nAssistance", icon: <FaMoneyBillWave />, bg: "bg-[#16a34a]" },
  { title: "Travel\nAssistance", icon: <FaPlane />, bg: "bg-[#ef4444]" },
  { title: "Hostel\nAssistance", icon: <FaHotel />, bg: "bg-[#14b8a6]" },
  { title: "Medical\nInsurance", icon: <FaShieldAlt />, bg: "bg-[#0ea5e9]" },
  { title: "Airport\nPickup", icon: <FaTaxi />, bg: "bg-[#f59e0b]" },
  { title: "Parents\nSupport", icon: <FaUserShield />, bg: "bg-[#16a34a]" },
  { title: "NExT / FMGE\nGuidance", icon: <FaBookReader />, bg: "bg-[#7c3aed]" },
  { title: "Internship\nGuidance", icon: <FaHospitalUser />, bg: "bg-[#0c2e60]" },
];

export default function ServicesSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-8">

        {/* Title */}
        <div className="flex items-center justify-center gap-4">
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider text-center">
            OUR SERVICES
          </h2>
          <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
        </div>

        {/* Services Grid in bordered container */}
        <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-6 bg-slate-50/30">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-13 gap-3 sm:gap-4">
            {serviceList.map((s, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center text-center gap-3.5 hover:shadow-md hover:border-slate-300 hover:scale-[1.03] transition-all duration-300 min-h-[110px] sm:min-h-[135px] cursor-pointer"
              >
                <div className="text-[#0c2e60] text-2xl sm:text-3xl flex items-center justify-center">
                  {s.icon}
                </div>
                <h3 className="text-[9px] sm:text-[10px] font-black text-[#0c2e60] leading-tight whitespace-pre-line tracking-wide">
                  {s.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
