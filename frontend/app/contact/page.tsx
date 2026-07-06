"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaCheckCircle, FaUser, FaPen } from "react-icons/fa";
import api from "@/services/api";

const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
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
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-500 bg-primary-50 px-4 py-1.5 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-text-dark">
            Connect With Our Counselors
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Reach out with any questions about eligibility, counseling schedules, or university seat status.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Contact Form Card */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-premium border border-slate-100 shadow-lg relative overflow-hidden">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-accent-500/20">
                  <FaCheckCircle className="text-2xl" />
                </div>
                <h3 className="text-2xl font-black text-text-dark">Message Sent Successfully!</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                  Thank you for writing to us. A confirmation email has been dispatched. Our team will review your inquiry and get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-primary-500 text-white font-bold py-2.5 px-6 rounded-lg text-xs"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Your Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <FaUser size={12} />
                      </span>
                      <input
                        type="text"
                        placeholder="Name"
                        {...register("name")}
                        className={`w-full bg-slate-50 border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 ${
                          errors.name ? "border-red-500" : "border-slate-200"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.name.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="Email"
                      {...register("email")}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 ${
                        errors.email ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.email.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="10 digit mobile"
                      {...register("phone")}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 ${
                        errors.phone ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.phone.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Admission Inquiry"
                      {...register("subject")}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 ${
                        errors.subject ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                    {errors.subject && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.subject.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Your Message</label>
                  <div className="relative">
                    <span className="absolute top-3.5 left-3 text-slate-400">
                      <FaPen size={12} />
                    </span>
                    <textarea
                      rows={5}
                      placeholder="Type details of your inquiry here..."
                      {...register("message")}
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 ${
                        errors.message ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.message.message}</span>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-500 font-semibold text-center">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-primary-500/20 transition-all text-sm disabled:opacity-50 mt-2"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Column 2: Information Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info cards */}
            <div className="bg-white p-6 md:p-8 rounded-premium border border-slate-100 shadow-lg space-y-6">
              
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-text-dark">Office Address</h4>
                  <p className="text-xs text-text-muted leading-relaxed mt-1">
                    Suite 402, Metro Plaza, Outer Ring Road, New Delhi, 110001
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-text-dark">Phone Numbers</h4>
                  <p className="text-xs text-text-muted leading-relaxed mt-1">
                    Direct Line: <a href="tel:+919876543210" className="hover:underline font-bold text-text-dark">+91 98765 43210</a><br/>
                    Support Hotline: <a href="tel:+91114567890" className="hover:underline font-bold text-text-dark">+91 11 4567 890</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-text-dark">Email Enquiries</h4>
                  <p className="text-xs text-text-muted leading-relaxed mt-1">
                    Admissions: <a href="mailto:info@mbbsconsultancy.com" className="hover:underline font-bold text-text-dark">info@mbbsconsultancy.com</a><br/>
                    Documents: <a href="mailto:docs@mbbsconsultancy.com" className="hover:underline font-bold text-text-dark">docs@mbbsconsultancy.com</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  <FaClock />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-text-dark">Working Hours</h4>
                  <p className="text-xs text-text-muted leading-relaxed mt-1">
                    Monday - Saturday: 09:30 AM to 06:30 PM<br/>
                    Sunday: Closed (Counseling support available on WhatsApp)
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
