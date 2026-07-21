"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaFileAlt,
  FaLock,
  FaWhatsapp,
  FaCheckCircle,
  FaChevronDown,
  FaStar,
  FaUsers,
  FaGraduationCap,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";
import api from "@/services/api";

/* ─── Zod Schema ─── */
const leadSchema = z.object({
  fullName: z.string().min(2, "Full Name required"),
  phone: z.string().min(1, "Phone number required"),
  email: z.string().email("Valid email required"),
});
type LeadFormValues = z.infer<typeof leadSchema>;

/* ─── Static Data ─── */
const features = [
  "25+ Years Experience",
  "No Hidden Charges",
  "25,000+ Students Guided",
  "Complete Support Till Joining",
  "100% Admission Assistance",
  "FMGE / NExT Guidance",
];

const flagCountries = [
  { code: "ru", name: "RUSSIA" },
  { code: "ge", name: "GEORGIA" },
  { code: "kz", name: "KAZAKHSTAN" },
  { code: "uz", name: "UZBEKISTAN" },
  { code: "kg", name: "KYRGYZSTAN" },
  { code: "np", name: "NEPAL" },
  { code: "am", name: "ARMENIA" },
  { code: "ph", name: "PHILIPPINES" },
  { code: "eg", name: "EGYPT" },
];

