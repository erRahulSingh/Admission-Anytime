"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaThLarge,
  FaUserFriends,
  FaFileAlt,
  FaHeadset,
  FaGraduationCap,
  FaPhoneAlt,
  FaBullhorn,
  FaChartBar,
  FaUsers,
  FaCog,
  FaBell,
  FaCalendarAlt,
  FaChevronDown,
  FaSignOutAlt,
  FaHome,
  FaSearch,
  FaBars,
  FaTimes,
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  const sidebarLinks = [
    { label: "Dashboard", href: "/admin", icon: <FaThLarge />, exact: true },
    { label: "Leads", href: "/admin/admission-forms", icon: <FaUserFriends /> },
    { label: "Applications", href: "/admin/students", icon: <FaFileAlt /> },
    { label: "Admissions", href: "/admin/admissions", icon: <FaGraduationCap /> },
    { label: "Counselling", href: "/admin/contact-requests", icon: <FaHeadset /> },
    { label: "Marketing", href: "/admin/marketing", icon: <FaBullhorn /> },
    { label: "Reports", href: "/admin/reports", icon: <FaChartBar /> },
    { label: "Users", href: "/admin/users", icon: <FaUsers /> },
    { label: "Settings", href: "/admin/settings", icon: <FaCog /> },
  ];

  // Determine the page title from the current sidebar link
  const currentLink = sidebarLinks.find((l) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href) && l.href !== "/admin"
  );
  const pageTitle =
    pathname === "/admin/contact-requests"
      ? "Counselling Management"
      : pathname === "/admin/reports"
      ? "Reports & Analytics"
      : pathname === "/admin/users"
      ? "Users Management"
      : pathname === "/admin/settings"
      ? "Settings"
      : currentLink?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* ═══════════════════ MOBILE SIDEBAR OVERLAY ═══════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════════════ LEFT SIDEBAR ═══════════════════ */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[240px] bg-[#0c1527] text-white flex flex-col justify-between flex-shrink-0 min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          {/* Logo + Mobile Close */}
          <div className="px-5 pt-6 pb-5 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group select-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a6de1] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0 border border-white/10">
                <FaGraduationCap className="text-lg text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline leading-none">
                  <span className="text-white font-extrabold text-[15px] tracking-tight">Admission</span>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5 leading-none">
                  <span className="text-[#38bdf8] font-black text-[13px] tracking-wide">Anytime</span>
                  <span className="text-[#94a3b8] font-bold text-[11px]">.com</span>
                </div>
              </div>
            </Link>
            {/* Close button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-[#94a3b8] hover:text-white"
            >
              <FaTimes className="text-[16px]" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="px-3 space-y-0.5">
            {sidebarLinks.map((link, idx) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href) && link.href !== "/admin";

              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-[10px] rounded-lg text-[13px] transition-all duration-150 ${
                    isActive
                      ? "bg-[#1a6de1] text-white font-semibold shadow-sm"
                      : "text-[#7b8da6] hover:bg-[#141f35] hover:text-[#c5d3e8]"
                  }`}
                >
                  <span className={`text-[14px] w-5 flex items-center justify-center ${isActive ? "text-white" : "text-[#4e6280]"}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div className="px-4 pb-5 space-y-3 hidden lg:block">
          {pathname === "/admin/marketing" ? (
            /* Promote Smarter Card for Marketing */
            <div className="bg-gradient-to-br from-[#122347] to-[#0e1b36] rounded-xl p-4 border border-[#1d355c]">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white text-[13px] font-bold">Promote Smarter</h4>
                <span className="text-xs">📈</span>
              </div>
              <p className="text-[#7d9bbd] text-[11px] leading-relaxed mb-3">
                Create high performing campaigns and get more admissions.
              </p>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-create-campaign"));
                  }
                }}
                className="w-full bg-[#1a6de1] hover:bg-[#1558c0] text-white text-[12px] font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="text-[13px] font-bold">+</span> Create Campaign
              </button>
            </div>
          ) : pathname === "/admin/reports" ? (
            /* Grow Admissions Smarter Card for Reports */
            <div className="bg-gradient-to-br from-[#122347] to-[#1e144a] rounded-xl p-4 border border-[#2b2168]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px]">📊</span>
                <h4 className="text-white text-[13px] font-bold">Grow Admissions Smarter</h4>
              </div>
              <p className="text-[#8e9bc5] text-[11px] leading-relaxed mb-3">
                Track, analyze and grow your admissions with powerful insights.
              </p>
              <button className="w-full bg-[#1a6de1] hover:bg-[#1558c0] text-white text-[12px] font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm">
                Explore Insights →
              </button>
            </div>
          ) : pathname === "/admin/users" ? (
            /* Manage Smarter Card for Users */
            <div className="bg-gradient-to-br from-[#0f1d38] to-[#12192e] rounded-xl p-4 border border-[#1b2a4a]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px]">🛡️</span>
                <h4 className="text-white text-[13px] font-bold">Manage Smarter</h4>
              </div>
              <p className="text-[#728cb0] text-[11px] leading-relaxed mb-3">
                Secure your data and empower your team with the right access.
              </p>
              <button className="w-full bg-[#1a6de1] hover:bg-[#1558c0] text-white text-[12px] font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm">
                Explore Roles
              </button>
            </div>
          ) : pathname === "/admin/settings" ? (
            /* Stay Updated Card for Settings Notifications */
            <div className="bg-gradient-to-br from-[#0c1527] via-[#121f3d] to-[#1e144a] rounded-xl p-4 border border-[#1b2a4a]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px]">🔔</span>
                <h4 className="text-white text-[13px] font-bold">Stay Updated</h4>
              </div>
              <p className="text-[#728cb0] text-[11px] leading-relaxed mb-3">
                Enable smart notifications to never miss important updates.
              </p>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    alert("Notification Settings opened");
                  }
                }}
                className="w-full bg-[#1a6de1] hover:bg-[#1558c0] text-white text-[12px] font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                Manage Notifications ↗
              </button>
            </div>
          ) : (
            /* Standard Need Help Card for Counselling & Others */
            <div className="bg-[#111d33] rounded-xl p-4 border border-[#1a2a45]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px]">🎧</span>
                <h4 className="text-white text-[13px] font-bold">Need Help?</h4>
              </div>
              <p className="text-[#6b84a3] text-[11px] leading-relaxed mb-3">
                Our counseling experts are here to support you.
              </p>
              <button className="w-full bg-[#1a6de1] hover:bg-[#1558c0] text-white text-[12px] font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <span className="text-[12px]">📅</span> Book a Demo
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ═══════════════════ RIGHT CONTENT AREA ═══════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Top Header Bar */}
        <header className="bg-[#ffffff] border-b border-[#e8ecf1] h-[56px] lg:h-[64px] px-4 lg:px-7 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Menu (Mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-[#3d4555] flex-shrink-0"
            >
              <FaBars className="text-[18px]" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[16px] lg:text-[20px] font-bold text-[#1a1f36] leading-tight truncate">{pageTitle}</h1>
                {pathname === "/admin/marketing" && (
                  <span className="px-1.5 py-0.5 bg-blue-50 text-[#1a6de1] rounded-md text-[13px] font-bold flex items-center gap-1 flex-shrink-0">
                    📈
                  </span>
                )}
              </div>
              <p className="text-[11px] lg:text-[12px] text-[#8c95a6] mt-0 truncate hidden sm:block">
                {pathname === "/admin/marketing"
                  ? "Track your marketing performance and lead generation across all channels."
                  : pathname === "/admin/contact-requests"
                  ? "Manage and track all counselling sessions and interactions"
                  : pathname === "/admin/admissions"
                  ? "Manage and track all admissions in one place."
                  : pathname === "/admin/reports"
                  ? "Deep insights into your admission journey and business performance"
                  : pathname === "/admin/users"
                  ? "Manage all users, roles and permissions from one place"
                  : pathname === "/admin/settings"
                  ? "Manage your system preferences and configurations"
                  : "Welcome back! Here's what's happening today."}
              </p>
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Header Search Input for Settings */}
            {pathname === "/admin/settings" && (
              <div className="relative hidden lg:block w-52 mr-2">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] text-[12px] py-1.5 pl-8 pr-3 rounded-lg focus:outline-none focus:border-[#6366f1] placeholder-[#94a3b8]"
                />
                <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[11px]" />
              </div>
            )}

            {/* Date Range - hidden on small mobile */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-[7px] bg-white border border-[#e0e5ec] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer hover:border-[#c5cdd8] transition-colors">
              <FaCalendarAlt className="text-[#8c95a6] text-[12px]" />
              <span className="hidden md:inline">01 May 2025 - 31 May 2025</span>
              <span className="md:hidden">May 2025</span>
              <FaChevronDown className="text-[#8c95a6] text-[9px] ml-0.5" />
            </div>

            {/* Notification Bell */}
            <div className="w-[34px] h-[34px] lg:w-[36px] lg:h-[36px] rounded-lg border border-[#e0e5ec] flex items-center justify-center relative cursor-pointer hover:bg-slate-50 transition-colors">
              <FaBell className="text-[#6b7a8d] text-[14px]" />
              <span className="absolute top-[5px] right-[5px] lg:top-[6px] lg:right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white" />
            </div>

            {/* Separator - hidden on mobile */}
            <div className="w-px h-7 bg-[#e8ecf1] mx-1 hidden sm:block" />

            {/* User Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-100/80 transition-colors select-none"
              >
                <div className="w-[34px] h-[34px] lg:w-[38px] lg:h-[38px] rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-[13px] lg:text-[14px]">
                    {(adminUser?.name || "Admin").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-[12px] font-semibold text-[#1a1f36] leading-tight">
                    Hello, {adminUser?.name?.split(" ")[0] || "Admin"}
                  </div>
                  <div className="text-[10px] text-[#8c95a6] font-medium">
                    {adminUser?.role === "superadmin" ? "Super Admin" : "Admin"}
                  </div>
                </div>
                <FaChevronDown className={`text-[#8c95a6] text-[9px] transition-transform duration-200 hidden md:block ${userDropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {/* Dropdown Menu Popover */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] z-50 py-2 overflow-hidden font-sans"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
                        <p className="text-[13px] font-bold text-[#0f172a] truncate">
                          {adminUser?.name || "Senior Admin"}
                        </p>
                        <p className="text-[11px] text-[#64748b] truncate mt-0.5">
                          {adminUser?.email || "admin@admissionanytime.com"}
                        </p>
                        <span className="inline-block px-2 py-0.5 mt-1.5 bg-[#e0f2fe] text-[#0284c7] text-[9px] font-bold rounded-full uppercase tracking-wider">
                          {adminUser?.role || "Super Admin"}
                        </span>
                      </div>

                      {/* Quick Links */}
                      <div className="py-1">
                        <Link
                          href="/admin/settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[12px] font-semibold text-[#334155] hover:bg-[#f1f5f9] hover:text-[#6366f1] transition-colors"
                        >
                          <FaCog className="text-[13px] text-[#64748b]" />
                          <span>Account Settings</span>
                        </Link>
                        <Link
                          href="/admin/users"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[12px] font-semibold text-[#334155] hover:bg-[#f1f5f9] hover:text-[#6366f1] transition-colors"
                        >
                          <FaUsers className="text-[13px] text-[#64748b]" />
                          <span>Team Roles & Users</span>
                        </Link>
                      </div>

                      {/* Logout Action */}
                      <div className="border-t border-[#f1f5f9] pt-1 mt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] font-bold text-[#ef4444] hover:bg-[#fee2e2]/70 transition-colors text-left cursor-pointer"
                        >
                          <FaSignOutAlt className="text-[13px]" />
                          <span>Sign Out / Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
