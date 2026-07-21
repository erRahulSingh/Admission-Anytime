"use client";

import React from "react";
import {
  FaBullseye,
  FaGlobe,
  FaUserCheck,
  FaStethoscope,
  FaFileInvoiceDollar,
  FaUniversity,
  FaClipboardCheck,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-[#f8fafc] via-[#edf4fe] to-[#f1f5f9] min-h-screen py-6 sm:py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 space-y-8 sm:space-y-16">
        
        {/* ─── Page Header / Hero Banner ─── */}
        <div className="relative bg-[#0c2e60] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-14 shadow-2xl overflow-hidden">
          {/* Decorative Gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#f9a825]/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            {/* Header Text */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4 text-left">
              <span className="inline-block bg-[#f9a825] text-text-dark font-black text-[9px] sm:text-[11px] px-3 py-1.5 tracking-wider uppercase rounded-md shadow-sm">
                25+ Years of Trust & Transparency
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                ABOUT <span className="text-[#f9a825]">ADMISSION ANYTIME</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base font-semibold max-w-2xl leading-relaxed">
                Your Trusted Partner for MBBS Admission in India & Abroad. We are dedicated to helping every aspiring medical student secure a seat with complete clarity and confidence.
              </p>
            </div>
            
            {/* Quick Badges */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-black text-[#f9a825]">25k+</span>
                <span className="block text-[9px] font-bold text-slate-300 uppercase tracking-wider mt-1">Students Assisted</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-black text-[#f9a825]">25+</span>
                <span className="block text-[9px] font-bold text-slate-300 uppercase tracking-wider mt-1">Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Detailed Intro Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#f9a825] rounded-full"></span>
              <h2 className="text-[20px] sm:text-[24px] md:text-[28px] font-black text-[#0c2e60] tracking-tight uppercase leading-snug">
                Your Future in Medicine Starts Here
              </h2>
            </div>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
              Choosing the right medical college is one of the biggest decisions in a student's academic journey. It influences not only the quality of education but also future career opportunities, licensing, specialization, and global recognition. At **Admission Anytime**, we understand the significance of this decision and are committed to helping every aspiring doctor make the right choice with confidence.
            </p>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
              Our philosophy is simple—provide genuine guidance, maintain complete transparency, and support students at every stage of their medical education journey. Unlike agencies that focus solely on admissions, we focus on building successful medical careers.
            </p>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
              Whether your dream is to study at elite Indian institutions like **AIIMS, JIPMER, BHU, or AMU**, or pursue an MBBS degree in global hubs like **Russia, Georgia, Kazakhstan, Uzbekistan, Kyrgyzstan, or Nepal**, Admission Anytime ensures you receive ethical, personalized advice tailored to your merit and budget—not sales targets.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Visual Glassmorphic Info Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-primary-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#e8f0fe] rounded-bl-full -z-10"></div>
              <h3 className="text-lg font-black text-[#0c2e60] mb-4 flex items-center gap-2">
                <FaStar className="text-[#f9a825]" /> Why Parents Trust Us
              </h3>
              
              <div className="space-y-4">
                {[
                  "Complete counseling matching NEET & budget",
                  "Direct partnerships with globally listed universities",
                  "100% genuine information & transparent fee details",
                  "Dedicated guidance from application to hostel joining",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <FaCheckCircle className="text-[#16a34a] text-sm mt-0.5 flex-shrink-0" />
                    <p className="text-xs font-bold text-slate-700 leading-snug">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-2xl font-black text-[#0c2e60]">100%</span>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ethical Advice</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 text-lg font-bold">
                  🩺
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Mission & Vision (Premium Top-Border Cards) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-t-4 border-t-[#f9a825] border-x border-b border-slate-100 shadow-xl space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-slate-100/50 text-7xl font-black select-none pointer-events-none tracking-wider">MISSION</div>
            <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center text-xl">
              <FaBullseye className="text-xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#0c2e60] relative z-10 tracking-wide uppercase">Our Mission</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed relative z-10">
              Our mission is to make quality medical education accessible by providing transparent, ethical, and student-focused admission guidance. We aim to simplify the complex admission process while empowering students to make informed decisions about their future.
            </p>
            <p className="text-xs text-text-muted leading-relaxed relative z-10">
              Every recommendation we provide is based on a careful assessment of academic performance, NEET qualification, financial considerations, and long-term career objectives. Our goal is not merely to secure admissions but to help students begin successful careers in medicine.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-t-4 border-t-[#0c2e60] border-x border-b border-slate-100 shadow-xl space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-slate-100/50 text-7xl font-black select-none pointer-events-none tracking-wider">VISION</div>
            <div className="w-12 h-12 bg-primary-50 text-[#0c2e60] rounded-2xl flex items-center justify-center text-xl">
              <FaGlobe className="text-xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#0c2e60] relative z-10 tracking-wide uppercase">Our Vision</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed relative z-10">
              We envision becoming India's most trusted and respected medical education consultancy by setting the highest standards of professionalism, integrity, and student success.
            </p>
            <p className="text-xs text-text-muted leading-relaxed relative z-10">
              Through continuous innovation, expert counseling, and global partnerships, we aspire to connect talented students with world-class medical education opportunities that prepare them to become skilled healthcare professionals serving communities worldwide.
            </p>
          </div>
        </div>

        {/* ─── Differentiator Panel ─── */}
        <div className="bg-[#0c2e60] text-white rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          
          <div className="lg:col-span-7 space-y-4 relative z-10">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#f9a825] bg-white/5 border border-[#f9a825]/30 px-3 py-1 rounded-full">
              What Makes Us Different?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              We Deliver Trust, Transparency & Long-term Success
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Many admission consultancies promise admissions. We focus on delivering trust, transparency, and long-term student success. Our counselors understand that every student's journey is unique. Instead of offering one-size-fits-all recommendations, we take the time to understand your goals and provide personalized solutions that align with your academic profile and financial preferences.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Our support extends far beyond counseling. We guide students through documentation, university applications, visa procedures, travel planning, hostel arrangements, and even post-arrival assistance.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3 relative z-10">
            {[
              { title: "No One-Size-Fits-All", desc: "Customized to your specific credentials & budget" },
              { title: "Visa & Travel Done Right", desc: "100% visa success rate with complete clearance" },
              { title: "Complete Documentation", desc: "Verified applications & zero processing delays" },
              { title: "Post-Arrival Support", desc: "We guide you even after you reach university" }
            ].map((d, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center space-y-1.5 backdrop-blur-md hover:bg-white/10 transition-colors">
                <span className="font-extrabold text-[11px] text-[#f9a825] tracking-wide uppercase">{d.title}</span>
                <span className="text-[10px] text-slate-300 leading-snug">{d.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Trust Pillars Section ─── */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-[#0c2e60] tracking-tight uppercase">
              Why Students & Parents Trust Us
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-semibold">
              Our values, experience, and commitment to transparency define us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Experienced Admission Experts */}
            <div className="bg-white border border-slate-100 hover:border-slate-200 p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                  <FaUserCheck className="text-lg" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Experienced Admission Experts</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Our counseling team possesses extensive knowledge of medical admission procedures, eligibility requirements, university selection, documentation, and international education systems. Students receive practical guidance based on years of industry experience and up-to-date admission information.
                </p>
              </div>
            </div>

            {/* Card 2: Student-Centric Counseling */}
            <div className="bg-white border border-slate-100 hover:border-slate-200 p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                  <FaStethoscope className="text-lg" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Student-Centric Guidance</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Instead of recommending the same colleges to everyone, we analyze key personalized factors:
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1 text-[10px] font-black text-slate-700">
                <span className="flex items-center gap-1.5"><span className="text-[#16a34a]">✔</span> NEET Score</span>
                <span className="flex items-center gap-1.5"><span className="text-[#16a34a]">✔</span> Academics</span>
                <span className="flex items-center gap-1.5"><span className="text-[#16a34a]">✔</span> Budget</span>
                <span className="flex items-center gap-1.5"><span className="text-[#16a34a]">✔</span> Country</span>
                <span className="flex items-center gap-1.5"><span className="text-[#16a34a]">✔</span> Language</span>
                <span className="flex items-center gap-1.5"><span className="text-[#16a34a]">✔</span> Career Plan</span>
              </div>
            </div>

            {/* Card 3: Complete Transparency */}
            <div className="bg-white border border-slate-100 hover:border-slate-200 p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                  <FaFileInvoiceDollar className="text-lg" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Complete Transparency</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Before starting, we clearly verify and explain tuition fees, hostel charges, living expenses, visa costs, travel requirements, and the payment schedule. We believe informed students make better decisions.
                </p>
              </div>
            </div>

            {/* Card 4: Extensive University Network */}
            <div className="bg-white border border-slate-100 hover:border-slate-200 p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 lg:col-span-1">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                  <FaUniversity className="text-lg" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Extensive College Network</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  We collaborate with a wide network of reputed medical institutions across India and internationally. Students gain access to universities offering modern infrastructure, experienced faculty, advanced laboratories, clinical training, and international recognition.
                </p>
              </div>
            </div>

            {/* Card 5: Dedicated Documentation Assistance */}
            <div className="bg-white border border-slate-100 hover:border-slate-200 p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 lg:col-span-2">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg">
                  <FaClipboardCheck className="text-lg" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[#0c2e60] uppercase tracking-wider">Dedicated Documentation Assistance</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Our documentation specialists assist students with academic certificates, passport guidance, application forms, invitation letters, admission letters, medical certificates, visa documentation, and university verification. Our systematic approach minimizes delays and ensures timely submission.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
