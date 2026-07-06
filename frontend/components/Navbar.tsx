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
} from "react-icons/fa";

const navLinks = [
  { label: "HOME", href: "/" },
  {
    label: "MBBS IN INDIA",
    href: "/mbbs-india",
    hasDropdown: true,
    children: [
      { label: "Government Seats", href: "/mbbs-india" },
      { label: "Private Colleges", href: "/mbbs-india" },
      { label: "Deemed Universities", href: "/mbbs-india" },
      { label: "Counselling Guidance", href: "/mbbs-india" },
    ],
  },
  {
    label: "MBBS ABROAD",
    href: "/mbbs-abroad",
    hasDropdown: true,
    children: [
      { label: "MBBS in Georgia", href: "/mbbs-abroad/georgia" },
      { label: "MBBS in Russia", href: "/mbbs-abroad/russia" },
      { label: "MBBS in Kazakhstan", href: "/mbbs-abroad/kazakhstan" },
      { label: "MBBS in Uzbekistan", href: "/mbbs-abroad/uzbekistan" },
      { label: "MBBS in Kyrgyzstan", href: "/mbbs-abroad/kyrgyzstan" },
      { label: "MBBS in Nepal", href: "/mbbs-abroad/nepal" },
    ],
  },
  { label: "UNIVERSITIES", href: "/universities" },
  { label: "SERVICES", href: "/services" },
  { label: "ABOUT US", href: "/about" },
  { label: "CONTACT US", href: "/contact" },
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
            href="tel:01202611111"
            className="w-10 h-10 rounded-full bg-[#0F4C81]/5 border border-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white transition-all duration-300"
          >
            <FaPhoneAlt size={14} />
          </a>
          <div className="text-right">
            <a
              href="tel:01202611111"
              className="text-[14px] font-black text-[#1a1a2e] hover:text-[#0F4C81] block leading-none transition-colors"
            >
              0120-2611111
            </a>
            <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block tracking-wider">
              (10AM - 7PM)
            </span>
          </div>
        </div>

        {/* ─── Mobile Hamburger ─── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-[#0F4C81] hover:bg-blue-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* ─── Mobile Slide-Down Menu ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-3 px-3 rounded-lg text-sm font-extrabold text-[#1a1a2e] hover:bg-blue-50 hover:text-[#0F4C81] transition-colors"
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <FaChevronDown className="text-[10px] opacity-40" />
                    )}
                  </Link>
                </div>
              ))}

              {/* Mobile CTA strip */}
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:01202611111"
                  className="flex items-center justify-center gap-2 bg-[#0F4C81] text-white font-bold py-3 px-5 rounded-xl text-sm flex-1"
                >
                  <FaPhoneAlt size={13} />
                  0120-2611111
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#107c41] text-white font-bold py-3 px-5 rounded-xl text-sm flex-1"
                >
                  <FaWhatsapp size={15} />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
