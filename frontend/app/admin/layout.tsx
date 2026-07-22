"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaChartPie,
  FaUserInjured,
  FaInbox,
  FaUniversity,
  FaGlobe,
  FaQuoteLeft,
  FaServicestack,
  FaSignOutAlt,
  FaHome,
  FaChevronDown,
  FaUserGraduate,
  FaBookOpen,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Check if current path is login, if so do NOT render layout wrapper
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true);
      return;
    }

    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
      if (user) setAdminUser(JSON.parse(user));
    }
  }, [router, pathname, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If login page, bypass layout structures
  if (isLoginPage) {
    return <>{children}</>;
  }

  const sidebarLinks = [
    { label: "Dashboard Stats", href: "/admin", icon: <FaChartPie /> },
    { label: "Admission Leads", href: "/admin/admission-forms", icon: <FaUserInjured /> },
    { label: "Admitted Students", href: "/admin/students", icon: <FaUserGraduate /> },
    { label: "Contact Inbox", href: "/admin/contact-requests", icon: <FaInbox /> },
    { label: "Universities", href: "/admin/universities", icon: <FaUniversity /> },
    { label: "Countries", href: "/admin/countries", icon: <FaGlobe /> },
    { label: "Testimonials", href: "/admin/testimonials", icon: <FaQuoteLeft /> },
    { label: "Services Offered", href: "/admin/services", icon: <FaServicestack /> },
    { label: "Blog Articles", href: "/admin/blogs", icon: <FaBookOpen /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Panel */}
      <aside className="w-64 bg-[#0b1c2c] text-white flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-black text-white text-sm">
              A
            </div>
            <div>
              <span className="font-extrabold text-sm block">Admission Anytime</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Control center</span>
            </div>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "bg-primary-500 text-white font-extrabold shadow-lg shadow-primary-500/10"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <FaHome className="text-sm" />
            <span>Visit Homepage</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/20 transition-all text-left"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-8 flex justify-between items-center shadow-sm relative z-20">
          <h2 className="text-sm md:text-base font-extrabold text-text-dark tracking-wide">
            {sidebarLinks.find((l) => l.href === pathname)?.label || "Administration Area"}
          </h2>

          {/* User profile info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-extrabold text-text-dark block leading-none">
                {adminUser?.name || "Administrator"}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                {adminUser?.role || "Staff"}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 border flex items-center justify-center font-extrabold text-sm text-primary-500">
              A
            </div>
          </div>
        </header>

        {/* Nested Page Wrapper with Framer Motion Transition */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
