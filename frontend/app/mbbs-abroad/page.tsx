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

/* ─── Detailed 6 Country Profiles ─── */
const countriesList = [
  {
    name: "Russia",
    code: "ru",
    slug: "russia",
    desc: "Russia has long been one of the most preferred destinations for Indian medical aspirants. Its government medical universities are known for their strong academic standards, experienced faculty, extensive clinical training, and modern teaching infrastructure.",
    whyChooseTitle: "Why Students Choose Russia",
    bullets: [
      "Government medical universities with a strong academic reputation",
      "Modern medical laboratories and research facilities",
      "Comprehensive clinical exposure in state hospitals",
      "Large international student community",
      "Affordable living costs in many cities",
      "Globally recognized medical education",
    ],
    color: "border-t-blue-500",
  },
  {
    name: "Georgia",
    code: "ge",
    slug: "georgia",
    desc: "Georgia has become one of the fastest-growing destinations for international medical education. Its universities follow European education standards, offer modern infrastructure, and provide a safe environment for international students.",
    whyChooseTitle: "Why Consider Georgia",
    bullets: [
      "European-style education system guidelines",
      "Modern classrooms and state-of-the-art laboratories",
      "Safe, welcoming, and scenic environment",
      "Internationally diverse student community",
      "Quality clinical training in affiliated clinics",
      "Strong emphasis on practical learning & OSCE",
    ],
    color: "border-t-red-500",
  },
  {
    name: "Kazakhstan",
    code: "kz",
    slug: "kazakhstan",
    desc: "Kazakhstan offers quality medical education with modern facilities and experienced faculty members. The country has become a preferred destination for Indian students seeking affordable medical education and practical clinical exposure.",
    whyChooseTitle: "Benefits of Studying in Kazakhstan",
    bullets: [
      "Affordable tuition and living expenses",
      "English-medium programs at many universities",
      "Modern laboratories and teaching hospitals",
      "Diverse international student community",
      "Comfortable hostel & accommodation facilities",
      "Supportive and encouraging learning environment",
    ],
    color: "border-t-cyan-500",
  },
  {
    name: "Uzbekistan",
    code: "uz",
    slug: "uzbekistan",
    desc: "Uzbekistan is gaining recognition among international students because of its improving medical education system, government-supported universities, and student-friendly environment.",
    whyChooseTitle: "Why Study in Uzbekistan",
    bullets: [
      "Government-supported medical universities",
      "Practical-oriented medical curriculum structure",
      "Modern campus facilities and classrooms",
      "Extremely affordable education plans",
      "Experienced teaching faculty & doctor lecturers",
      "Growing international recognition (NMC/WHO)",
    ],
    color: "border-t-emerald-500",
  },
  {
    name: "Kyrgyzstan",
    code: "kg",
    slug: "kyrgyzstan",
    desc: "Kyrgyzstan continues to attract Indian medical students due to its affordable education, internationally recognized universities, and experienced faculty. The country offers a welcoming atmosphere for international students.",
    whyChooseTitle: "Advantages of MBBS in Kyrgyzstan",
    bullets: [
      "Cost-effective medical education starting from low budgets",
      "English-medium courses at several universities",
      "Practical clinical exposure in city hospitals",
      "Friendly and warm environment for international students",
      "Experienced faculty members & Indian food messes",
      "Well-established Indian student community network",
    ],
    color: "border-t-red-600",
  },
  {
    name: "Nepal",
    code: "np",
    slug: "nepal",
    desc: "Nepal offers a familiar cultural environment, geographical proximity to India, and quality medical education. Many Indian students choose Nepal because of its convenient travel, similar lifestyle, and clinical similarities.",
    whyChooseTitle: "Why Choose Nepal",
    bullets: [
      "Close geographical proximity to India (no visa required)",
      "Similar cultural environment and food habits",
      "Practical hospital-based education (similar disease pattern)",
      "Experienced faculty (many trained in India)",
      "Comfortable transition for Indian students",
      "Well-established medical institutions & universities",
    ],
    color: "border-t-blue-700",
  },
];

/* ─── 10 Selection Criteria ─── */
const selectionCriteria = [
  "NEET Qualification Status",
  "12th Academic Performance",
  "Budget & Fee Structures",
  "Preferred Learning Environment",
  "Future Licensing Goals (FMGE/NExT)",
  "Long-term Career Plans",
  "Family Preferences",
  "University Reputation",
  "Campus Facilities",
  "Clinical Exposure Opportunities",
];

