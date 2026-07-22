"use client";

import React from "react";
import Link from "next/link";
import {
  FaUniversity,
  FaGraduationCap,
  FaUserTie,
  FaFileAlt,
  FaPassport,
  FaPlane,
  FaUserShield,
  FaCoins,
  FaAward,
  FaCcVisa,
  FaCompass,
  FaCheckCircle,
  FaClipboardList,
  FaHeadset,
  FaFileContract,
  FaCheck,
  FaPhoneAlt,
  FaWhatsapp,
  FaEdit,
  FaArrowRight,
  FaBuilding,
  FaExchangeAlt,
} from "react-icons/fa";

/* ─── Comparison Factors ─── */
const comparisonFactors = [
  "Academic Reputation",
  "Faculty Experience",
  "Clinical Training Opportunities",
  "Hospital Attachments",
  "Campus Infrastructure",
  "Tuition Fees",
  "Living Expenses",
  "International Student Support",
  "Hostel Facilities",
  "Research Opportunities",
  "Internship Exposure",
  "Alumni Success",
  "Student Safety",
];

/* ─── 7-Step Process ─── */
const timelineSteps = [
  {
    step: 1,
    title: "Free Career Counseling",
    desc: "Every successful admission begins with the right guidance. Our experts evaluate your academic background, scores, and preferences to guide you.",
    bullets: ["NEET Qualification check", "Academic background analysis", "Preferred country discussion", "Budget & future plans alignment"],
    icon: <FaHeadset />,
    color: "from-blue-500 to-indigo-600",
  },
  {
    step: 2,
    title: "University & College Selection",
    desc: "Choosing the right university is a critical decision. We assist in matching student eligibility with top-ranked, NMC-approved institutions.",
    bullets: ["Eligibility & Academic standards", "Infrastructure & clinical exposure", "Hostel facilities & tuition comparison", "Student feedback reviews"],
    icon: <FaUniversity />,
    color: "from-emerald-500 to-teal-600",
  },
  {
    step: 3,
    title: "Documentation & Application",
    desc: "Medical admissions require meticulous documentation. Our dedicated admissions team guides you through the application forms and verification steps.",
    bullets: ["Academic certificates verification", "Passport guidance & affidavits", "University application form processing", "Translation services (where required)"],
    icon: <FaFileAlt />,
    color: "from-amber-500 to-orange-600",
  },
  {
    step: 4,
    title: "Admission Confirmation",
    desc: "Once your application is reviewed and accepted, the university issues the official admission confirmation or invitation letter.",
    bullets: ["Official admission letter release", "Tuition fee payment instructions", "Transparent breakdown of charges", "Step-by-step counselor support"],
    icon: <FaFileContract />,
    color: "from-purple-500 to-indigo-600",
  },
  {
    step: 5,
    title: "Visa Assistance",
    desc: "Obtaining a student visa is an important milestone. We help compile required documents and guide you throughout the visa cycle.",
    bullets: ["Visa application form review", "Embassy interview preparation", "Financial & sponsor documentation", "Travel authorization checklist"],
    icon: <FaCcVisa />,
    color: "from-pink-500 to-rose-600",
  },
  {
    step: 6,
    title: "Travel & Pre-Departure Support",
    desc: "We ensure you begin your international journey with confidence. Our travel desk coordinates pre-departure orientation, ticketing, and pickup.",
    bullets: ["Group travel arrangements", "Flight bookings & forex advice", "Hostel allocations coordination", "Pre-departure checklist briefing"],
    icon: <FaPlane />,
    color: "from-cyan-500 to-blue-600",
  },
  {
    step: 7,
    title: "University Joining & Support",
    desc: "Our support continues after arrival. Local representatives assist with campus registration, hostel check-in, and local support.",
    bullets: ["Campus registry & orientation", "Hostel check-in guidance", "Parent coordination updates", "FMGE/NExT screening mentoring"],
    icon: <FaUserShield />,
    color: "from-violet-500 to-fuchsia-600",
  },
];

