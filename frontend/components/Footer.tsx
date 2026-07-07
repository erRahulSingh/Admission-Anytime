"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStethoscope,
  FaWhatsapp,
  FaPaperPlane,
  FaGlobe,
} from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const pathname = usePathname();
  if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/lp"))) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Mock subscription
    console.log(`Subscribing ${email} to newsletter.`);
    setSuccess(true);
    setEmail("");
    setTimeout(() => setSuccess(false), 5000);
  };

  const flagCodes: Record<string, string> = {
    "Russia": "ru",
    "Georgia": "ge",
    "Kazakhstan": "kz",
    "Uzbekistan": "uz",
    "Kyrgyzstan": "kg",
    "Nepal": "np",
    "Armenia": "am",
    "Philippines": "ph",
    "Egypt": "eg",
  };

  const countriesList = [
    { name: "Russia", href: "/mbbs-abroad/russia" },
    { name: "Georgia", href: "/mbbs-abroad/georgia" },
    { name: "Kazakhstan", href: "/mbbs-abroad/kazakhstan" },
    { name: "Uzbekistan", href: "/mbbs-abroad/uzbekistan" },
    { name: "Kyrgyzstan", href: "/mbbs-abroad/kyrgyzstan" },
    { name: "Nepal", href: "/mbbs-abroad/nepal" },
    { name: "Armenia", href: "/mbbs-abroad/armenia" },
    { name: "Philippines", href: "/mbbs-abroad/philippines" },
    { name: "Egypt", href: "/mbbs-abroad/egypt" },
  ];

  return (
    <footer className="bg-[#0b1a27] text-white pt-10 pb-6 border-t border-slate-800 relative overflow-hidden">

      {/* WhatsApp Pulse Animation override */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.55; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        .whatsapp-pulse {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />

      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Column 1: Company details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-2.5 inline-block shadow-lg border border-slate-700/20 max-w-[200px]">
            <img
              src="/logo.png"
              alt="Admission Anytime Logo"
              className="h-10 w-auto object-contain mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = document.getElementById('footer-logo-fallback-text');
                if (textFallback) textFallback.classList.remove('hidden');
              }}
            />
            <div id="footer-logo-fallback-text" className="hidden text-center text-slate-900 font-black text-xs py-1 px-2">
              Admission <span className="text-[#c39b34]">Anytime</span>
            </div>
          </div>

          <p className="text-xs text-slate-350 leading-relaxed font-semibold">
            Leading medical education counselling and admission assistance platform helping medical aspirants secure admission in top recognized universities across India and internationally.
          </p>

          <div className="flex space-x-5 items-center">
            <a href="#" className="text-[#3b5998] hover:scale-120 hover:brightness-110 transition-all text-xl" title="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="text-[#1da1f2] hover:scale-120 hover:brightness-110 transition-all text-xl" title="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="text-[#e1306c] hover:scale-120 hover:brightness-110 transition-all text-xl" title="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="text-[#ff0000] hover:scale-120 hover:brightness-110 transition-all text-xl" title="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-6 border-l-4 border-[#c39b34] pl-3">
            Quick Links
          </h4>
          <ul className="space-y-3.5 text-xs text-slate-300 font-bold">
            {[
              { label: "Home Page", href: "/" },
              { label: "MBBS in India", href: "/mbbs-india" },
              { label: "MBBS Abroad Destinations", href: "/mbbs-abroad" },
              { label: "Search Universities", href: "/universities" },
              { label: "Consultancy Services", href: "/services" },
              { label: "About Us", href: "/about" },
            ].map((link, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <span className="text-[#c39b34] text-xs">•</span>
                <Link
                  href={link.href}
                  className="hover:text-[#c39b34] hover:underline transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Countries Grid with Dividers */}
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-6 border-l-4 border-[#c39b34] pl-3">
            MBBS Abroad Countries
          </h4>
          <div className="grid grid-cols-2 border border-slate-800/80 rounded-xl overflow-hidden divide-x divide-y divide-slate-800/85 bg-[#071320]/25">
            {countriesList.map((country, idx) => {
              const code = flagCodes[country.name] || "un";
              return (
                <Link
                  key={idx}
                  href={country.href}
                  className="flex items-center justify-between p-3.5 hover:bg-[#112335]/35 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={`https://flagcdn.com/w40/${code}.png`}
                      alt=""
                      className="w-5.5 h-auto object-cover rounded shadow-sm border border-slate-700/50 flex-shrink-0"
                    />
                    <span className="text-[11px] text-slate-300 group-hover:text-[#c39b34] font-black tracking-wide truncate transition-colors duration-250">
                      {country.name}
                    </span>
                  </div>
                  <FaGlobe className="text-slate-500/80 group-hover:text-[#c39b34] text-[10px] flex-shrink-0 transition-colors duration-250" />
                </Link>
              );
            })}
            {countriesList.length % 2 !== 0 && (
              <div className="p-3.5 bg-[#071320]/10" />
            )}
          </div>
        </div>

        {/* Column 4: Contact & Newsletter Subscription Pill */}
        <div className="space-y-6">
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-2 border-l-4 border-[#c39b34] pl-3">
            Contact Details
          </h4>
          <div className="space-y-4 text-xs text-slate-300 font-bold">
            <p className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-[#c39b34] mt-0.5 flex-shrink-0" />
              <span>
                Suite 402, Metro Plaza, Outer Ring Road, New Delhi, 110001
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <FaPhoneAlt className="text-[#c39b34] flex-shrink-0" />
              <a href="tel:+919876543210" className="hover:text-[#c39b34] hover:underline transition-colors">
                +91 98765 43210
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <FaEnvelope className="text-[#c39b34] flex-shrink-0" />
              <a href="mailto:info@admissionanytime.com" className="hover:text-[#c39b34] hover:underline transition-colors">
                info@admissionanytime.com
              </a>
            </p>
          </div>

          <div className="pt-2">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-wider">
              Subscribe to Newsletters
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center shadow-lg">
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1b2a3a]/30 border-2 border-[#c39b34] text-white rounded-full px-5 py-3 text-xs outline-none pr-14 focus:bg-[#1b2a3a]/55 transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-1 w-9.5 h-9.5 bg-[#c39b34] hover:bg-[#b08726] rounded-full flex items-center justify-center text-[#0b1a27] transition-all shadow-md active:scale-95"
              >
                <FaPaperPlane size={11} />
              </button>
            </form>
            {success && (
              <p className="text-[10px] text-emerald-400 font-semibold mt-2">
                Successfully subscribed! Thank you.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Official Partner Accord line */}
      <div className="max-w-[1280px] mx-auto px-4 mt-6">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-slate-400 py-4 border-b border-slate-800/80">
          <span className="text-[#c39b34] text-sm">🛡️</span>
          <span className="uppercase tracking-wider">Official Partner | Accredited Universities</span>
        </div>
      </div>

      {/* Footer base line */}
      <div className="max-w-[1280px] mx-auto px-4 mt-4 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[11px] gap-4 font-semibold">
        <p>© 2026 Admission Anytime. All Rights Reserved. ISO 9001:2015 Certified. 🏆</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-[#c39b34] hover:underline transition-colors">Privacy Policy</a>
          <span className="text-slate-700">|</span>
          <a href="#" className="hover:text-[#c39b34] hover:underline transition-colors">Terms & Conditions</a>
        </div>
      </div>

      {/* Floating WhatsApp Action Button with Radar Pulse ring */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        <span className="absolute w-14 h-14 bg-[#25D366] rounded-full whatsapp-pulse z-0" />
        <a
          href="https://wa.me/919876543210?text=Hi!%20I%20am%2520interested%2520in%2520Admission%2520Guidance"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl shadow-green-500/20"
          aria-label="WhatsApp Us"
        >
          <FaWhatsapp />
        </a>
      </div>

    </footer>
  );
}