/* ─── 12 Support Pipeline Stages ─── */
const studentSupportServices = [
  "Personalized counseling",
  "University shortlisting",
  "Application processing",
  "Documentation assistance",
  "Admission confirmation",
  "Visa guidance",
  "Travel planning",
  "Airport pickup coordination",
  "Hostel assistance",
  "Pre-departure orientation",
  "Parent counseling",
  "Ongoing support after joining",
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
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Study MBBS Abroad
          </h1>
          <p className="text-[#3b82f6] font-extrabold text-sm sm:text-base tracking-wide">
            Pursue a Globally Recognized Medical Degree with Confidence
          </p>
          <p className="text-slate-350 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">
            For thousands of Indian students, studying MBBS abroad has become an excellent opportunity to achieve their dream of becoming a doctor. At Admission Anytime, we simplify the journey by helping you select top government medical colleges matching your academic profile, NEET scores, and financial plans.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-16 md:space-y-24 mt-12 sm:mt-16">

        {/* ═══ 2. Advantages Section ("Why Choose MBBS Abroad?") ═══ */}
        <section className="space-y-8">
          {/* Centered Title */}
          <div className="flex items-center justify-center gap-4">
            <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
            <div className="text-center">
              <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider">
                WHY CHOOSE MBBS ABROAD?
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Key Advantages for Medical Aspirants</p>
            </div>
            <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            {/* Left paragraph */}
            <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed text-center lg:text-left">
              <p>
                Studying medicine abroad is more than just earning a degree—it is an opportunity to gain international exposure, experience diverse healthcare systems, and build a strong foundation for a global medical career.
              </p>
              <p>
                Many internationally recognized universities offer English-medium MBBS programs, advanced laboratories, simulation centers, teaching hospitals, and experienced faculty members. Our role is to help you identify the destination that best matches your goals rather than promoting a one-size-fits-all solution.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-5 py-3 rounded-lg text-xs tracking-wider transition-colors shadow-md"
                >
                  Book Free Counseling <FaEdit />
                </Link>
              </div>
            </div>

            {/* Right advantages checklist */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
              {advantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 sm:gap-3 bg-slate-50/70 border border-slate-100 hover:border-[#3b82f6]/20 rounded-xl p-2.5 sm:p-3.5 transition-all duration-200 hover:scale-[1.02] group cursor-default"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center text-[9px] sm:text-[10px] flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <FaCheck />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#0c2e60] leading-tight">
                    {adv}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 3. Popular Countries section ═══ */}
        <section className="space-y-10">
          {/* Centered Title */}
          <div className="flex items-center justify-center gap-4">
            <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
            <div className="text-center">
              <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider">
                POPULAR COUNTRIES FOR MBBS ABROAD
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Compare World-Class Medical Universities</p>
            </div>
            <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          </div>

          <p className="text-center text-xs sm:text-sm font-semibold text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Admission Anytime provides admission guidance for reputed medical universities in several countries known for quality education and recognized medical programs.
          </p>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {countriesList.map((country, idx) => (
              <div
                key={idx}
                className={`bg-white border border-slate-200 border-t-[4px] ${country.color} rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group`}
              >
                <div className="space-y-4">
                  {/* Flag + Name Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                      <img
                        src={`https://flagcdn.com/w80/${country.code === "nepal" ? "np" : country.code}.png`}
                        alt={`${country.name} Flag`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#0c2e60] tracking-wide">
                      MBBS in {country.name}
                    </h3>
                  </div>

                  {/* Desc */}
                  <p className="text-[11px] sm:text-xs text-slate-500 font-semibold leading-relaxed">
                    {country.desc}
                  </p>

                  <div className="h-px bg-slate-100" />

                  {/* Bullet Points */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {country.whyChooseTitle}
                    </h4>
                    <ul className="space-y-2">
                      {country.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-[10px] sm:text-[11px] font-semibold text-[#0c2e60] leading-snug">
                          <span className="text-[#10b981] mt-0.5 flex-shrink-0">✔</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/mbbs-abroad/${country.slug}`}
                    className="w-full text-center block bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-2.5 rounded-lg text-xs tracking-wider transition-colors shadow-sm"
                  >
                    View Universities
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 4. How We Help Section ("How We Help You Choose the Right Country") ═══ */}
        <section className="space-y-8">
          {/* Centered Title */}
          <div className="flex items-center justify-center gap-4">
            <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
            <div className="text-center">
              <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider">
                HOW WE HELP YOU CHOOSE
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Factors We Evaluate For Your Success</p>
            </div>
            <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          </div>

          <p className="text-center text-xs sm:text-sm font-semibold text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Selecting the best country for MBBS is not simply about tuition fees. Every student has different aspirations, budget limits, and career licensing targets.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {selectionCriteria.map((c, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3.5 hover:shadow-md hover:border-slate-350 hover:-translate-y-1 transition-all duration-300 group cursor-default min-h-[100px]"
              >
                <div className="w-8 h-8 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center text-xs flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaStethoscope />
                </div>
                <h3 className="text-[10px] sm:text-[11px] font-black text-[#0c2e60] tracking-wide leading-snug">
                  {c}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 5. Student Support Section ("Beyond Admission") ═══ */}
        <section className="space-y-8">
          {/* Centered Title */}
          <div className="flex items-center justify-center gap-4">
            <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
            <div className="text-center">
              <h2 className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-[#0c2e60] uppercase tracking-wider">
                BEYOND ADMISSION - COMPLETE STUDENT SUPPORT
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Our Continuous Service Commitment</p>
            </div>
            <div className="hidden sm:block h-px bg-slate-200 flex-1 max-w-[180px]" />
          </div>

          <p className="text-center text-xs sm:text-sm font-semibold text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Admission Anytime believes that our responsibility does not end once a student receives an admission letter. We guide you at every stage of the international education journey.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {studentSupportServices.map((srv, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md hover:border-slate-350 hover:-translate-y-1 transition-all duration-300 group cursor-default min-h-[90px]"
              >
                <div className="w-7 h-7 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center text-[10px] flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaCheck />
                </div>
                <span className="text-[10px] sm:text-[11px] font-black text-[#0c2e60] tracking-wide leading-tight">
                  {srv}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 6. Closing CTA Section ═══ */}
        <section className="bg-gradient-to-r from-[#0a1f3f] via-[#0c2e60] to-[#0a1f3f] rounded-[30px] px-6 sm:px-10 md:px-12 py-8 sm:py-10 flex flex-col xl:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          {/* Left info */}
          <div className="text-center xl:text-left space-y-2 relative z-10 max-w-xl">
            <span className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest block">
              Build Your Medical Career with Confidence
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#f9a825] tracking-tight italic leading-tight">
              SCHEDULE YOUR FREE COUNSELING TODAY
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
              Discover the best MBBS opportunities tailored to your goals, budget, and future licensing plans. Contact our experienced counselors now.
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
              <FaEdit size={12} /> APPLY ONLINE NOW
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
