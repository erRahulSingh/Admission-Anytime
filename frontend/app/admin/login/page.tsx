"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaLock, FaEnvelope, FaStethoscope } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
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
        localStorage.setItem("adminToken", response.token);
        localStorage.setItem("adminUser", JSON.stringify(response.admin));
        router.push("/admin");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071321] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0c2e60]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f9a825]/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#0c2e60] border border-[#f9a825]/30 rounded-full flex items-center justify-center text-[#f9a825] mx-auto shadow-lg">
            <FaStethoscope className="text-2xl animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">
              ADMISSION ANYTIME
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#f9a825] mt-1 block">
              Administrative Control Panel
            </span>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-[#0b1c2c]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 pl-0.5">Admin Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <FaEnvelope size={13} />
                </span>
                <input
                  type="email"
                  placeholder="admin@admissionanytime.com"
                  {...register("email")}
                  className={`w-full bg-slate-900/60 border rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#f9a825] focus:ring-1 focus:ring-[#f9a825]/25 transition-all ${
                    errors.email ? "border-red-500" : "border-slate-850"
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-[10px] text-red-400 font-semibold mt-1.5 block">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 pl-0.5">Secure Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <FaLock size={13} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full bg-slate-900/60 border rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-[#f9a825] focus:ring-1 focus:ring-[#f9a825]/25 transition-all ${
                    errors.password ? "border-red-500" : "border-slate-850"
                  }`}
                />
              </div>
              {errors.password && (
                <span className="text-[10px] text-red-400 font-semibold mt-1.5 block">{errors.password.message}</span>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-bold text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f9a825] hover:bg-[#f57f17] text-[#0c2e60] font-black py-3.5 rounded-xl shadow-lg transition-all text-xs disabled:opacity-50 mt-4 uppercase tracking-wider hover:-translate-y-0.5"
            >
              {loading ? "Authenticating..." : "Sign In to Admin"}
            </button>
            
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-slate-500 hover:text-[#f9a825] text-xs font-bold transition-colors">
            ← Return to Homepage
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