const stats = [
  { value: "25+", label: "YEARS EXPERIENCE", icon: <FaStar /> },
  { value: "25,000+", label: "STUDENTS GUIDED", icon: <FaUsers /> },
  { value: "500+", label: "MEDICAL COLLEGES", icon: <FaGraduationCap /> },
  { value: "100%", label: "ADMISSION ASSISTANCE", icon: <FaShieldAlt /> },
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
    defaultValues: { fullName: "", phone: "", email: "" },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/admissions", {
        ...data,
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

  return (
    <section className="relative w-full flex flex-col">
      {/* ═══ HERO AREA ═══ */}
      <div className="relative w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
            style={{
              backgroundImage: "url('/hero_bg.png')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e8f0fe]/90 via-[#eaf1fd]/85 to-[#e8f0fe]/90 lg:from-[#e8f0fe]/92 lg:via-[#eaf1fd]/35 lg:to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center pt-5 pb-6 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-8">

            {/* ──── LEFT: Text + CTA ──── */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">

              {/* ISO Certified Badge */}
              <div className="relative inline-flex items-center pl-4 select-none">
                <div className="absolute left-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#ff5200] to-[#ff7300] rounded-full flex items-center justify-center shadow-md border-2 border-white z-10">
                  <FaGraduationCap className="text-white text-[10px] sm:text-xs" />
                </div>
                <div className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#165a9e] text-white text-[8px] sm:text-[10px] font-black uppercase tracking-wider pl-5 sm:pl-6 pr-3.5 sm:pr-4 py-1 sm:py-1.5 rounded-full shadow-sm">
                  ISO 9001:2015 CERTIFIED CONSULTANTS
                </div>
              </div>

              <div className="flex flex-row items-center justify-between gap-2">
                <div className="space-y-2 sm:space-y-3 flex-1">
                  {/* Heading */}
                  <div className="space-y-0 leading-none">
                    <h1 className="text-[24px] sm:text-[36px] md:text-[44px] lg:text-[50px] xl:text-[56px] font-black text-[#0c2e60] tracking-tight leading-[1.05]">
                      MBBS ADMISSION
                    </h1>
                    <p className="text-[32px] sm:text-[46px] md:text-[58px] lg:text-[66px] xl:text-[74px] font-black text-[#d32f2f] tracking-tight leading-[1]">
                      2026-27
                    </p>
                    <h2 className="text-[22px] sm:text-[34px] md:text-[42px] lg:text-[48px] xl:text-[54px] font-black text-[#0c2e60] tracking-tight leading-[1.05]">
                      INDIA & ABROAD
                    </h2>
                  </div>

                  {/* Subtitle tag without background */}
                  <p className="text-[#d97706] font-extrabold text-[10px] sm:text-[13px] md:text-[14px] tracking-wide italic">
                    YOUR DREAM OF BECOMING A DOCTOR STARTS HERE
                  </p>
                </div>

                {/* Doctor Image for Mobile & Tablet (< xl) */}
                <div className="xl:hidden w-36 sm:w-52 md:w-64 lg:w-72 flex-shrink-0 pointer-events-none self-end">
                  <img src="/hero_doctor.png" alt="Smiling Doctor" className="w-full h-auto object-contain max-h-[230px] sm:max-h-[300px] md:max-h-[360px] drop-shadow-xl" />
                </div>
              </div>

              {/* Top 2 Professional Highlights */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 pt-1 text-[11px] sm:text-[12px] font-bold text-[#0c2e60]">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#16a34a] text-sm flex-shrink-0" />
                  <span>Zero Donation / Pay Direct Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#16a34a] text-sm flex-shrink-0" />
                  <span>NMC Guideline Compliant Universities</span>
                </div>
              </div>

              {/* Country Flag Pills */}
              <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-[9px] sm:text-[10px] font-extrabold text-[#0c2e60]">
                {flagCountries.slice(0, 6).map((c) => (
                  <span key={c.name} className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                      <img src={`https://flagcdn.com/w80/${c.code === "NEPAL" ? "np" : c.code}.png`} alt={`${c.name} Flag`} className="w-full h-full object-cover" />
                    </div>
                    <span>{c.name}</span>
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-row flex-wrap gap-2 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-[12px] shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <FaUser size={11} /> FREE COUNSELING
                </button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-[12px] shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5"
                >
                  <FaWhatsapp size={13} /> WHATSAPP
                </a>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="hidden sm:inline-flex items-center justify-center gap-1.5 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 sm:px-5 py-3 rounded-xl text-[11px] sm:text-[12px] shadow-lg shadow-[#0c2e60]/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <FaPhoneAlt size={11} /> REQUEST CALLBACK
                </button>
              </div>
            </div>

            {/* ──── DOCTOR (XL only float) ──── */}
            <div className="hidden xl:block absolute bottom-0 right-[25%] w-[520px] h-[120%] pointer-events-none z-[5]">
              <style>{`
                @keyframes floatHeroDoctor {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
                .hero-doc-float {
                  animation: floatHeroDoctor 6s ease-in-out infinite;
                }
              `}</style>
              <img src="/hero_doctor.png" alt="Smiling Doctor" className="w-full h-full object-contain object-bottom drop-shadow-2xl hero-doc-float" />
            </div>

            {/* ──── RIGHT: Form (Hidden on mobile < lg for maximum clean space) ──── */}
            <div id="free-counseling-form" className="hidden lg:block lg:col-span-4 relative z-20">
              <div className="w-full max-w-[310px] mx-auto bg-white/85 backdrop-blur-md border border-white/80 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/15">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#0c2e60] py-3.5 text-center">
                  <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest block">GET FREE</span>
                  <h3 className="text-[17px] font-black text-[#f9a825] tracking-wide mt-0.5 italic">CAREER COUNSELING</h3>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">
                  {success ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-14 h-14 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xl mx-auto shadow-lg"><FaCheckCircle /></div>
                      <h4 className="text-base font-black text-[#0c2e60]">Request Submitted!</h4>
                      <p className="text-xs text-slate-500">A counselor will contact you shortly.</p>
                      <button onClick={() => setSuccess(false)} className="bg-[#f9a825] text-[#0c2e60] font-black py-2 px-5 rounded-lg text-xs">Submit New</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                      {/* Full Name */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none"><FaUser size={12} /></span>
                        <input type="text" placeholder="Full Name *" {...register("fullName")} className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${errors.fullName ? "border-red-400" : "border-slate-200"}`} />
                      </div>

                      {/* Mobile */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none"><FaPhoneAlt size={12} /></span>
                        <input type="text" placeholder="Mobile Number *" {...register("phone")} className={`w-full bg-slate-50 border rounded-lg pl-9 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${errors.phone ? "border-red-400" : "border-slate-200"}`} />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none"><FaEnvelope size={12} /></span>
                        <input type="email" placeholder="Email Address *" {...register("email")} className={`w-full bg-slate-50 border rounded-lg pl-9 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${errors.email ? "border-red-400" : "border-slate-200"}`} />
                      </div>

                      {errorMsg && <p className="text-[10px] text-red-500 font-bold text-center">{errorMsg}</p>}

                      <button type="submit" disabled={loading} className="w-full bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-3 rounded-xl text-[13px] tracking-wider shadow-md active:scale-95 transition-all disabled:opacity-50">
                        {loading ? "PROCESSING..." : "SUBMIT NOW"}
                      </button>

                      <p className="text-[9px] text-slate-400 text-center flex items-center justify-center gap-1">
                        <FaLock size={8} /> Your information is safe with us
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STATS BAR — attached at bottom of hero ═══ */}
      <div className="relative z-20 bg-gradient-to-r from-[#071838] via-[#0c2e60] to-[#071838] border-t border-[#f9a825]/20 py-4 sm:py-5 shadow-2xl">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.05] backdrop-blur-xs border border-white/10 hover:border-[#f9a825]/40 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 sm:gap-4 transition-all duration-300 group hover:-translate-y-0.5 shadow-sm"
            >
              {/* Modern Rounded Icon Badge */}
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

      {/* ═══ POP-UP CAREER COUNSELING MODAL CARD ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-[2px] animate-fade-in">
          {/* Backdrop overlay click */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

          {/* Modal Card Box */}
          <div className="relative z-10 w-full max-w-[310px] sm:max-w-[330px] max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl shadow-2xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#0c2e60] px-6 py-4 flex justify-between items-center">
              <div>
                <span className="text-[#f9a825] text-[10px] font-extrabold uppercase tracking-widest block">Get Free Guidance</span>
                <h3 className="text-white text-base font-extrabold tracking-wide mt-0.5">Career Counseling Form</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 bg-white/85">
              {success ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-14 h-14 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xl mx-auto shadow-lg">
                    <FaCheckCircle />
                  </div>
                  <h4 className="text-base font-black text-[#0c2e60]">Request Submitted!</h4>
                  <p className="text-xs text-slate-500">A counselor will contact you shortly.</p>
                  <button
                    type="button"
                    onClick={() => { setSuccess(false); setIsModalOpen(false); }}
                    className="bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-2.5 px-6 rounded-xl text-xs shadow-md transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                  {/* Full Name */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <FaUser size={12} />
                    </span>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      {...register("fullName")}
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-3 text-[12px] font-medium text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${errors.fullName ? "border-red-400" : "border-slate-200"
                        }`}
                    />
                  </div>

                  {/* Mobile */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <FaPhoneAlt size={12} />
                    </span>
                    <input
                      type="text"
                      placeholder="Mobile Number *"
                      {...register("phone")}
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-3 text-[12px] font-medium text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${errors.phone ? "border-red-400" : "border-slate-200"
                        }`}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <FaEnvelope size={12} />
                    </span>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      {...register("email")}
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-3 text-[12px] font-medium text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${errors.email ? "border-red-400" : "border-slate-200"
                        }`}
                    />
                  </div>

                  {errorMsg && <p className="text-[10px] text-red-500 font-bold text-center">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-3.5 rounded-xl text-[13px] tracking-wider shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? "PROCESSING..." : "SUBMIT NOW"}
                  </button>

                  <p className="text-[9px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                    <FaLock size={8} /> Your information is safe with us
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