/* ─── 11 Core Services ─── */
const detailedServices = [
  {
    title: "Career Counseling",
    desc: "Personalized, one-on-one sessions to help you understand options matching your NEET score and career goals.",
    icon: <FaUserTie />,
    bg: "from-[#ef4444]/10 to-[#ef4444]/5",
    border: "border-red-100 hover:border-red-300",
    iconColor: "text-[#ef4444] bg-[#ef4444]/10",
  },
  {
    title: "College Selection",
    desc: "Unbiased evaluations of top government medical colleges, private institutions, and NMC-approved global universities.",
    icon: <FaUniversity />,
    bg: "from-[#3b82f6]/10 to-[#3b82f6]/5",
    border: "border-blue-100 hover:border-blue-300",
    iconColor: "text-[#3b82f6] bg-[#3b82f6]/10",
  },
  {
    title: "Documentation Assistance",
    desc: "Systematic assistance with application forms, document verification, translation, and official transcript processing.",
    icon: <FaFileAlt />,
    bg: "from-[#10b981]/10 to-[#10b981]/5",
    border: "border-emerald-100 hover:border-emerald-300",
    iconColor: "text-[#10b981] bg-[#10b981]/10",
  },
  {
    title: "Visa Assistance",
    desc: "Dedicated support for documentation compilations, embassy submissions, and student visa interview mentoring.",
    icon: <FaCcVisa />,
    bg: "from-[#ec4899]/10 to-[#ec4899]/5",
    border: "border-pink-100 hover:border-pink-300",
    iconColor: "text-[#ec4899] bg-[#ec4899]/10",
  },
  {
    title: "Education Loan Guidance",
    desc: "Guidance on documentation and assistance with bank loan applications for hassle-free educational financing.",
    icon: <FaCoins />,
    bg: "from-[#f59e0b]/10 to-[#f59e0b]/5",
    border: "border-amber-100 hover:border-amber-300",
    iconColor: "text-[#f59e0b] bg-[#f59e0b]/10",
  },
  {
    title: "Forex & Financial Guidance",
    desc: "General guidance regarding foreign currency exchange rates, banking, and necessary international money transfer setups.",
    icon: <FaExchangeAlt />,
    bg: "from-[#8b5cf6]/10 to-[#8b5cf6]/5",
    border: "border-violet-100 hover:border-violet-300",
    iconColor: "text-[#8b5cf6] bg-[#8b5cf6]/10",
  },
  {
    title: "Travel Assistance",
    desc: "Arrangement of group flights, pre-departure briefs, baggage details, and airport pickup coordinations.",
    icon: <FaPlane />,
    bg: "from-[#0ea5e9]/10 to-[#0ea5e9]/5",
    border: "border-sky-100 hover:border-sky-300",
    iconColor: "text-[#0ea5e9] bg-[#0ea5e9]/10",
  },
  {
    title: "Hostel Assistance",
    desc: "Arranging secure campus accommodation, mess bookings, Indian food options, and room allocations.",
    icon: <FaBuilding />,
    bg: "from-[#14b8a6]/10 to-[#14b8a6]/5",
    border: "border-teals-100 hover:border-teal-300",
    iconColor: "text-[#14b8a6] bg-[#14b8a6]/10",
  },
  {
    title: "Parent Support",
    desc: "Regular updates, transparent fee discussions, travel alerts, and campus progress monitoring for parent peace of mind.",
    icon: <FaUserShield />,
    bg: "from-[#10b981]/10 to-[#10b981]/5",
    border: "border-emerald-100 hover:border-emerald-300",
    iconColor: "text-[#10b981] bg-[#10b981]/10",
  },
  {
    title: "FMGE / NExT Guidance",
    desc: "Mentoring resources and curriculum alignment guidance to prepare for licensing examinations in India.",
    icon: <FaAward />,
    bg: "from-[#f43f5e]/10 to-[#f43f5e]/5",
    border: "border-rose-100 hover:border-rose-300",
    iconColor: "text-[#f43f5e] bg-[#f43f5e]/10",
  },
  {
    title: "Internship Guidance",
    desc: "Guidance on clinical rotatory internships, hospital attachments, regulations, and licensing formalities.",
    icon: <FaGraduationCap />,
    bg: "from-[#0c2e60]/10 to-[#0c2e60]/5",
    border: "border-blue-100 hover:border-blue-300",
    iconColor: "text-[#0c2e60] bg-[#0c2e60]/10",
  },
];

/* ─── Why Parents Trust Us ─── */
const parentTrustPoints = [
  "Honest guidance without unrealistic promises",
  "100% transparent fee structures with no hidden costs",
  "Personalized counseling tailored to each student profile",
  "Regular, consistent updates throughout the application cycle",
  "Continuous parent-student coordination support on campus",
  "Reliable support division before and after university joining",
];

