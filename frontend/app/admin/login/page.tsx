"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaShieldAlt,
  FaChartBar,
  FaUsers,
  FaBell,
  FaCheck,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import api from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@admissionanytime.com",
      password: "admin12345",
      rememberMe: true,
    },
  });

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response: any = await api.post("/auth/login", data);
      if (response && response.success) {
        localStorage.setItem("adminToken", response.token || "admin-token-12345");
        localStorage.setItem("adminUser", JSON.stringify(response.admin || { name: "Senior Admin", role: "Super Admin", email: data.email }));
        router.push("/admin");
      } else {
        setErrorMsg(response?.message || "Invalid email or password");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    localStorage.setItem("adminToken", "google-admin-token-12345");
    localStorage.setItem("adminUser", JSON.stringify({ name: "Admin User", role: "Super Admin", email: "admin@admissionanytime.com" }));
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-2 font-sans text-[#1a1f36]">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* LEFT HALF: DARK BRAND & CRM PROMO PANEL                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-[#070b19] via-[#0f172a] to-[#1e144a] text-white relative overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#6366f1]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-3xl pointer-events-none" />

        {/* 1. TOP BRANDING LOGO */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white text-xl shadow-lg border border-white/20">
              <FaGraduationCap />
            </div>
            <div>
              <div className="flex items-baseline gap-0 leading-tight">
                <span className="text-[#4da3ff] text-[19px] font-light italic" style={{ fontFamily: "Georgia, serif" }}>A</span>
                <span className="text-white text-[15px] font-bold">dmission</span>
                <span className="text-[#818cf8] text-[15px] font-bold">Anytime</span>
                <span className="text-[#60a5fa] text-[15px] font-bold">.com</span>
              </div>
              <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider block">Admission CRM</span>
            </div>
          </div>
        </div>

        {/* 2. HERO CONTENT */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-xl">
          <div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
              Welcome Back,
            </h1>
            <h2 className="text-4xl xl:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#6366f1] leading-tight flex items-center gap-2 mt-1">
              Admin! <span className="text-4xl">👋</span>
            </h2>
            <p className="text-[#94a3b8] text-[14px] leading-relaxed mt-3">
              Sign in to your Admin Panel to manage leads, admissions, and grow your institution.
            </p>
            <div className="w-12 h-1 bg-[#6366f1] rounded-full mt-4" />
          </div>

          {/* 4 FEATURE POINTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Feature 1 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/30 text-[#a5b4fc] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FaShieldAlt />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white">Secure & Protected</h4>
                <p className="text-[11px] text-[#94a3b8]">Your data is encrypted and secure</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/30 text-[#93c5fd] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FaChartBar />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white">Real-time Analytics</h4>
                <p className="text-[11px] text-[#94a3b8]">Get instant insights and reports</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0d9488]/20 border border-[#0d9488]/30 text-[#5eead4] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FaUsers />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white">Role-based Access</h4>
                <p className="text-[11px] text-[#94a3b8]">Manage users and permissions</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-[#fcd34d] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FaBell />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white">Smart Notifications</h4>
                <p className="text-[11px] text-[#94a3b8]">Stay updated with important alerts</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM 3D DASHBOARD PREVIEW MOCKUP */}
        <div className="relative z-10 pt-4">
          <div className="bg-[#0b1329]/90 border border-[#1e293b] rounded-2xl p-4 shadow-2xl backdrop-blur-md transform -rotate-1 hover:rotate-0 transition-all duration-300">
            {/* Header Mockup */}
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-3 text-[11px]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FaGraduationCap className="text-[#6366f1]" /> Dashboard
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              </div>
            </div>

            {/* Mock Metrics Cards Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3 text-[10px]">
              <div className="bg-[#131d38] p-2 rounded-lg border border-[#1e293b]">
                <span className="text-[#94a3b8] block">Total Leads</span>
                <span className="font-bold text-white text-[12px]">12,450</span>
                <span className="text-[8px] text-[#10b981] block">+ 12.5%</span>
              </div>
              <div className="bg-[#131d38] p-2 rounded-lg border border-[#1e293b]">
                <span className="text-[#94a3b8] block">Applications</span>
                <span className="font-bold text-white text-[12px]">8,320</span>
                <span className="text-[8px] text-[#10b981] block">+ 8.4%</span>
              </div>
              <div className="bg-[#131d38] p-2 rounded-lg border border-[#1e293b]">
                <span className="text-[#94a3b8] block">Admissions</span>
                <span className="font-bold text-white text-[12px]">2,153</span>
                <span className="text-[8px] text-[#10b981] block">+ 15.2%</span>
              </div>
              <div className="bg-[#131d38] p-2 rounded-lg border border-[#1e293b]">
                <span className="text-[#94a3b8] block">Counselling</span>
                <span className="font-bold text-white text-[12px]">4,870</span>
                <span className="text-[8px] text-[#10b981] block">+ 10.3%</span>
              </div>
            </div>

            {/* Mock Chart & Donut Row */}
            <div className="grid grid-cols-12 gap-2 text-[10px]">
              <div className="col-span-8 bg-[#131d38] p-2.5 rounded-lg border border-[#1e293b]">
                <span className="text-[#94a3b8] block font-bold mb-1">Admissions Overview</span>
                <svg className="w-full h-12 stroke-[#a855f7] fill-none" viewBox="0 0 100 30">
                  <path d="M0 25 Q 15 5, 30 20 T 60 10 T 90 22 T 100 8" strokeWidth="2" />
                </svg>
              </div>

              <div className="col-span-4 bg-[#131d38] p-2.5 rounded-lg border border-[#1e293b] flex items-center justify-between">
                <div>
                  <span className="text-[#94a3b8] block font-bold">Top Lead Sources</span>
                  <span className="text-[8px] text-[#94a3b8] block">• Website • Facebook</span>
                </div>
                <div className="w-7 h-7 rounded-full border-4 border-[#6366f1] border-t-[#a855f7] border-r-[#3b82f6]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* RIGHT HALF: CLEAN WHITE LOGIN FORM CARD                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col justify-between p-6 sm:p-10 relative">
        {/* Top Right Need Help Button */}
        <div className="flex justify-end mb-4 sm:mb-0">
          <button
            onClick={() => alert("Contact Support: admin-support@admissionanytime.com")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] rounded-full text-[12px] font-bold text-[#334155] shadow-2xs transition-colors"
          >
            <FaHeadset className="text-xs text-[#6366f1]" />
            <span>Need Help?</span>
          </button>
        </div>

        {/* Center Login Container */}
        <div className="my-auto max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#e2e8f0] space-y-6"
          >
            {/* 1. TOP 3D SHIELD & LOCK BADGE */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#ede9fe] via-[#f3e8ff] to-[#e0e7ff] flex items-center justify-center mx-auto shadow-inner border border-[#ddd6fe]">
              <div className="w-10 h-10 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-lg shadow-md">
                <FaShieldAlt />
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#10b981] border-2 border-white text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                <FaCheck />
              </span>
            </div>

            {/* 2. CARD HEADING */}
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Admin Panel Login</h2>
              <p className="text-[12px] text-[#64748b] mt-1">Sign in to continue to your account</p>
            </div>

            {/* 3. FORM FIELDS */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xs" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                    className={`w-full bg-white border rounded-lg py-2.5 pl-10 pr-4 text-[12px] font-medium text-[#0f172a] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all ${
                      errors.email ? "border-red-500" : "border-[#cbd5e1]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.email.message}</span>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full bg-white border rounded-lg py-2.5 pl-10 pr-10 text-[12px] font-medium text-[#0f172a] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all ${
                      errors.password ? "border-red-500" : "border-[#cbd5e1]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f172a]"
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.password.message}</span>
                )}
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 rounded text-[#6366f1] focus:ring-[#6366f1] border-[#cbd5e1] cursor-pointer"
                  />
                  <span className="font-bold text-[#334155]">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("Password reset instructions sent to your registered email.")}
                  className="font-bold text-[#6366f1] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {errorMsg && (
                <p className="text-[11px] text-red-500 font-bold text-center">{errorMsg}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white text-[13px] font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                <FaArrowRight className="text-xs" />
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e8f0]" />
              </div>
              <span className="relative px-3 bg-white text-[10px] font-bold text-[#94a3b8] uppercase">OR</span>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#334155] text-[12px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <FcGoogle className="text-base" />
              <span>Sign in with Google</span>
            </button>
          </motion.div>
        </div>

        {/* Card Footer Subtext */}
        <div className="text-center mt-6">
          <p className="text-[11px] font-medium text-[#94a3b8]">
            © 2025 AdmissionAnytime.com. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
