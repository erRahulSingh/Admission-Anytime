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
  FaChevronRight,
  FaHandHoldingUsd,
  FaHeadset,
  FaPlane,
  FaLock as FaLockIcon,
  FaDollarSign,
  FaArrowRight,
  FaFileContract,
} from "react-icons/fa";
import api from "@/services/api";

/* ─── Zod Schema ─── */
const leadSchema = z.object({
  fullName: z.string().min(2, "Full Name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().optional(),
  course: z.string().optional(),
});
type LeadFormValues = z.infer<typeof leadSchema>;

/* ─── Static Data ─── */
const flagCountries = [
  { code: "ru", name: "RUSSIA" },
  { code: "ge", name: "GEORGIA" },
  { code: "kz", name: "KAZAKHSTAN" },
  { code: "uz", name: "UZBEKISTAN" },
  { code: "kg", name: "KYRGYZSTAN" },
  { code: "am", name: "ARMENIA" },
  { code: "tj", name: "TAJIKISTAN" },
];

const stats = [
  { value: "25+", label: "YEARS OF EXPERIENCE", icon: <FaStar />, color: "from-[#f9a825] to-[#ff8f00]" },
  { value: "25,000+", label: "STUDENTS GUIDED", icon: <FaUsers />, color: "from-[#16a34a] to-[#22c55e]" },
  { value: "500+", label: "MEDICAL COLLEGES", icon: <FaGraduationCap />, color: "from-[#1976d2] to-[#42a5f5]" },
  { value: "100%", label: "ADMISSION ASSISTANCE", icon: <FaShieldAlt />, color: "from-[#7b1fa2] to-[#ab47bc]" },
];

export default function HeroSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<LeadFormValues | null>(null);

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
      course: "",
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/admissions", {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || `${data.phone}@admissionanytime.com`,
        neetScore: 0,
        interestedIn: data.course || "MBBS India & Abroad",
        country: "India & Abroad",
        source: "Website - Hero Desktop",
      });

      setSubmittedData(data);
      setSuccess(true);
      reset();

      // Formatted WhatsApp message with filled details
      const waMsg = `Hello Admission Anytime,%0A%0AI have submitted an inquiry form on the website.%0A%0A*My Submitted Details:*%0A👤 *Name:* ${encodeURIComponent(data.fullName)}%0A📞 *Phone:* ${encodeURIComponent(data.phone)}%0A📚 *Course:* ${encodeURIComponent(data.course || 'MBBS India & Abroad')}%0A%0APlease connect me with a Senior MBBS Counselor.`;
      const whatsappUrl = `https://wa.me/916284063840?text=${waMsg}`;

      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 500);
    } catch (error: any) {
      console.error("Submission error:", error);
      setErrorMsg(error.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Render Desktop Form Card ─── */
  const renderDesktopForm = () => {
    if (success) {
      const waMsg = submittedData
        ? `Hello Admission Anytime,%0A%0AI have submitted an inquiry form on the website.%0A%0A*My Submitted Details:*%0A👤 *Name:* ${encodeURIComponent(submittedData.fullName)}%0A📞 *Phone:* ${encodeURIComponent(submittedData.phone)}%0A📚 *Course:* ${encodeURIComponent(submittedData.course || 'MBBS India & Abroad')}%0A%0APlease connect me with a Senior MBBS Counselor.`
        : `Hello Admission Anytime,%0A%0AI want to get free MBBS counseling guidance.`;
      const whatsappUrl = `https://wa.me/916284063840?text=${waMsg}`;

      return (
        <div className="py-6 px-4 text-center space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#16a34a] to-[#22c55e] text-white rounded-full flex items-center justify-center text-xl mx-auto shadow-md shadow-green-500/20">
            <FaCheckCircle />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#0c2e60]">
              Form Submitted Successfully! 🎉
            </h4>
            <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
              Your details are saved! Redirecting to WhatsApp to chat with our Senior Counselor...
            </p>
          </div>
          <div className="space-y-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-2.5 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <FaWhatsapp className="text-base" /> Chat on WhatsApp Now
            </a>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setSubmittedData(null);
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-[11px] transition-all cursor-pointer"
            >
              Submit New Inquiry
            </button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Row 1: Full Name & Mobile Number Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Full Name */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <FaUser size={11} />
            </span>
            <input
              type="text"
              placeholder="Full Name *"
              {...register("fullName")}
              className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-[12px] font-semibold text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${
                errors.fullName ? "border-red-400" : "border-slate-200"
              }`}
            />
          </div>

          {/* Mobile Number */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <FaPhoneAlt size={11} />
            </span>
            <input
              type="tel"
              placeholder="Mobile Number *"
              {...register("phone")}
              className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-[12px] font-semibold text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${
                errors.phone ? "border-red-400" : "border-slate-200"
              }`}
            />
          </div>
        </div>

        {/* Row 2: Email Address */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FaEnvelope size={11} />
          </span>
          <input
            type="email"
            placeholder="Email Address (Optional)"
            {...register("email")}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-[12px] font-semibold text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all"
          />
        </div>

        {/* Row 3: Select Course Dropdown */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FaGraduationCap size={13} />
          </span>
          <select
            {...register("course")}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-[12px] font-semibold text-slate-700 outline-none focus:border-[#0F4C81] focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Course / Guidance Needed</option>
            <option value="MBBS India (NEET UG)">MBBS in India (NEET UG)</option>
            <option value="MBBS Abroad (NMC Compliant)">MBBS Abroad (NMC Compliant)</option>
            <option value="Deemed / Management Quota">Deemed Universities / Management Quota</option>
            <option value="NRI Quota Guidance">NRI Quota Guidance</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-[10px]">
            <FaChevronDown />
          </div>
        </div>

        {errorMsg && (
          <p className="text-[10px] text-red-500 font-bold text-center">
            {errorMsg}
          </p>
        )}

        {/* Row 3: Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00a651] hover:bg-[#008d44] text-white font-black py-3 rounded-xl text-[13px] tracking-wide shadow-md shadow-green-600/20 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer uppercase"
        >
          {loading ? "PROCESSING..." : "BOOK FREE COUNSELLING"} <FaArrowRight size={12} />
        </button>
      </form>
    );
  };

  return (
    <section className="relative w-full flex flex-col bg-[#f4f8fe]/80 overflow-hidden font-sans">
      
      {/* ═══ 1. TOP HERO SECTION ═══ */}
      <div className="relative w-full overflow-hidden">
        {/* Soft Background Graphic Layer */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-80"
            style={{ backgroundImage: "url('/hero_bg.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f2f7ff]/95 via-[#f2f7ff]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 h-full">
          <div className="relative pt-4 pb-4 sm:pt-6 sm:pb-8 lg:pt-7 lg:pb-0">
            
            {/* ══════ MOBILE LAYOUT (< lg) ══════ */}
            <div className="lg:hidden relative space-y-3">
              {/* Doctor Image - Positioned further right and lower */}
              <div className="absolute bottom-[-25px] right-[-50px] w-[55%] h-[380px] pointer-events-none z-[1]">
                <img
                  src="/hero_doctor.png"
                  alt="MBBS Admission Counsellor"
                  className="absolute bottom-0 right-0 h-full w-auto object-contain drop-shadow-xl"
                />
              </div>

              {/* Mobile Content */}
              <div className="relative z-[5] space-y-3">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#0c2e60]/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
                  <FaCheckCircle className="text-white text-[9px]" />
                  <span className="text-[9px] font-bold text-white">Trusted by 25,000+ Students</span>
                </div>

                {/* Heading */}
                <div className="pr-[42%] space-y-1 pt-1">
                  <div className="space-y-0 leading-none">
                    <h1 className="text-[26px] font-black text-[#0c2e60] tracking-tight leading-[1]">
                      MBBS ADMISSION
                    </h1>
                    <p className="text-[38px] font-black tracking-tight leading-[1.05] text-[#00a651]">
                      2026–27
                    </p>
                    <p className="text-[22px] font-black text-[#0c2e60] tracking-tight leading-[1]">
                      INDIA & ABROAD
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <FaCheckCircle className="text-[#00a651] text-[11px] flex-shrink-0" />
                    <span className="text-[11px] font-bold text-[#0c2e60]">NMC Approved Universities</span>
                  </div>
                </div>

                {/* Country Flags */}
                <div className="flex flex-wrap gap-x-1.5 gap-y-1.5 text-[9px] font-extrabold text-[#0c2e60]">
                  {flagCountries.slice(0, 6).map((c) => (
                    <span
                      key={c.name}
                      className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                    >
                      <div className="w-4 h-3 rounded-[2px] overflow-hidden border border-slate-200/60 flex-shrink-0">
                        <img
                          src={`https://flagcdn.com/w80/${c.code}.png`}
                          alt={`${c.name} Flag`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{c.name}</span>
                    </span>
                  ))}
                </div>



                {/* Mobile CTA Buttons */}
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 flex items-center justify-between bg-gradient-to-r from-[#0c2e60] to-[#1565c0] rounded-2xl px-3.5 py-3 shadow-lg shadow-blue-900/20 cursor-pointer active:scale-[0.97] transition-transform"
                  >
                    <div className="text-left leading-tight">
                      <span className="text-[10px] font-black text-white tracking-wide block">FREE CAREER</span>
                      <span className="text-[10px] font-black text-white tracking-wide block">COUNSELLING</span>
                      <span className="text-[7px] font-semibold text-white/60 block mt-0.5">Get Expert Guidance</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 ml-1">
                      <FaChevronRight className="text-white text-[9px]" />
                    </div>
                  </button>

                  <a
                    href="https://wa.me/916284063840"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-between bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl px-3.5 py-3 shadow-lg shadow-green-600/20 active:scale-[0.97] transition-transform"
                  >
                    <div className="flex items-center gap-2">
                      <FaWhatsapp className="text-white text-lg flex-shrink-0" />
                      <div className="text-left leading-tight">
                        <span className="text-[10px] font-black text-white tracking-wide block">WHATSAPP EXPERT</span>
                        <span className="text-[7px] font-semibold text-white/60 block mt-0.5">Chat Now</span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 ml-1">
                      <FaChevronRight className="text-white text-[9px]" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* ══════ END MOBILE LAYOUT ══════ */}


            {/* ══════ DESKTOP LAYOUT (>= lg) — EXACT MATCH ══════ */}
            <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
              
              {/* ──── LEFT AREA (Span 7) ──── */}
              <div className="col-span-7 space-y-3.5 pr-2">
                
                {/* 1. Tagline */}
                <span className="text-[#1976d2] font-black text-[11px] uppercase tracking-widest block">
                  YOUR DREAM, OUR GUIDANCE
                </span>

                {/* 2. Main Heading */}
                <div className="space-y-0 leading-none">
                  <h1 className="text-[44px] xl:text-[52px] font-black text-[#0c2e60] tracking-tight leading-[1.02]">
                    MBBS ADMISSION
                  </h1>
                  <p className="text-[52px] xl:text-[62px] font-black tracking-tight leading-[1] text-[#00a651]">
                    2026–27
                  </p>
                  <p className="text-[38px] xl:text-[46px] font-black text-[#0c2e60] tracking-tight leading-[1.02]">
                    INDIA & ABROAD
                  </p>
                </div>

                {/* 3. Subtitle text */}
                <p className="text-[13px] font-semibold text-slate-600 max-w-[560px] leading-relaxed">
                  We help NEET qualified students secure admission in Top Medical Universities in India & Abroad.
                </p>

                {/* 4. 4 Checkmarks Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-[#0c2e60]">
                  <span className="flex items-center gap-1.5"><FaCheckCircle className="text-[#00a651] text-xs flex-shrink-0" /> NMC Approved Universities</span>
                  <span className="flex items-center gap-1.5"><FaCheckCircle className="text-[#00a651] text-xs flex-shrink-0" /> No Donation</span>
                  <span className="flex items-center gap-1.5"><FaCheckCircle className="text-[#00a651] text-xs flex-shrink-0" /> 100% Transparent Process</span>
                  <span className="flex items-center gap-1.5"><FaCheckCircle className="text-[#00a651] text-xs flex-shrink-0" /> End to End Support</span>
                </div>

                {/* 5. Country Flag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-0.5 text-[10px] font-extrabold text-[#0c2e60]">
                  {flagCountries.map((c) => (
                    <span
                      key={c.name}
                      className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div className="w-4 h-3 rounded-[2px] overflow-hidden border border-slate-200 flex-shrink-0">
                        <img
                          src={`https://flagcdn.com/w80/${c.code}.png`}
                          alt={`${c.name} Flag`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{c.name}</span>
                    </span>
                  ))}
                </div>

                {/* 6. Two CTA Buttons Row */}
                <div className="flex items-center gap-3 pt-2">
                  {/* Button 1: Solid Green CTA */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-3 bg-[#00a651] hover:bg-[#008d44] text-white font-black px-5 py-3 rounded-2xl shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-base">
                      <FaGraduationCap />
                    </div>
                    <div className="text-left leading-tight">
                      <span className="text-[12px] font-black tracking-wide block uppercase">FREE CAREER COUNSELLING</span>
                      <span className="text-[9px] font-semibold text-white/80 block">Get Expert Guidance</span>
                    </div>
                  </button>

                  {/* Button 2: White WhatsApp CTA */}
                  <a
                    href="https://wa.me/916284063840"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white border-2 border-[#00a651] hover:bg-green-50/50 text-[#0c2e60] font-black px-5 py-3 rounded-2xl shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-base shadow-sm">
                      <FaWhatsapp />
                    </div>
                    <div className="text-left leading-tight">
                      <span className="text-[12px] font-black tracking-wide block uppercase text-[#00a651]">WHATSAPP EXPERT</span>
                      <span className="text-[9px] font-semibold text-slate-500 block">Chat with Our Counsellor</span>
                    </div>
                  </a>
                </div>

              </div>

              {/* ──── RIGHT AREA (Span 5) — Badges + Doctor Image ──── */}
              <div className="col-span-5 relative flex items-end justify-end min-h-[460px]">
                
                {/* Badges overlay stack on left of doctor */}
                <div className="absolute top-4 left-[-40px] xl:left-[-60px] z-20 flex flex-col gap-3">
                  {/* Badge 1: Golden Laurel Wreath Arch Badge */}
                  <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-3 shadow-xl flex flex-col items-center justify-center text-center max-w-[200px] relative">
                    {/* 3 Gold Stars on Top */}
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <FaStar className="text-amber-400 text-[10px]" />
                      <FaStar className="text-amber-400 text-[14px] -mt-1" />
                      <FaStar className="text-amber-400 text-[10px]" />
                    </div>

                    {/* Laurel Wreath Curve & Text */}
                    <div className="relative w-full px-2">
                      <div className="text-center leading-none space-y-0.5 my-1">
                        <span className="text-[10px] font-extrabold text-[#0c2e60] block tracking-tight">
                          Trusted by
                        </span>
                        <span className="text-[20px] font-black text-[#0c2e60] leading-none block tracking-tight">
                          25,000+
                        </span>
                        <span className="text-[9px] font-extrabold text-[#0c2e60] block tracking-tight">
                          Students Worldwide
                        </span>
                      </div>

                      {/* Left Laurel Branch SVG */}
                      <svg className="absolute left-[-2px] top-[-10px] h-[55px] w-[20px] text-amber-500 fill-current opacity-90 pointer-events-none" viewBox="0 0 40 100">
                        <path d="M35,90 C25,70 15,45 25,20 C18,30 12,45 15,65 C18,78 26,88 35,90 Z" />
                        <path d="M25,85 C15,80 8,70 12,60 C18,65 24,75 25,85 Z" />
                        <path d="M22,70 C10,65 5,52 10,42 C16,48 21,58 22,70 Z" />
                        <path d="M22,50 C12,42 8,30 15,20 C20,28 22,38 22,50 Z" />
                        <path d="M26,30 C18,20 15,10 24,2 C27,10 27,20 26,30 Z" />
                      </svg>

                      {/* Right Laurel Branch SVG */}
                      <svg className="absolute right-[-2px] top-[-10px] h-[55px] w-[20px] text-amber-500 fill-current opacity-90 pointer-events-none transform scale-x-[-1]" viewBox="0 0 40 100">
                        <path d="M35,90 C25,70 15,45 25,20 C18,30 12,45 15,65 C18,78 26,88 35,90 Z" />
                        <path d="M25,85 C15,80 8,70 12,60 C18,65 24,75 25,85 Z" />
                        <path d="M22,70 C10,65 5,52 10,42 C16,48 21,58 22,70 Z" />
                        <path d="M22,50 C12,42 8,30 15,20 C20,28 22,38 22,50 Z" />
                        <path d="M26,30 C18,20 15,10 24,2 C27,10 27,20 26,30 Z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Main Doctor Image - Touch bottom dark line flush */}
                <div className="w-full h-[500px] pointer-events-none flex justify-end items-end">
                  <img
                    src="/hero_doctor.png"
                    alt="MBBS Admission Counsellor"
                    className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
                  />
                </div>

              </div>

            </div>
            {/* ══════ END DESKTOP LAYOUT ══════ */}

          </div>
        </div>
      </div>


      {/* ═══ 2. DARK NAVY STATS BANNER ═══ */}
      <div className="relative z-20 bg-[#06152e] border-t border-b border-[#162744] py-4 shadow-xl">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 bg-white/[0.04] border border-white/10 rounded-2xl p-3 hover:border-white/20 transition-all shadow-inner"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md`}>
                {stat.icon}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[24px] xl:text-[28px] font-black text-white leading-none block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[9px] font-extrabold text-slate-300 tracking-wider block mt-1 uppercase truncate">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ═══ 3. DESKTOP GRID BELOW STATS (Programs + Free Counselling Form) ═══ */}
      <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ──── LEFT SPAN 8: 6 KEY FEATURES CARDS (3 Cards per Line, 2 Lines Total) ──── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            
            {/* ── OUR ADMISSION PROCESS (Above Feature Cards) ── */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#00a651]"></div>
                  <h3 className="text-xs sm:text-sm font-black text-[#0c2e60] tracking-wide uppercase">
                    OUR ADMISSION PROCESS
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold text-[#00a651] uppercase tracking-wider">
                  5 Simple Steps
                </span>
              </div>

              {/* 5 Compact Process Steps Grid */}
              <div className="grid grid-cols-5 gap-1.5 items-center text-center">
                {[
                  { step: 1, title: "Submit Enquiry", icon: <FaClipboardList />, bg: "bg-[#0c2e60]" },
                  { step: 2, title: "Free Counselling", icon: <FaHeadset />, bg: "bg-[#00a651]" },
                  { step: 3, title: "University Selection", icon: <FaUniversity />, bg: "bg-[#1976d2]" },
                  { step: 4, title: "Documentation", icon: <FaFileContract />, bg: "bg-[#7b1fa2]" },
                  { step: 5, title: "Admission Done", icon: <FaCheckCircle />, bg: "bg-[#f57c00]" },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center relative group p-1">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${s.bg} text-white flex items-center justify-center text-sm sm:text-base shadow-sm group-hover:scale-105 transition-transform`}>
                      {s.icon}
                    </div>
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5">
                      Step {s.step}
                    </span>
                    <span className="text-[9px] font-black text-[#0c2e60] leading-tight mt-0.5">
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6 Feature Cards Grid — 2 per line on mobile, 3 per line on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              
              {/* Card 1: No Donation */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-100/80 text-[#00a651] flex items-center justify-center text-sm sm:text-lg flex-shrink-0 shadow-2xs">
                  <FaShieldAlt />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-[#0c2e60] truncate">No Donation</h4>
                  <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 leading-snug truncate">
                    100% Transparent Process
                  </p>
                </div>
              </div>

              {/* Card 2: Visa Support */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100/80 text-[#1976d2] flex items-center justify-center text-sm sm:text-lg flex-shrink-0 shadow-2xs">
                  <FaPlane />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-[#0c2e60] truncate">Visa Support</h4>
                  <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 leading-snug truncate">
                    End to End Assistance
                  </p>
                </div>
              </div>

              {/* Card 3: Education Loan */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-100/80 text-[#00a651] flex items-center justify-center text-sm sm:text-lg flex-shrink-0 shadow-2xs">
                  <FaUniversity />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-[#0c2e60] truncate">Education Loan</h4>
                  <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 leading-snug truncate">
                    Easy Loan Assistance
                  </p>
                </div>
              </div>

              {/* Card 4: 24/7 Support */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100/80 text-[#1976d2] flex items-center justify-center text-sm sm:text-lg flex-shrink-0 shadow-2xs">
                  <FaHeadset />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-[#0c2e60] truncate">24/7 Support</h4>
                  <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 leading-snug truncate">
                    Always With You
                  </p>
                </div>
              </div>

              {/* Card 5: Low Cost */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-100/80 text-[#00a651] flex items-center justify-center text-sm sm:text-lg flex-shrink-0 shadow-2xs">
                  <FaDollarSign />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-[#0c2e60] truncate">Low Cost</h4>
                  <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 leading-snug truncate">
                    Affordable Fees Structure
                  </p>
                </div>
              </div>

              {/* Card 6: Safe & Secure */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-100/80 text-[#00a651] flex items-center justify-center text-sm sm:text-lg flex-shrink-0 shadow-2xs">
                  <FaLockIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-[#0c2e60] truncate">Safe & Secure</h4>
                  <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 leading-snug truncate">
                    Your Future, Our Priority
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* ──── RIGHT SPAN 4: BOOK YOUR FREE COUNSELLING FORM CARD ──── */}
          <div className="lg:col-span-5 xl:col-span-4" id="free-counseling-form">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
              
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#0c2e60] via-[#0f3d7a] to-[#0c2e60] p-4 text-center text-white">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
                  BOOK YOUR FREE COUNSELLING
                </h3>
                <p className="text-[10px] text-slate-300 font-semibold mt-0.5">
                  Take the first step towards your dream career
                </p>
              </div>

              {/* Form Body */}
              <div className="p-4 sm:p-5 space-y-3.5">
                {renderDesktopForm()}

                {/* Footer Student Counter */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Student" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Student" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Student" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Student" />
                  </div>
                  <span className="text-[10px] font-black text-[#0c2e60] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00a651] animate-pulse"></span>
                    500+ Students Enrolled This Month
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>




      {/* ═══ 5. POP-UP COUNSELING MODAL (MOBILE ONLY) ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-[2px] animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-[340px] sm:max-w-[370px] max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl shadow-2xl transform transition-all">
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

            <div className="p-5 sm:p-6 bg-white/85">{renderDesktopForm()}</div>

            <div className="px-5 pb-4">
              <p className="text-[8px] text-slate-400 text-center leading-relaxed font-medium">
                Admissions are processed only through NEET eligibility and official counselling procedures as applicable.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
