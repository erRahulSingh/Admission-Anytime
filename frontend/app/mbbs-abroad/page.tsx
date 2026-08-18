"use client";

import React from "react";
import Link from "next/link";
import {
  FaGlobe,
  FaGraduationCap,
  FaBuilding,
  FaCcVisa,
  FaPlane,
  FaUserShield,
  FaHospital,
  FaUserTie,
  FaPhoneAlt,
  FaWhatsapp,
  FaCheck,
  FaEdit,
  FaClipboardList,
  FaAward,
  FaHandshake,
  FaHeartbeat,
  FaStethoscope,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

/* ─── 9 Advantages of MBBS Abroad ─── */
const advantages = [
  "Affordable tuition fees compared to many private institutions",
  "Globally recognized medical universities (WHO & NMC)",
  "English-medium MBBS programs in many universities",
  "Modern infrastructure and advanced laboratories",
  "Experienced professors and qualified medical faculty",
  "Early clinical exposure and practical hospital training",
  "Vibrant international student community",
  "Safe and student-friendly campuses",
  "Opportunities for higher education & global career pathways",
];

/* ─── Detailed 6 Country Profiles matching the mockup ─── */
const countriesList = [
  {
    name: "Russia",
    code: "ru",
    slug: "russia",
    avgCost: "₹18 - ₹25 Lakhs",
    duration: "6 Years",
    ranking: "Top World Universities",
    coverImage: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80",
    desc: "Russia offers government medical universities with century-old traditions, modern laboratories, and extensive clinical exposure.",
    bullets: [
      "Government medical universities with top academic standards",
      "Subsidized tuition fees & low living costs",
      "WHO, NMC, and ECFMG recognized degrees",
    ],
  },
  {
    name: "Georgia",
    code: "ge",
    slug: "georgia",
    avgCost: "₹25 - ₹35 Lakhs",
    duration: "6 Years",
    ranking: "European Standards",
    coverImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80",
    desc: "Georgia is the leading destination in Eastern Europe offering 100% English-medium MBBS courses with OSCE practical exams.",
    bullets: [
      "European syllabus & credit transfers (ECTS)",
      "High FMGE/NExT passing rate for Indian students",
      "Safe, scenic, and student-friendly environment",
    ],
  },
  {
    name: "Kazakhstan",
    code: "kz",
    slug: "kazakhstan",
    avgCost: "₹15 - ₹20 Lakhs",
    duration: "5 Years",
    ranking: "5-Year NMC Course",
    coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    desc: "Kazakhstan offers 5-year MBBS programs following NMC guidelines with modern capital city campuses.",
    bullets: [
      "Only 5-year course duration following NMC guidelines",
      "Located in capital cities with modern clinical labs",
      "Highly affordable fees with low cost of living",
    ],
  },
  {
    name: "Uzbekistan",
    code: "uz",
    slug: "uzbekistan",
    avgCost: "₹14 - ₹18 Lakhs",
    duration: "5 Years",
    ranking: "Government Institutes",
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    desc: "Uzbekistan provides budget-friendly medical education with state-of-the-art diagnostic centers and Indian hostels.",
    bullets: [
      "Government-funded medical academies",
      "Indian food mess & hostel facilities available",
      "Practical-oriented clinical rotations",
    ],
  },
  {
    name: "Kyrgyzstan",
    code: "kg",
    slug: "kyrgyzstan",
    avgCost: "₹15 - ₹19 Lakhs",
    duration: "5 Years",
    ranking: "Low Budget Choice",
    coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    desc: "Kyrgyzstan is ideal for students seeking quality medical training at minimal expense with large Indian communities.",
    bullets: [
      "Lowest tuition fee structure in Central Asia",
      "100% English medium instruction",
      "Established network of Indian student associations",
    ],
  },
  {
    name: "Nepal",
    code: "np",
    slug: "nepal",
    avgCost: "₹45 - ₹55 Lakhs",
    duration: "5.5 Years",
    ranking: "NMC/MCI Equivalent",
    coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    desc: "Nepal offers medical education identical to the Indian MBBS curriculum without visa requirements.",
    bullets: [
      "Curriculum & disease pattern identical to India",
      "No visa or passport required for Indian nationals",
      "High FMGE passing rate with Indian faculty",
    ],
  },
];

export default function MBBSAbroadListingPage() {
  return (
    <div className="relative bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f1f5f9] min-h-screen pb-16 overflow-hidden">
      {/* Premium blurred ambient background shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none" />

      {/* ═══ 1. Banner Section ═══ */}
      <div className="relative bg-[#0c2e60] text-white pt-10 sm:pt-16 pb-14 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f3f] via-[#0c2e60] to-[#0a1f3f] opacity-95" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-3.5 sm:px-6 text-center space-y-3 sm:space-y-4">
          <span className="text-[#f9a825] font-black uppercase text-[10px] sm:text-xs tracking-widest bg-white/10 px-3.5 sm:px-4 py-1.5 rounded-full inline-block">
            Globally Accredited Programs
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            MBBS Abroad Destinations
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base font-semibold max-w-2xl mx-auto leading-relaxed">
            Explore WHO & NMC-approved medical universities across top international destinations.
          </p>
        </div>
      </div>

      {/* ═══ 2. Main Content Container ═══ */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 space-y-16 sm:space-y-20">
        
        {/* ═══ 3. Popular Countries section ═══ */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
              Popular Countries for MBBS Abroad
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-2xl mx-auto">
              Compare world-class medical education destinations and choose your ideal college.
            </p>
          </div>

          {/* ═════════ COUNTRIES GRID MATCHING MOCKUP EXACTLY ═════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {countriesList.map((country, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[28px] border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between group"
              >
                {/* 1. COVER BANNER */}
                <div className="relative h-52 bg-gradient-to-br from-[#0c2e60] via-[#13376B] to-[#1d62a3] overflow-hidden">
                  <img
                    src={country.coverImage}
                    alt={`MBBS in ${country.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Left Badge: ✔ NMC & WHO */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#132d54]/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/10">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                      <span>NMC & WHO</span>
                    </span>
                  </div>

                  {/* Top Right Badge: 🇰🇿 Country Name */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/60">
                      <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={`https://flagcdn.com/w80/${country.code === "nepal" ? "np" : country.code}.png`}
                          alt={`${country.name} Flag`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{country.name}</span>
                    </span>
                  </div>

                  {/* Floating Icon Avatar */}
                  <div className="absolute -bottom-5 left-6 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-lg flex items-center justify-center z-10">
                    <FaGraduationCap className="text-[#13376B] text-2xl" />
                  </div>
                </div>

                {/* 2. CARD CONTENT BODY */}
                <div className="p-6 pt-8 space-y-4">
                  {/* Title & Rank */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-[#13376B] transition-colors">
                      MBBS in {country.name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50/90 border border-amber-200/80 px-3 py-1 rounded-lg">
                      <FaStar className="text-amber-500 text-xs" />
                      <span>{country.ranking}</span>
                    </div>
                  </div>

                  {/* 3. DUAL STAT BOX */}
                  <div className="grid grid-cols-2 gap-3 bg-[#f3f6f9] p-3.5 rounded-2xl">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                        AVERAGE COST
                      </span>
                      <span className="text-base font-extrabold text-[#13376B]">
                        {country.avgCost}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                        DURATION
                      </span>
                      <span className="text-base font-extrabold text-slate-800">
                        {country.duration}
                      </span>
                    </div>
                  </div>

                  {/* 4. KEY HIGHLIGHTS BULLETS */}
                  <div className="space-y-2 pt-1">
                    {country.bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 leading-snug">
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-[9px] font-black mt-0.5 shadow-2xs">
                          ✓
                        </div>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* 5. DESCRIPTION */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal pt-1">
                    {country.desc}
                  </p>
                </div>

                {/* 6. BOTTOM BUTTON */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/universities?country=${country.name}`}
                    className="w-full bg-[#13376B] hover:bg-[#0a2550] text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all duration-300 text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-blue-950/20 group-hover:shadow-xl active:scale-[0.99]"
                  >
                    <span>EXPLORE UNIVERSITIES</span>
                    <FaArrowRight className="text-white text-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 4. Why Choose Section ═══ */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0c2e60] uppercase tracking-wider">
              WHY CHOOSE MBBS ABROAD?
            </h2>
            <p className="text-xs font-semibold text-slate-400">Key Advantages for Medical Aspirants</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed text-center lg:text-left">
              <p>
                Studying medicine abroad is more than just earning a degree—it is an opportunity to gain international exposure, experience diverse healthcare systems, and build a strong foundation for a global medical career.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#13376B] hover:bg-[#0c2e60] text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs tracking-wider uppercase shadow-md transition-all"
                >
                  Book Free Counseling <FaEdit />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-3 w-full">
              {advantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3.5 transition-all duration-200 group"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-xs font-bold text-[#0c2e60] leading-tight">
                    {adv}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
