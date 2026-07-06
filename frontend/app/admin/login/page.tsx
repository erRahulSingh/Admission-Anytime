"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaLock, FaEnvelope, FaStethoscope } from "react-icons/fa";
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/20">
            <FaStethoscope className="text-2xl animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">
              MBBS ADVISOR SYSTEM
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Administrative Control Panel
            </span>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-premium p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <FaEnvelope size={13} />
                </span>
                <input
                  type="email"
                  placeholder="admin@mbbsconsultancy.com"
                  {...register("email")}
                  className={`w-full bg-slate-700/60 border rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-primary-500 ${
                    errors.email ? "border-red-500" : "border-slate-600"
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-[10px] text-red-400 font-semibold mt-1 block">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Secure Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <FaLock size={13} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full bg-slate-700/60 border rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-primary-500 ${
                    errors.password ? "border-red-500" : "border-slate-600"
                  }`}
                />
              </div>
              {errors.password && (
                <span className="text-[10px] text-red-400 font-semibold mt-1 block">{errors.password.message}</span>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-bold text-center">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-xs disabled:opacity-50 mt-4 uppercase tracking-wider"
            >
              {loading ? "Authenticating..." : "Sign In to Admin"}
            </button>
            
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-slate-400 hover:text-white text-xs font-medium">
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