export default function ServicesPage() {
  return (
    <div className="relative bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f1f5f9] min-h-screen pb-16 overflow-hidden">
      {/* Premium blurred ambient background shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none" />
      
      {/* ═══ 1. Banner ═══ */}
      <div className="relative bg-[#0c2e60] text-white pt-10 sm:pt-16 pb-14 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f3f] via-[#0c2e60] to-[#0a1f3f] opacity-95" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-3.5 sm:px-6 text-center space-y-3 sm:space-y-4">
          <span className="text-[#f9a825] font-black uppercase text-[10px] sm:text-xs tracking-widest bg-white/10 px-3.5 sm:px-4 py-1.5 rounded-full">
            Expert Counseling Division
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Popular Medical Universities
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Discover World-Class Medical Universities That Shape Successful Doctors. Admission Anytime collaborates with reputed, NMC-approved medical institutions globally to deliver unbiased guidance and smooth career planning.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-16 md:space-y-24 mt-12 sm:mt-16">

        {/* ═══ 2. Comparison Criteria Section ═══ */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0c2e60] tracking-tight">
              We Help Students Compare Universities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold">
              Choosing the right university is just as important as choosing the country. We guide you based on these key pillars:
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-xl shadow-slate-100/40">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {comparisonFactors.map((factor, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 sm:gap-3 bg-slate-50/60 hover:bg-[#3b82f6]/5 border border-slate-100 hover:border-[#3b82f6]/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition-all duration-300 hover:scale-[1.02] group cursor-default"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center text-[10px] sm:text-xs flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <FaCheck />
                  </div>
                  <span className="text-[11px] sm:text-sm font-black text-[#0c2e60] tracking-tight leading-snug">
                    {factor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 3. The 7-Step Admission Timeline ═══ */}
        <section className="space-y-10 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0c2e60] tracking-tight uppercase">
              Our Simple 7-Step MBBS Admission Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold">
              A transparent admission journey simplifying counseling, documentation, and university joining.
            </p>
          </div>

          {/* Timeline Process Cards Grid */}
          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 lg:ml-12 space-y-10">
            {timelineSteps.map((s, i) => (
              <div key={i} className="relative pl-8 sm:pl-12 group">
                
                {/* Visual Step Circle */}
                <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white group-hover:scale-110 transition-transform duration-300`}>
                  {s.step}
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-lg shadow-slate-100/40 hover:shadow-xl transition-shadow flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  {/* Left Desc */}
                  <div className="space-y-3 lg:max-w-[60%]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#0c2e60] border border-slate-100 flex items-center justify-center text-lg flex-shrink-0 group-hover:rotate-3 group-hover:scale-105 transition-transform duration-300">
                        {s.icon}
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-black text-[#0c2e60] tracking-wide">
                        Step {s.step} – {s.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="flex flex-wrap gap-1.5 lg:max-w-[35%] w-full">
                    {s.bullets.map((b, bi) => (
                      <span
                        key={bi}
                        className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-[#0c2e60] tracking-wide"
                      >
                        ✔ {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 4. Comprehensive Services Grid ═══ */}
        <section className="space-y-10 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0c2e60] tracking-tight uppercase">
              Our Comprehensive Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold">
              Everything you need under one roof to make your medical admission process stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailedServices.map((srv, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${srv.bg} border ${srv.border} rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-[#0c2e60]/5 transition-all duration-300 transform hover:-translate-y-1.5 group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-sm ${srv.iconColor} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      {srv.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-[#0c2e60] tracking-wide leading-snug">
                      {srv.title}
                    </h3>
                  </div>
                  <div className="h-px bg-slate-200/60 w-full" />
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 5. Why Parents Trust Us ═══ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-100/40">
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
            <span className="text-[#f9a825] font-extrabold uppercase text-[10px] sm:text-xs tracking-widest bg-[#f9a825]/10 px-4 py-1.5 rounded-full inline-block">
              Parent Testimonial Base
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0c2e60] tracking-tight">
              Why Parents Trust Admission Anytime
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              Parents are looking for a trustworthy partner who genuinely cares about their child's future. Over the years, we have built relationships based on integrity, clear communication, and reliable support.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {parentTrustPoints.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-50 duration-200"
              >
                <div className="w-5 h-5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  <FaCheck />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-600 leading-snug">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 6. Capsule Call To Action (Banner) ═══ */}
        <section className="bg-gradient-to-r from-[#0a1f3f] via-[#0c2e60] to-[#0a1f3f] rounded-[30px] px-6 sm:px-10 md:px-12 py-8 sm:py-10 flex flex-col xl:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          {/* Left info */}
          <div className="text-center xl:text-left space-y-2 relative z-10 max-w-xl">
            <span className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest block">
              Ready to Take the First Step?
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#f9a825] tracking-tight italic leading-tight">
              START YOUR MBBS ADMISSION 2026-27 TODAY
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
              Book your FREE career counseling session today and receive personalized recommendations for the best medical universities in India and abroad.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-10">
            <a
              href="https://wa.me/916284063840"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold px-5 py-3.5 rounded-xl text-[11px] sm:text-[12px] flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <FaWhatsapp size={14} /> CHAT ON WHATSAPP
            </a>
            <a
              href="tel:012026111110"
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-extrabold px-4 py-2 sm:py-3.5 rounded-xl flex flex-col items-center justify-center shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="flex items-center gap-1.5 text-[11px] sm:text-[12px]">
                <FaPhoneAlt size={11} /> CALL NOW
              </span>
            </a>
            <Link
              href="/contact"
              className="bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black px-6 py-3.5 rounded-xl text-[11px] sm:text-[12px] flex items-center gap-2 shadow-md transition-all hover:-translate-y-0.5"
            >
              <FaEdit size={12} /> APPLY FOR ADMISSION
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
