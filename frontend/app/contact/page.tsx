"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaUser,
  FaPen,
  FaWhatsapp,
  FaArrowRight,
  FaLock,
  FaClipboardList,
} from "react-icons/fa";
import api from "@/services/api";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number required"),
  subject: z.string().min(2, "Subject required"),
  message: z.string().min(5, "Message required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/contacts", data);
      setSuccess(true);
      reset();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to submit query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafcff] min-h-screen pb-16">
      
      {/* ═══ 1. Banner Section ═══ */}
      <div className="relative bg-[#0c2e60] text-white pt-10 sm:pt-16 pb-14 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f3f] via-[#0c2e60] to-[#0a1f3f] opacity-95" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-3.5 sm:px-6 text-center space-y-3 sm:space-y-4">
          <span className="text-[#f9a825] font-black uppercase text-[10px] sm:text-xs tracking-widest bg-white/10 px-3.5 sm:px-4 py-1.5 rounded-full inline-block">
            Get In Touch
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Connect With Our Counselors
          </h1>
          <p className="text-slate-350 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-semibold">
            Have questions about NEET counseling, college eligibility, or seat allocations? Our expert admission panel is here to provide direct, honest assistance.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 mt-8 sm:mt-16">
        
        {/* ═══ 2. Contact Grid ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* ──── LEFT: Inquiry Form Card ──── */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#f9a825]" />
            
            <div className="space-y-1.5 mb-6">
              <h2 className="text-base sm:text-lg font-black text-[#0c2e60] tracking-wide uppercase">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-400 font-semibold">
                Fill out the form below, and a medical admissions expert will review your details.
              </p>
            </div>

            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#16a34a]/10 text-[#16a34a] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <FaCheckCircle size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#0c2e60]">Inquiry Sent Successfully!</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                  Thank you for writing to us. Our senior counseling board will review your NEET details and get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-2.5 px-6 rounded-lg text-xs tracking-wider"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5 pl-0.5">Your Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <FaUser size={12} />
                      </span>
                      <input
                        type="text"
                        placeholder="Name"
                        {...register("name")}
                        className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-xs text-[#1a1a2e] font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all ${
                          errors.name ? "border-red-400" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1.5 block">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5 pl-0.5">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <FaEnvelope size={12} />
                      </span>
                      <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-xs text-[#1a1a2e] font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all ${
                          errors.email ? "border-red-400" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1.5 block">{errors.email.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5 pl-0.5">Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <FaPhoneAlt size={12} />
                      </span>
                      <input
                        type="text"
                        placeholder="10 digit mobile"
                        {...register("phone")}
                        className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-xs text-[#1a1a2e] font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all ${
                          errors.phone ? "border-red-400" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1.5 block">{errors.phone.message}</span>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5 pl-0.5">Subject</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <FaClipboardList size={12} />
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Admission Inquiry"
                        {...register("subject")}
                        className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-xs text-[#1a1a2e] font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all ${
                          errors.subject ? "border-red-400" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.subject && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1.5 block">{errors.subject.message}</span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1.5 pl-0.5">Your Message</label>
                  <div className="relative">
                    <span className="absolute top-3.5 left-3.5 text-slate-400">
                      <FaPen size={12} />
                    </span>
                    <textarea
                      rows={5}
                      placeholder="Type details of your inquiry (NEET qualification, academic budgets) here..."
                      {...register("message")}
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-xs text-[#1a1a2e] font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all ${
                        errors.message ? "border-red-400" : "border-slate-200"
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <span className="text-[10px] text-red-500 font-semibold mt-1.5 block">{errors.message.message}</span>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-500 font-semibold text-center">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-[#0c2e60]/20 transition-all text-xs tracking-wider uppercase disabled:opacity-50 mt-2 hover:-translate-y-0.5"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                </button>
                
                <p className="text-[9px] text-slate-400 text-center flex items-center justify-center gap-1 mt-1">
                  <FaLock size={8} /> 256-bit encryption safeguards your medical career details
                </p>
              </form>
            )}
          </div>

          {/* ──── RIGHT: Interactive Info Cards ──── */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Card 1: Phone call */}
            <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white border border-blue-100 hover:border-blue-300 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                <FaPhoneAlt />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#0c2e60] tracking-wide">
                    Talk to Admissions Expert
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                    Direct Line: <a href="tel:+919876543210" className="hover:underline font-extrabold text-[#0c2e60]">+91 98765 43210</a> <br />
                    Hotline: <a href="tel:+91114567890" className="hover:underline font-extrabold text-[#0c2e60]">+91 11 4567 890</a>
                  </p>
                </div>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-1.5 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-3 py-2 rounded-lg text-[9px] tracking-widest transition-colors shadow-sm uppercase"
                >
                  Call Now <FaArrowRight size={8} />
                </a>
              </div>
            </div>

            {/* Card 2: WhatsApp chat */}
            <div className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-white border border-green-100 hover:border-green-300 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                <FaWhatsapp />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#0c2e60] tracking-wide">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                    Quickly check NMC rules, country eligibility, or hostel food messes directly on chat.
                  </p>
                </div>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold px-3 py-2 rounded-lg text-[9px] tracking-widest transition-colors shadow-sm uppercase"
                >
                  Launch Chat <FaArrowRight size={8} />
                </a>
              </div>
            </div>

            {/* Card 3: Email Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-100 hover:border-amber-300 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                <FaEnvelope />
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#0c2e60] tracking-wide">
                    Email Inquiries
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                    Admissions: <a href="mailto:info@admissionanytime.com" className="hover:underline font-extrabold text-[#0c2e60]">info@admissionanytime.com</a> <br />
                    Documents: <a href="mailto:docs@admissionanytime.com" className="hover:underline font-extrabold text-[#0c2e60]">docs@admissionanytime.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Location */}
            <div className="bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-white border border-indigo-100 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                <FaMapMarkerAlt />
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-[#0c2e60] tracking-wide">
                    Office Location & Timing
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                    Suite 402, Metro Plaza, Outer Ring Road, New Delhi, 110001
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-1.5 flex items-center gap-1">
                    <FaClock /> Mon - Sat: 09:30 AM to 06:30 PM (Sunday Closed)
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
