"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Mock subscription
    console.log(`Subscribing ${email} to newsletter.`);
    setSuccess(true);
    setEmail("");
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <footer className="bg-[#0b1c2c] text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Company details */}
        <div className="space-y-5">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Admission Anytime Logo"
              className="h-14 w-auto object-contain bg-white rounded-lg p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = document.getElementById('footer-logo-fallback');
                if (textFallback) textFallback.classList.remove('hidden');
              }}
            />
            <div id="footer-logo-fallback" className="hidden flex items-center space-x-2">
              <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white">
                <FaStethoscope className="text-lg" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight block leading-none">
                  Admission<span className="text-secondary-500 font-bold">Anytime</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] font-semibold text-slate-400">
                  Admission Consultancy
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Leading ISO 9001:2015 certified medical education consultant in India. 
            Empowering medical aspirants to choose top NMC & WHO recognized universities globally.
          </p>
          <div className="flex space-x-3">
            {[
              { icon: <FaFacebookF />, url: "#" },
              { icon: <FaTwitter />, url: "#" },
              { icon: <FaInstagram />, url: "#" },
              { icon: <FaYoutube />, url: "#" },
            ].map((soc, i) => (
              <a
                key={i}
                href={soc.url}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors duration-300 text-sm text-slate-300"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-base font-bold text-white mb-6 border-l-4 border-secondary-500 pl-3">
            Quick Links
          </h4>
          <ul className="space-y-3.5 text-sm text-slate-300">
            <li>
              <Link href="/" className="hover:text-secondary-500 hover:underline transition-all">
                Home Page
              </Link>
            </li>
            <li>
              <Link href="/mbbs-india" className="hover:text-secondary-500 hover:underline transition-all">
                MBBS in India
              </Link>
            </li>
            <li>
              <Link href="/mbbs-abroad" className="hover:text-secondary-500 hover:underline transition-all">
                MBBS Abroad Destinations
              </Link>
            </li>
            <li>
              <Link href="/universities" className="hover:text-secondary-500 hover:underline transition-all">
                Search Universities
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-secondary-500 hover:underline transition-all">
                Consultancy Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-secondary-500 hover:underline transition-all">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Countries */}
        <div>
          <h4 className="text-base font-bold text-white mb-6 border-l-4 border-secondary-500 pl-3">
            MBBS Abroad Countries
          </h4>
          <ul className="space-y-3.5 text-sm text-slate-300">
            <li>
              <Link href="/mbbs-abroad/georgia" className="hover:text-secondary-500 hover:underline transition-all">
                MBBS in Georgia
              </Link>
            </li>
            <li>
              <Link href="/mbbs-abroad/russia" className="hover:text-secondary-500 hover:underline transition-all">
                MBBS in Russia
              </Link>
            </li>
            <li>
              <Link href="/mbbs-abroad/kazakhstan" className="hover:text-secondary-500 hover:underline transition-all">
                MBBS in Kazakhstan
              </Link>
            </li>
            <li>
              <Link href="/mbbs-abroad/uzbekistan" className="hover:text-secondary-500 hover:underline transition-all">
                MBBS in Uzbekistan
              </Link>
            </li>
            <li>
              <Link href="/mbbs-abroad/kyrgyzstan" className="hover:text-secondary-500 hover:underline transition-all">
                MBBS in Kyrgyzstan
              </Link>
            </li>
            <li>
              <Link href="/mbbs-abroad/nepal" className="hover:text-secondary-500 hover:underline transition-all">
                MBBS in Nepal
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Newsletter */}
        <div className="space-y-5">
          <h4 className="text-base font-bold text-white mb-2 border-l-4 border-secondary-500 pl-3">
            Contact Details
          </h4>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-secondary-500 mt-1 flex-shrink-0" />
              <span>
                Suite 402, Metro Plaza, Outer Ring Road, New Delhi, 110001
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <FaPhoneAlt className="text-secondary-500 flex-shrink-0" />
              <a href="tel:+919876543210" className="hover:underline">
                +91 98765 43210
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <FaEnvelope className="text-secondary-500 flex-shrink-0" />
              <a href="mailto:info@mbbsconsultancy.com" className="hover:underline">
                info@mbbsconsultancy.com
              </a>
            </p>
          </div>

          <div className="pt-2">
            <p className="text-xs font-bold uppercase text-slate-400 mb-2.5">
              Subscribe to Newsletters
            </p>
            <form onSubmit={handleSubscribe} className="relative flex">
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-l-xl px-4 py-2 text-xs outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 rounded-r-xl px-4 text-xs font-bold transition-all flex items-center justify-center text-white"
              >
                <FaPaperPlane />
              </button>
            </form>
            {success && (
              <p className="text-[10px] text-accent-500 font-semibold mt-1.5">
                Successfully subscribed! Thank you.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer base line */}
      <div className="max-w-[1280px] mx-auto px-4 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs gap-4">
        <p>© 2026 MBBS Advisor. All Rights Reserved. ISO 9001:2015 Certified.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-secondary-500">Privacy Policy</a>
          <a href="#" className="hover:text-secondary-500">Terms & Conditions</a>
          <Link href="/admin/login" className="hover:text-secondary-500 font-semibold flex items-center gap-1">
            Admin Login
          </Link>
        </div>
      </div>

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/919876543210?text=Hi!%20I%20am%20interested%20in%20MBBS%20Admission"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl shadow-green-500/20"
        aria-label="WhatsApp Us"
      >
        <FaWhatsapp />
      </a>
    </footer>
  );
}
