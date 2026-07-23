"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaWhatsapp,
  FaHome,
  FaGraduationCap,
  FaGlobe,
  FaUniversity,
  FaHandHoldingMedical,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";

type NavLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  hasDropdown?: boolean;
  children?: { label: string; href: string }[];
};

const navLinks: NavLink[] = [
  { label: "HOME", href: "/", icon: <FaHome /> },
  { label: "MBBS IN INDIA", href: "/mbbs-india", icon: <FaGraduationCap /> },
  { label: "MBBS ABROAD", href: "/mbbs-abroad", icon: <FaGlobe /> },
  { label: "UNIVERSITIES", href: "/universities", icon: <FaUniversity /> },
  { label: "SERVICES", href: "/services", icon: <FaHandHoldingMedical /> },
  { label: "ABOUT US", href: "/about", icon: <FaInfoCircle /> },
  { label: "CONTACT US", href: "/contact", icon: <FaEnvelope /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Hide Navbar on admin and landing pages
  if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/lp"))) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-white w-full transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm border-b border-slate-100"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex justify-between items-center h-[70px] md:h-[76px]">
        {/* ─── Logo ─── */}
        <Link href="/" className="flex-shrink-0 flex items-center select-none">
          <img
            src="/logo.png"
            alt="Admission Anytime"
            className="h-12 sm:h-14 md:h-[58px] w-auto object-contain"
          />
        </Link>

        {/* ─── Desktop Nav ─── */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.children &&
                link.children.some((c) => pathname.startsWith(c.href)));
            return (
              <div key={link.label} className="relative group">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-2 xl:px-3 py-5 text-[11px] xl:text-[12px] font-extrabold tracking-wider uppercase whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-[#0F4C81]"
                      : "text-[#1a1a2e] hover:text-[#0F4C81]"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <FaChevronDown className="text-[8px] opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                </Link>

                {/* Dropdown */}
                {link.hasDropdown && link.children && (
                  <div className="absolute top-full left-0 pt-1 hidden group-hover:block">
                    <div className="bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-52 animate-fade">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-[#0F4C81] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ─── Phone CTA (Desktop) ─── */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:+916284063840"
            className="w-10 h-10 rounded-full bg-[#0F4C81]/5 border border-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white transition-all duration-300"
          >
            <FaPhoneAlt size={14} />
          </a>
          <div className="text-right">
            <a
              href="tel:+916284063840"
              className="text-[14px] font-black text-[#1a1a2e] hover:text-[#0F4C81] block leading-none transition-colors"
            >
              +91 62840 63840
            </a>
          </div>
        </div>

        {/* ─── Mobile Action (Only Hamburger) ─── */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-[#0F4C81] hover:bg-blue-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Right Slide-Over Drawer Menu ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs lg:hidden"
            />

            {/* Right Side Compact Card Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="fixed top-16 right-3 z-50 w-[82%] max-w-[300px] h-auto max-h-[85vh] bg-white border border-slate-200/90 shadow-2xl rounded-2xl flex flex-col justify-between lg:hidden overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div>
                <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/70">
                  <span className="text-[11px] font-black text-[#0c2e60] uppercase tracking-wider">
                    Quick Navigation
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-200 text-[#0c2e60] flex items-center justify-center text-xs transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Nav Links with Icons */}
                <div className="p-3 space-y-1 overflow-y-auto max-h-[55vh]">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 py-2 px-3 rounded-xl text-[12px] font-black transition-all ${
                        pathname === link.href
                          ? "bg-[#0c2e60] text-white shadow-sm"
                          : "text-[#0c2e60] hover:bg-blue-50"
                      }`}
                    >
                      <span className={`text-sm flex-shrink-0 ${pathname === link.href ? "text-[#f9a825]" : "text-[#0F4C81]"}`}>
                        {link.icon}
                      </span>
                      <span className="flex-1">{link.label}</span>
                      {link.hasDropdown && (
                        <FaChevronDown className="text-[10px] opacity-40" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Drawer Bottom CTA Strip */}
              <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
                <a
                  href="tel:+916284063840"
                  className="flex items-center justify-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-all active:scale-95"
                >
                  <FaPhoneAlt size={12} />
                  +91 62840 63840
                </a>
                <a
                  href="https://wa.me/916284063840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-all active:scale-95"
                >
                  <FaWhatsapp size={14} />
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
