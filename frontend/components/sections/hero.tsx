"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaWhatsapp,
  FaCheckCircle,
  FaStar,
  FaUsers,
  FaGraduationCap,
  FaShieldAlt,
  FaTimes,
  FaUniversity,
  FaBuilding,
  FaGlobe,
  FaUserTie,
  FaClipboardList,
  FaChevronDown,
} from "react-icons/fa";
import api from "@/services/api";

/* ─── Zod Schema (Single Step: Name, Phone, Email) ─── */
const leadSchema = z.object({
  fullName: z.string().min(2, "Full Name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
});
type LeadFormValues = z.infer<typeof leadSchema>;

/* ─── Static Data ─── */
const trustBadges = [
  "NEET UG Counselling Assistance",
  "MCC & State Counselling Support",
  "NMC Guidelines Based Guidance",
  "India & Abroad MBBS Experts",
];

const highlightBoxes = [
  { label: "Government Medical Colleges", icon: <FaUniversity /> },
  { label: "Private Medical Colleges", icon: <FaBuilding /> },
  { label: "Deemed Universities", icon: <FaGraduationCap /> },
  { label: "NRI Quota Guidance", icon: <FaUserTie /> },
  { label: "Management Quota Guidance", icon: <FaClipboardList /> },
  { label: "MBBS Abroad", icon: <FaGlobe /> },
];

const flagCountries = [
  { code: "ge", name: "GEORGIA" },
  { code: "ru", name: "RUSSIA" },
  { code: "kz", name: "KAZAKHSTAN" },
  { code: "uz", name: "UZBEKISTAN" },
  { code: "kg", name: "KYRGYZSTAN" },
  { code: "am", name: "ARMENIA" },
  { code: "tj", name: "TAJIKISTAN" },
];

const stats = [
  { value: "25+", label: "YEARS EXPERIENCE", icon: <FaStar /> },
  { value: "25,000+", label: "STUDENTS GUIDED", icon: <FaUsers /> },
  { value: "500+", label: "MEDICAL COLLEGES", icon: <FaGraduationCap /> },
  { value: "100%", label: "ADMISSION ASSISTANCE", icon: <FaShieldAlt /> },
];

const descriptionBullets = [
  "NEET UG Counselling Support",
  "MCC Counselling",
  "State Counselling",
  "NRI Quota Guidance",
  "Management Quota Guidance",
  "Deemed Universities",
  "Government & Private Medical Colleges",
  "MBBS Abroad (NMC Compliant Universities)",
];

export default function HeroSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/admissions", {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        neetScore: 0,
        interestedIn: "Both",
        country: "India & Abroad",
        source: "Website",
      });
      setSuccess(true);
      reset();
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Single Step Form UI ─── */
  const renderForm = (isDesktop: boolean) => {
    if (success) {
      return (
        <div className="py-7 px-2 text-center space-y-3.5 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#16a34a] to-[#22c55e] text-white rounded-full flex items-center justify-center text-2xl mx-auto shadow-lg shadow-green-500/20">
            <FaCheckCircle />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-black text-[#0c2e60]">
              Form Submitted Successfully! 🎉
            </h4>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              Thank you for contacting Admission Anytime. Our Senior MBBS Admission Counselor will call you very soon!
            </p>
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              if (!isDesktop) setIsModalOpen(false);
            }}
            className="mt-2 bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-2.5 px-6 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {isDesktop ? "Submit New Inquiry" : "Close Window"}
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Full Name */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FaUser size={12} />
          </span>
          <input
            type="text"
            placeholder="Full Name *"
            {...register("fullName")}
            className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${
              errors.fullName ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.fullName && (
            <p className="text-[9px] text-red-500 mt-0.5 pl-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FaPhoneAlt size={12} />
          </span>
          <input
            type="tel"
            placeholder="Mobile Number *"
            {...register("phone")}
            className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${
              errors.phone ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.phone && (
            <p className="text-[9px] text-red-500 mt-0.5 pl-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FaEnvelope size={12} />
          </span>
          <input
            type="email"
            placeholder="Email Address *"
            {...register("email")}
            className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${
              errors.email ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.email && (
            <p className="text-[9px] text-red-500 mt-0.5 pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {errorMsg && (
          <p className="text-[10px] text-red-500 font-bold text-center">
            {errorMsg}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-3 rounded-xl text-[12px] tracking-wider shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? "PROCESSING..." : "SUBMIT NOW"}
        </button>

        <p className="text-[9px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
          <FaLock size={8} /> Your information is safe with us
        </p>
      </form>
    );
  };

  return (
    <section className="relative w-full flex flex-col">
      {/* ═══ HERO AREA ═══ */}
      <div className="relative w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
            style={{ backgroundImage: "url('/hero_bg.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e8f0fe]/90 via-[#eaf1fd]/85 to-[#e8f0fe]/90 lg:from-[#e8f0fe]/92 lg:via-[#eaf1fd]/35 lg:to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start pt-5 pb-6 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-8">
            {/* ──── LEFT: Text + CTA ──── */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4 relative z-[10]">
              {/* Trust Badge - Desktop only */}
              <div className="hidden sm:inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-full px-4 py-1.5 shadow-sm">
                <FaCheckCircle className="text-[#1976d2] text-sm" />
                <span className="text-[12px] font-bold text-[#1a1a2e]">India&apos;s Most Trusted MBBS Admission Platform</span>
              </div>

              <div className="flex flex-row items-center justify-between gap-2">
                <div className="space-y-2 sm:space-y-3 flex-1">
                  {/* H1 Heading */}
                  <div className="space-y-0 leading-none">
                    <h1 className="text-[24px] sm:text-[36px] md:text-[44px] lg:text-[50px] xl:text-[56px] font-black text-[#0c2e60] tracking-tight leading-[1.05]">
                      MBBS ADMISSION
                    </h1>
                    <p className="text-[32px] sm:text-[46px] md:text-[58px] lg:text-[66px] xl:text-[74px] font-black tracking-tight leading-[1] text-transparent bg-clip-text bg-gradient-to-r from-[#c62828] via-[#d32f2f] to-[#e65100]">
                      2026-27
                    </p>
                    <p className="text-[22px] sm:text-[34px] md:text-[42px] lg:text-[48px] xl:text-[54px] font-black text-[#0c2e60] tracking-tight leading-[1.05]">
                      INDIA & ABROAD
                    </p>
                  </div>

                  {/* Sub Heading - Hidden on mobile */}
                  <p className="hidden sm:block text-[#d97706] font-extrabold text-[13px] md:text-[14px] tracking-wide">
                    Expert NEET UG Counselling | NMC Guidelines | MCC & State
                    Counselling Assistance
                  </p>
                </div>

                {/* Doctor Image for Mobile & Tablet (< xl) */}
                <div className="xl:hidden w-32 sm:w-52 md:w-64 lg:w-72 flex-shrink-0 pointer-events-none self-end">
                  <img
                    src="/hero_doctor.png"
                    alt="MBBS Admission Counsellor"
                    className="w-full h-auto object-contain max-h-[200px] sm:max-h-[300px] md:max-h-[360px] drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Description - Hidden on mobile */}
              <p className="hidden sm:block text-[11px] sm:text-[12px] md:text-[13px] text-slate-600 font-semibold leading-relaxed max-w-[600px]">
                We make your MBBS journey smooth and successful with
                personalized guidance and end-to-end support.
              </p>

              {/* Service Tags - Hidden on mobile */}
              <div className="hidden sm:flex flex-wrap gap-2.5 max-w-[650px]">
                {[
                  "NEET UG\nCounselling",
                  "MCC & State\nCounselling",
                  "NRI Quota\nGuidance",
                  "Deemed\nUniversities",
                  "MBBS Abroad\n(MCC Compliant)",
                ].map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 bg-white/60 border border-slate-200/80 rounded-xl px-3.5 py-2 text-[10px] sm:text-[11px] font-bold text-[#0c2e60]"
                  >
                    <FaCheckCircle className="text-[#0c2e60] text-[11px] flex-shrink-0" />
                    <span className="whitespace-pre-line leading-tight">{tag}</span>
                  </div>
                ))}
              </div>

              {/* Country Flag Pills */}
              <div className="flex flex-wrap gap-x-1.5 gap-y-1.5 text-[9px] sm:text-[10px] font-extrabold text-[#0c2e60]">
                {flagCountries.map((c, i) => (
                  <span
                    key={c.name}
                    className={`flex items-center gap-1.5 bg-white/80 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs ${i >= 5 ? "sm:hidden" : ""}`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={`https://flagcdn.com/w80/${c.code}.png`}
                        alt={`${c.name} Flag`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{c.name}</span>
                  </span>
                ))}
                {/* MORE button - Desktop only */}
                <button
                  type="button"
                  className="hidden sm:flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs text-[10px] font-extrabold text-[#0c2e60] cursor-pointer hover:bg-white transition-colors"
                >
                  MORE <FaChevronDown size={8} />
                </button>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-row flex-wrap gap-2 sm:gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-black px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] tracking-wide shadow-md shadow-green-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <FaUser size={10} /> FREE CAREER COUNSELLING
                </button>
                <a
                  href="https://wa.me/916284063840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#25D366] sm:bg-[#f57c00] hover:bg-[#128C7E] sm:hover:bg-[#e65100] text-white font-black px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] tracking-wide shadow-md shadow-green-600/20 sm:shadow-orange-600/20 transition-all hover:-translate-y-0.5"
                >
                  <FaWhatsapp size={12} /> WHATSAPP EXPERT
                </a>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="hidden sm:inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-[#0c2e60] font-black px-4 sm:px-4.5 py-2 rounded-full text-[10px] sm:text-[11px] tracking-wide border-2 border-[#0c2e60] shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <FaPhoneAlt size={10} /> REQUEST CALL BACK
                </button>
              </div>
            </div>

            {/* ──── DOCTOR (XL only float) ──── */}
            <div className="hidden xl:block absolute bottom-0 right-[22%] w-[440px] h-[120%] pointer-events-none z-[5]">
              <style>{`
                @keyframes floatHeroDoctor {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
                .hero-doc-float {
                  animation: floatHeroDoctor 6s ease-in-out infinite;
                }
              `}</style>
              <img
                src="/hero_doctor.png"
                alt="MBBS Admission Counsellor"
                className="w-full h-full object-contain object-bottom drop-shadow-2xl hero-doc-float"
              />
            </div>

            {/* ──── RIGHT: Single Step Lead Form ──── */}
            <div
              id="free-counseling-form"
              className="hidden lg:block lg:col-span-4 relative z-20"
            >
              <div className="w-full max-w-[310px] mx-auto bg-white/85 backdrop-blur-md border border-white/80 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/15">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#0c2e60] py-3.5 text-center">
                  <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest block">
                    GET FREE
                  </span>
                  <h3 className="text-[17px] font-black text-[#f9a825] tracking-wide mt-0.5 italic">
                    MBBS COUNSELLING
                  </h3>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">{renderForm(true)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TRUST BADGES BAR — Hidden on Mobile ═══ */}
      <div className="hidden sm:block relative z-20 bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#0c2e60] border-t border-white/10 py-3 sm:py-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-x-10">
          {trustBadges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-white/90"
            >
              <FaCheckCircle className="text-[#f9a825] text-[11px] flex-shrink-0" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HIGHLIGHT BOXES — Hidden on Mobile ═══ */}
      <div className="hidden sm:block relative z-20 bg-[#07132b] sm:bg-gradient-to-r sm:from-[#071838] sm:via-[#0c2e60] sm:to-[#071838] border-t border-[#f9a825]/30 py-4 sm:py-6 shadow-2xl">
        <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-4">
          {highlightBoxes.map((box) => (
            <div
              key={box.label}
              className="bg-[#0b1b36] border border-[#f9a825]/40 hover:border-[#f9a825] rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 group hover:-translate-y-0.5 shadow-md min-h-[95px] sm:min-h-[105px]"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f9a825]/10 border border-[#f9a825]/50 flex items-center justify-center text-[#f9a825] text-base sm:text-lg flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {box.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] font-extrabold text-[#f9a825] tracking-wider uppercase leading-tight text-center">
                {box.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <div className="relative z-20 bg-gradient-to-r from-[#071838] via-[#0a2245] to-[#071838] border-t border-white/5 py-4 sm:py-5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.05] backdrop-blur-xs border border-white/10 hover:border-[#f9a825]/40 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 sm:gap-4 transition-all duration-300 group hover:-translate-y-0.5 shadow-sm"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#f9a825]/25 to-[#f9a825]/5 border border-[#f9a825]/50 flex items-center justify-center text-[#f9a825] text-base sm:text-lg flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[20px] sm:text-[24px] md:text-[26px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 leading-none block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[8px] sm:text-[9px] font-extrabold text-[#f9a825]/90 tracking-wider block mt-1 uppercase truncate">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ POP-UP COUNSELING MODAL ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-[2px] animate-fade-in">
          {/* Backdrop overlay click */}
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Card Box */}
          <div className="relative z-10 w-full max-w-[340px] sm:max-w-[370px] max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#0c2e60] px-6 py-4 flex justify-between items-center">
              <div>
                <span className="text-[#f9a825] text-[10px] font-extrabold uppercase tracking-widest block">
                  Get Free Guidance
                </span>
                <h3 className="text-white text-base font-extrabold tracking-wide mt-0.5">
                  MBBS Counselling Form
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 bg-white/85">{renderForm(false)}</div>

            {/* Modal Disclaimer */}
            <div className="px-5 pb-4">
              <p className="text-[8px] text-slate-400 text-center leading-relaxed font-medium">
                Admissions are processed only through NEET eligibility and
                official counselling procedures as applicable. We provide
                counselling and admission guidance in accordance with prevailing
                NMC, MCC and State Counselling regulations.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
