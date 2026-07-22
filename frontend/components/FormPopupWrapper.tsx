"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import api from "@/services/api";

/* ─── Zod Schema (Single Step: Name, Phone, Email) ─── */
const leadSchema = z.object({
  fullName: z.string().min(2, "Full Name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
});
type LeadFormValues = z.infer<typeof leadSchema>;

/**
 * Checks if the click target is (or is inside) an interactive element.
 * Uses closest() which handles SVG/icon children inside buttons/links correctly.
 */
const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "label",
  "video",
  "audio",
  "details",
  "summary",
  "form",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[role='tab']",
  "[contenteditable='true']",
  "[data-no-popup]",
  "[onclick]",
].join(",");

function isInteractiveElement(target: EventTarget): boolean {
  const el =
    target instanceof HTMLElement
      ? target
      : target instanceof SVGElement
        ? target.closest?.("svg")?.parentElement
        : null;

  if (!el) return false;
  if (el.closest?.(INTERACTIVE_SELECTOR)) return true;

  const computed = window.getComputedStyle(el);
  if (computed.cursor === "pointer") return true;

  return false;
}

export default function FormPopupWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
        source: "Website - Popup",
      });
      setSuccess(true);
      reset();
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;

      if (isInteractiveElement(target)) return;
      if (isModalOpen) return;
      if (target.closest("[data-popup-modal]")) return;

      setIsModalOpen(true);
    },
    [isModalOpen]
  );

  return (
    <>
      {/* Wrap children with click interceptor */}
      <div onClick={handlePageClick} className="contents">
        {children}
      </div>

      {/* ═══ GLOBAL POP-UP COUNSELING MODAL ═══ */}
      {isModalOpen && (
        <div
          data-popup-modal
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[3px]"
          style={{ animation: "fadeInPopup 0.25s ease-out" }}
        >
          {/* Backdrop overlay click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Card */}
          <div
            className="relative z-10 w-full max-w-[340px] sm:max-w-[370px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-white/80 rounded-3xl shadow-2xl"
            style={{ animation: "slideUpPopup 0.3s ease-out" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#0c2e60] px-6 py-4 flex justify-between items-center rounded-t-3xl">
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
            <div className="p-5 sm:p-6">
              {success ? (
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
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setIsModalOpen(false);
                    }}
                    className="mt-2 bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-2.5 px-6 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  {/* Full Name */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <FaUser size={12} />
                    </span>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      {...register("fullName")}
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-3 text-[12px] font-medium text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${
                        errors.fullName
                          ? "border-red-400"
                          : "border-slate-200"
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
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-3 text-[12px] font-medium text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${
                        errors.phone
                          ? "border-red-400"
                          : "border-slate-200"
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
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-3 text-[12px] font-medium text-[#1a1a2e] placeholder:text-slate-400 outline-none focus:border-[#0F4C81] focus:bg-white transition-all ${
                        errors.email
                          ? "border-red-400"
                          : "border-slate-200"
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
                    className="w-full bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-3.5 rounded-xl text-[13px] tracking-wider shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
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

          {/* Animations */}
          <style>{`
            @keyframes fadeInPopup {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUpPopup {
              from { opacity: 0; transform: translateY(20px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
