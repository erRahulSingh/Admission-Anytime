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
} from "react-icons/fa";
import api from "@/services/api";

/* ─── Zod Schema ─── */
const leadSchema = z.object({
  fullName: z.string().min(3, "Full Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^\d{10}$/, "10 digit number required"),
  neetScore: z.number({ invalid_type_error: "Number required" }).min(0).max(720),
  interestedIn: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { interestedIn: "", country: "" },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/admissions", { ...data, source: "Website" });
      setSuccess(true);
      reset();
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full flex flex-col" style={{ minHeight: "calc(100vh - 76px)" }}>
      {/* ═══ HERO AREA ═══ */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1600&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e8f0fe]/[0.97] via-[#eaf1fd]/90 to-white/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center py-6 sm:py-8 lg:py-10">

            {/* ──── LEFT: Text + CTA ──── */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              {/* Heading */}
              <div className="space-y-0 leading-none">
                <h1 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] xl:text-[56px] font-black text-[#0c2e60] tracking-tight leading-[1.05]">
                  MBBS ADMISSION
                </h1>
                <p className="text-[36px] sm:text-[46px] md:text-[58px] lg:text-[66px] xl:text-[74px] font-black text-[#d32f2f] tracking-tight leading-[1]">
                  2026-27
                </p>
                <h2 className="text-[26px] sm:text-[34px] md:text-[42px] lg:text-[48px] xl:text-[54px] font-black text-[#0c2e60] tracking-tight leading-[1.05]">
                  INDIA & ABROAD
                </h2>
              </div>

              {/* Gold ribbon */}
              <span className="inline-block bg-[#f9a825] text-white font-extrabold text-[10px] sm:text-[12px] md:text-[13px] px-3 sm:px-4 py-1.5 sm:py-2 tracking-wide italic rounded-md shadow-sm">
                YOUR DREAM OF BECOMING A DOCTOR STARTS HERE
              </span>

              {/* College tags */}
              <p className="text-[12px] sm:text-[14px] md:text-[16px] font-black text-[#0c2e60] tracking-wide">
                AIIMS <span className="text-slate-300 font-normal mx-0.5">|</span> BHU <span className="text-slate-300 font-normal mx-0.5">|</span> JIPMER <span className="text-slate-300 font-normal mx-0.5">|</span> AMU <span className="text-slate-300 font-normal mx-0.5">|</span> NMC Approved Universities Abroad
              </p>

              {/* Flags */}
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] sm:text-[10px] font-extrabold text-[#0c2e60]">
                {flagCountries.map((c) => (
                  <span key={c.name} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                      <img src={`https://flagcdn.com/w80/${c.code === "NEPAL" ? "np" : c.code}.png`} alt={`${c.name} Flag`} className="w-full h-full object-cover" />
                    </div>
                    <span>{c.name}</span>
                  </span>
                ))}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-[#0c2e60]">
                    <FaCheckCircle className="text-[#16a34a] text-[13px] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-1">
                <a href="#free-counseling-form" className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold px-4 sm:px-5 py-3 rounded-xl text-[11px] sm:text-[12px] shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5">
                  <FaUser size={11} /> GET FREE COUNSELING
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold px-4 sm:px-5 py-3 rounded-xl text-[11px] sm:text-[12px] shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5">
                  <FaWhatsapp size={14} /> WHATSAPP NOW
                </a>
                <a href="tel:01202611111" className="inline-flex items-center justify-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 sm:px-5 py-3 rounded-xl text-[11px] sm:text-[12px] shadow-lg shadow-[#0c2e60]/20 transition-all hover:-translate-y-0.5">
                  <FaPhoneAlt size={11} /> REQUEST CALLBACK
                </a>
              </div>
            </div>

            {/* ──── DOCTOR (XL only) ──── */}
            <div className="hidden xl:block absolute bottom-0 right-[26%] w-[440px] h-[105%] pointer-events-none z-[5]">
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

            {/* ──── RIGHT: Form ──── */}
            <div id="free-counseling-form" className="lg:col-span-4 relative z-20">
              <div className="w-full bg-[#0c2e60] rounded-2xl overflow-hidden shadow-2xl shadow-[#0c2e60]/25">
                {/* Header */}
                <div className="py-3 sm:py-4 text-center">
                  <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">GET FREE</span>
                  <h3 className="text-[16px] sm:text-[18px] font-black text-[#f9a825] tracking-wide mt-0.5 italic">CAREER COUNSELING</h3>
                </div>

                {/* Body */}
                <div className="bg-white rounded-t-2xl p-4 sm:p-5">
                  {success ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-14 h-14 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xl mx-auto shadow-lg"><FaCheckCircle /></div>
                      <h4 className="text-base font-black text-[#0c2e60]">Request Submitted!</h4>
                      <p className="text-xs text-slate-500">A counselor will contact you shortly.</p>
                      <button onClick={() => setSuccess(false)} className="bg-[#f9a825] text-[#0c2e60] font-black py-2 px-5 rounded-lg text-xs">Submit New</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
                      {/* Full Name */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none"><FaUser size={12} /></span>
                        <input type="text" placeholder="Full Name" {...register("fullName")} className={`w-full bg-slate-50 border rounded-lg pl-8 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] ${errors.fullName ? "border-red-400" : "border-slate-200"}`} />
                      </div>

                      {/* Mobile */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none"><FaPhoneAlt size={12} /></span>
                        <input type="text" placeholder="Mobile Number" {...register("phone")} className={`w-full bg-slate-50 border rounded-lg pl-8 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] ${errors.phone ? "border-red-400" : "border-slate-200"}`} />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none"><FaEnvelope size={12} /></span>
                        <input type="email" placeholder="Email Address" {...register("email")} className={`w-full bg-slate-50 border rounded-lg pl-8 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] ${errors.email ? "border-red-400" : "border-slate-200"}`} />
                      </div>

                      {/* NEET Score */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none"><FaFileAlt size={12} /></span>
                        <input type="number" placeholder="NEET Score" {...register("neetScore", { valueAsNumber: true })} className={`w-full bg-slate-50 border rounded-lg pl-8 pr-3 py-2.5 text-[12px] text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] ${errors.neetScore ? "border-red-400" : "border-slate-200"}`} />
                      </div>

                      {/* Interested In */}
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5 pl-0.5">Interested In</label>
                        <div className="relative">
                          <select {...register("interestedIn")} onChange={(e) => { setValue("interestedIn", e.target.value); setValue("country", e.target.value === "India" ? "India" : ""); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[12px] text-[#1a1a2e] outline-none appearance-none focus:border-[#0F4C81]">
                            <option value="">Select</option>
                            <option value="Abroad">MBBS Abroad</option>
                            <option value="India">MBBS India</option>
                            <option value="Both">Both</option>
                          </select>
                          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5 pl-0.5">Preferred Country (If Abroad)</label>
                        <div className="relative">
                          <select {...register("country")} className={`w-full bg-slate-50 border rounded-lg px-3 py-2.5 text-[12px] text-[#1a1a2e] outline-none appearance-none focus:border-[#0F4C81] ${errors.country ? "border-red-400" : "border-slate-200"}`}>
                            <option value="">Select</option>
                            <option value="India">India</option>
                            <option value="Russia">Russia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Egypt">Egypt</option>
                          </select>
                          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {errorMsg && <p className="text-[10px] text-red-500 font-bold text-center">{errorMsg}</p>}

                      <button type="submit" disabled={loading} className="w-full bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-3 rounded-lg text-[13px] tracking-wider shadow-md disabled:opacity-50">
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

      {/* ═══ STATS BAR — attached at bottom of hero, visible without scroll ═══ */}
      <div className="relative z-20 bg-gradient-to-r from-[#0a1f3f] via-[#0c2e60] to-[#0a1f3f] py-4 sm:py-5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4 justify-center md:justify-start">
              {/* Badge circle */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#f9a825]/40 flex items-center justify-center flex-shrink-0 bg-white/5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 border border-[#f9a825]/60 flex items-center justify-center text-[#f9a825] text-sm sm:text-base">
                  {stat.icon}
                </div>
              </div>
              <div>
                <span className="text-[22px] sm:text-[26px] md:text-[28px] font-black text-white leading-none block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 tracking-wider block mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
