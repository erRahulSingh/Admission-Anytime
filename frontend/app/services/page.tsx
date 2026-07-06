"use client";

import React from "react";
import ServicesSection from "@/components/sections/services";
import { FaGraduationCap, FaHospitalSymbol, FaUserShield, FaCcVisa } from "react-icons/fa";

export default function ServicesPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Banner */}
      <div className="bg-[#0b1c2c] text-white py-16 px-4 border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto text-center space-y-4">
          <span className="text-secondary-500 font-extrabold uppercase text-xs tracking-widest">
            Expert Counseling Division
          </span>
          <h1 className="text-3xl md:text-5xl font-black">
            Our Consultancy Services
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
            Review the detailed stages of support we offer to medical candidates from pre-admission documentation to on-campus hostel settling.
          </p>
        </div>
      </div>

      {/* Grid rendering service items */}
      <ServicesSection />
    </div>
  );
}
