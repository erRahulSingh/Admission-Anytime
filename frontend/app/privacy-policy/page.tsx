import React from "react";
import { Metadata } from "next";
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaFileAlt,
  FaDatabase,
  FaUniversity,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Privacy Policy | Admission Anytime",
  description: "Read the official Privacy Policy of Admission Anytime. Understand how we collect, use, protect, and respect student and parent data in medical admissions.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-16 sm:pb-24">
      {/* ═══ ULTRA-PREMIUM HERO HEADER ═══ */}
      <div className="relative bg-gradient-to-r from-[#061730] via-[#0c2e60] to-[#061730] py-14 sm:py-20 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f9a825]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-[#f9a825] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <FaShieldAlt /> ISO 9001:2015 Certified Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Your trust is our priority. Learn how Admission Anytime protects student data, guarantees zero spam, and secures confidential medical admission documentation.
          </p>
          <div className="pt-2 text-[11px] font-bold text-slate-400">
            Last Updated: January 2026 • Official Document
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT CARD ═══ */}
      <div className="max-w-[1050px] mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white border border-slate-200/90 rounded-[2.2rem] shadow-2xl shadow-slate-900/10 p-6 sm:p-12 space-y-10">

          {/* Key Security Banner */}
          <div className="bg-gradient-to-r from-blue-50/80 via-emerald-50/50 to-amber-50/60 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0c2e60] text-[#f9a825] flex items-center justify-center text-xl flex-shrink-0 shadow-md">
                <FaUserShield />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0c2e60]">100% Confidential & Secure</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  We never sell, rent, or commercialize student databases to third-party telemarketers.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#16a34a] bg-white px-3.5 py-2 rounded-xl shadow-xs border border-green-100 flex-shrink-0">
              <FaCheckCircle /> Verified Privacy Compliance
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">

            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center text-sm font-black flex-shrink-0">
                  <FaLock />
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#0c2e60]">
                  1. Scope & Commitment to Privacy
                </h2>
              </div>
              <p>
                At <strong>Admission Anytime</strong>, we prioritize the confidentiality of students, parents, and guardians who engage with our medical admission counseling services. This policy details how personal information is collected, processed, and safeguarded when using our website, filling counseling query forms, or interacting with our senior medical advisors for MBBS admissions in India and abroad.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center text-sm font-black flex-shrink-0">
                  <FaFileAlt />
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#0c2e60]">
                  2. Information We Collect
                </h2>
              </div>
              <p>
                To provide accurate medical college eligibility guidance, cut-off evaluation, and fee estimates, we may collect:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
                  <span className="text-xs font-black text-[#0c2e60] block">Personal Identification</span>
                  <p className="text-[11px] text-slate-500">Student Name, Parent Name, Gender, State of Residence.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
                  <span className="text-xs font-black text-[#0c2e60] block">Contact Details</span>
                  <p className="text-[11px] text-slate-500">Mobile Number, Email Address, WhatsApp Number.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
                  <span className="text-xs font-black text-[#0c2e60] block">Academic Credentials</span>
                  <p className="text-[11px] text-slate-500">10th & 12th PCB Percentages, NEET Score & Qualifying Status.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
                  <span className="text-xs font-black text-[#0c2e60] block">Course Preferences</span>
                  <p className="text-[11px] text-slate-500">Preferred medical country (India/Abroad), Budget range.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center text-sm font-black flex-shrink-0">
                  <FaDatabase />
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#0c2e60]">
                  3. How We Use Student Data
                </h2>
              </div>
              <p>
                Collected information is utilized exclusively for educational counseling and university application facilitation:
              </p>
              <ul className="space-y-2 pt-1">
                {[
                  "Evaluating eligibility for NMC (National Medical Commission) & WHO-approved medical institutions.",
                  "Calculating personalized budget estimates, scholarship opportunities, and fee breakdowns.",
                  "Processing official university offer letters, invitation letters, apostille translation, and visa approvals.",
                  "Sending important counseling alerts, seat matrix updates, and NEET counseling schedules via SMS/Call/WhatsApp.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                    <FaCheckCircle className="text-[#16a34a] mt-0.5 flex-shrink-0 text-sm" />
                    <span className="font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] flex items-center justify-center text-sm font-black flex-shrink-0">
                  <FaUniversity />
                </div>
                <h2 className="text-base sm:text-lg font-black text-[#0c2e60]">
                  4. Data Security & Third-Party Sharing
                </h2>
              </div>
              <p>
                We enforce technical and organizational safeguards to ensure data integrity:
              </p>
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
                <p>• Document sharing is strictly confined to official university admission committees and embassy visa officers.</p>
                <p>• Student records are stored in encrypted cloud servers protected by firewall access protocols.</p>
                <p>• We do not rent, sell, or license databases to marketing agencies or commercial callers.</p>
              </div>
            </section>

            {/* Section 5: Contact Card */}
            <section className="pt-4 border-t border-slate-100">
              <div className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#0c2e60] rounded-2xl p-6 sm:p-8 text-white space-y-4 shadow-lg">
                <div>
                  <span className="text-[#f9a825] text-xs font-black uppercase tracking-widest block">Privacy Desk</span>
                  <h3 className="text-lg font-extrabold tracking-wide mt-1">Have Questions About Your Data?</h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    Reach out to our compliance officer to update your details or request record removal.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="mailto:info@admissionanytime.com"
                    className="inline-flex items-center gap-2 bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
                  >
                    <FaEnvelope /> info@admissionanytime.com
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black px-5 py-2.5 rounded-xl text-xs transition-colors"
                  >
                    <FaPhoneAlt /> +91 98765 43210
                  </a>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400 font-extrabold uppercase tracking-wider">
            © 2026 Admission Anytime Medical Consultancy. All Rights Reserved.
          </div>

        </div>
      </div>
    </div>
  );
}
