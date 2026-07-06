"use client";

import React from "react";
import { FaAward, FaHistory, FaBullseye, FaGlobe } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 space-y-16">
        
        {/* About Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-500 bg-primary-50 px-4 py-1.5 rounded-full">
              Who We Are
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-text-dark tracking-tight leading-tight">
              Empowering Future Doctors Since 2001
            </h1>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              We are a premier ISO 9001:2015 certified medical admission consulting organization. Over the last 25 years, we have guided more than 25,000 students to secure MBBS seats in leading government and private medical institutions in India and abroad.
            </p>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              Our counselors are medical education veterans who maintain absolute transparency regarding fee details, hostel quality, and visa policies.
            </p>
          </div>
          <div className="relative h-80 lg:h-96 rounded-premium overflow-hidden bg-slate-200 border border-slate-100 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600"
              alt="Medical Consultation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Our Mission",
              description: "To deliver transparent, direct guidance to medical aspirants, helping them build global careers without financial stress.",
              icon: <FaBullseye />,
            },
            {
              title: "Our Experience",
              description: "25+ years of active partnership with top WHO and NMC-approved medical universities in Georgia, Russia, Kazakhstan, Uzbekistan, etc.",
              icon: <FaHistory />,
            },
            {
              title: "Quality Standard",
              description: "ISO 9001:2015 certification ensures strict compliance with counseling, document verification, and visa support processes.",
              icon: <FaAward />,
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-premium border border-slate-100 shadow-lg shadow-slate-100/50 space-y-4">
              <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-text-dark">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
