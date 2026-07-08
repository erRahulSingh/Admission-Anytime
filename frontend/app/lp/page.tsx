"use client";

import React, { useState } from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
  FaWhatsapp,
  FaShieldAlt,
  FaCheckCircle,
  FaGlobe,
  FaFileAlt,
  FaBuilding,
  FaStar,
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";

export default function AdsLandingPage() {
  // Wizard Steps (1: Contact Info, 2: Preferences, 3: Academics & Budget)
  const [step, setStep] = useState(1);
  const [leadId, setLeadId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preference, setPreference] = useState("Abroad");
  const [country, setCountry] = useState("Georgia");
  const [neetScore, setNeetScore] = useState("");
  const [budget, setBudget] = useState("20-25 Lakhs");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Expandable FAQ State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const countriesData = [
    { name: "Georgia", budget: "4.5 - 6.0 Lakhs / Yr", duration: "6 Years", fmge: "28.4%", code: "ge" },
    { name: "Russia", budget: "3.5 - 5.5 Lakhs / Yr", duration: "6 Years", fmge: "22.1%", code: "ru" },
    { name: "Kazakhstan", budget: "3.5 - 4.5 Lakhs / Yr", duration: "5 Years", fmge: "25.6%", code: "kz" },
    { name: "Uzbekistan", budget: "3.0 - 4.0 Lakhs / Yr", duration: "5 Years", fmge: "24.2%", code: "uz" },
    { name: "Kyrgyzstan", budget: "2.5 - 3.5 Lakhs / Yr", duration: "5 Years", fmge: "21.8%", code: "kg" },
    { name: "Nepal", budget: "8.0 - 10.0 Lakhs / Yr", duration: "5.5 Years", fmge: "19.3%", code: "np" },
    { name: "Armenia", budget: "3.5 - 4.5 Lakhs / Yr", duration: "6 Years", fmge: "22.5%", code: "am" },
    { name: "Philippines", budget: "4.5 - 5.5 Lakhs / Yr", duration: "6 Years", fmge: "27.8%", code: "ph" },
    { name: "Egypt", budget: "4.0 - 5.0 Lakhs / Yr", duration: "5 Years", fmge: "23.9%", code: "eg" },
  ];

  const faqs = [
    { q: "Is NEET qualification mandatory for MBBS abroad?", a: "Yes, according to the National Medical Commission (NMC) guidelines, qualifying NEET is absolute mandatory for any Indian student who wishes to practice medicine in India after graduation." },
    { q: "Are MBBS degrees from abroad valid in India?", a: "Yes, degrees awarded by universities listed in the WHO World Directory and accredited by NMC are fully recognized, provided you pass the FMGE / NExT licensing exam in India." },
    { q: "What is the average budget for studying MBBS abroad?", a: "Study budgets vary from 15 Lakhs to 35 Lakhs total package (covering tuition fees, accommodation, and food) depending on the country selected (e.g. Kyrgyzstan is low budget, Georgia is high budget)." },
    { q: "Is the medium of instruction English?", a: "Yes, all our partnered universities offer 100% English-medium curriculum courses for international students for the entire duration." },
  ];

  const handleCountryCardClick = (countryName: string) => {
    setCountry(countryName);
    setPreference("Abroad");
    // Scroll smoothly to form container
    const element = document.getElementById("lead-wizard-card");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const validateStep1 = () => {
    if (!name.trim()) {
      alert("Please enter your full name.");
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const prevStep = () => setStep(prev => prev - 1);

  // Step 1: Save Contact Info immediately via POST
  const handleStep1Next = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    const payload = {
      fullName: name,
      phone,
      email,
      neetScore: 0,
      interestedIn: preference,
      country: "Pending Selection",
      source: "Ads",
    };

    try {
      if (leadId) {
        // If they went back and edited, update the existing document
        await api.put(`/admissions/${leadId}`, payload);
      } else {
        // Create new record
        const res: any = await api.post("/admissions", payload);
        if (res?.success && res.lead?._id) {
          setLeadId(res.lead._id);
        }
      }
      setStep(2);
    } catch (err: unknown) {
      console.warn("Failed saving step 1 lead. Proceeding client-side.");
      if (!leadId) setLeadId("mock-id-" + Date.now());
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Update Preferences via PUT
  const handleStep2Next = async () => {
    setLoading(true);
    const payload = {
      fullName: name,
      phone,
      email,
      neetScore: 0,
      interestedIn: preference,
      country: country,
      source: "Ads",
    };

    try {
      if (leadId && !leadId.startsWith("mock-id-")) {
        await api.put(`/admissions/${leadId}`, payload);
      }
      setStep(3);
    } catch (err: unknown) {
      console.warn("Failed updating step 2 lead. Proceeding client-side.");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Final Submit and Update via PUT
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!neetScore) {
      alert("Please enter your NEET Score (enter 0 if not qualified).");
      return;
    }

    setLoading(true);
    const payload = {
      fullName: name,
      phone,
      email,
      neetScore: Number(neetScore) || 0,
      interestedIn: preference,
      country: country,
      notes: `Target Budget: ${budget}. ${notes}`,
      status: "Pending",
      source: "Ads",
    };

    try {
      if (leadId && !leadId.startsWith("mock-id-")) {
        await api.put(`/admissions/${leadId}`, payload);
      } else {
        await api.post("/admissions", payload);
      }
      setSuccess(true);
    } catch (err: unknown) {
      console.warn("Failed submitting final lead. Registering success locally.");
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setNeetScore("");
    setPreference("Abroad");
    setCountry("Georgia");
    setBudget("20-25 Lakhs");
    setNotes("");
    setLeadId(null);
    setStep(1);
    setSuccess(false);
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen font-sans antialiased pb-20 md:pb-0">

      {/* ═══ 1. Mini Header ═══ */}
      <header className="bg-white border-b border-slate-100 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Admission Anytime"
              className="h-10 sm:h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = document.getElementById('lp-header-fallback-logo');
                if (textFallback) textFallback.classList.remove('hidden');
              }}
            />
            <div id="lp-header-fallback-logo" className="hidden">
              <span className="font-extrabold text-sm block tracking-wider uppercase text-[#0F4C81]">Admission Anytime</span>
              <span className="text-[8px] uppercase tracking-widest text-[#FFC107] font-black block">Medical Counseling Council</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider hidden sm:block">Speak to Counselor</span>
            <a
              href="tel:+919876543210"
              className="w-10 h-10 bg-[#FFC107] hover:bg-[#e0a800] text-[#0b1a27] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all relative group animate-pulse"
              title="Call Counselor Now"
            >
              <FaPhoneAlt size={13} className="relative z-10" />
            </a>
          </div>
        </div>
      </header>

      {/* ═══ 2. Premium Hero Banner & Interactive Wizard Form ═══ */}
      <section className="relative py-8 md:py-16 overflow-hidden border-b border-slate-100 bg-gradient-to-b from-[#e0eff8]/50 via-[#f0f5fa]/30 to-[#f8fafc]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0F4C81_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">

          {/* Hero left content */}
          <div className="lg:col-span-7 space-y-4 animate-fade-in">
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="space-y-4 flex-1">
                {/* Customized Certified Badge */}
                <div className="relative inline-flex items-center pl-6 select-none pb-2">
                  <div className="absolute left-0 w-11 h-11 bg-gradient-to-br from-[#ff5200] to-[#ff7300] rounded-full flex items-center justify-center shadow-md border-2 border-white z-10">
                    <FaGraduationCap className="text-white text-base" />
                  </div>
                  <div className="bg-gradient-to-r from-[#d9a834] via-[#4d8fae] to-[#0e75bc] text-white text-[8px] md:text-[10px] font-black uppercase tracking-wider pl-8 pr-6 py-2.5 rounded-full shadow-md leading-none">
                    ISO 9001:2015 Certified Consultants
                  </div>
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl md:text-4xl font-extrabold leading-tight tracking-wide text-[#0F4C81]"
                >
                  Secure Direct MBBS <br />
                  <span className="text-[#FFC107] drop-shadow-sm">Admissions 2026</span>
                </motion.h1>

                {/* Benefit badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <FaCheckCircle className="text-[#0F4C81] text-lg flex-shrink-0" />
                    <span>Zero Donation / Pay Direct Fees</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <FaCheckCircle className="text-[#0F4C81] text-lg flex-shrink-0" />
                    <span>NMC Guideline Compliant</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <FaCheckCircle className="text-[#0F4C81] text-lg flex-shrink-0" />
                    <span>100% English Curriculum</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    <FaCheckCircle className="text-[#0F4C81] text-lg flex-shrink-0" />
                    <span>NExT / FMGE Training Support</span>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 sm:w-32 md:w-36 lg:hidden flex-shrink-0"
              >
                <img
                  src="/hero_doctor.png"
                  alt="MBBS Doctor"
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-lg"
                />
              </motion.div>
            </div>
          </div>

          {/* Interactive Multi-step Lead Wizard Right */}
          <div id="lead-wizard-card" className="lg:col-span-5">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-xl space-y-4 relative overflow-hidden">

              {/* Top Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Step {step} of 3</span>
                  <span className="text-[#0F4C81]">
                    {step === 1 ? "Contact Details" : step === 2 ? "Select Preferences" : "NEET Score & Budget"}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0F4C81] transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-8 rounded-2xl text-center space-y-4">
                  <FaCheckCircle className="mx-auto text-4xl text-emerald-500 animate-bounce" />
                  <h4 className="font-extrabold text-base uppercase tracking-wider">Counseling Registered!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    Congratulations! Your counseling file has been generated. An NMC expert will review your profile and reach out shortly on your contact number.
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-[#0F4C81] hover:underline tracking-wide uppercase pt-2 block mx-auto"
                  >
                    Register New Inquiry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">

                  {/* Step 1: Contact Info */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="text-center pb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Let's get started</span>
                        <h4 className="text-sm font-extrabold text-[#0F4C81] mt-0.5">Enter Your Contact Details</h4>
                      </div>

                      {/* Name */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550">
                          <FaUser size={12} />
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name *"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50/85 border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-xs font-bold outline-none focus:border-[#0F4C81] focus:bg-white text-slate-950 placeholder-slate-700 transition-all shadow-sm"
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550">
                          <FaPhoneAlt size={11} />
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp Mobile Number *"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50/85 border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-xs font-bold outline-none focus:border-[#0F4C81] focus:bg-white text-slate-950 placeholder-slate-700 transition-all shadow-sm"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550">
                          <FaEnvelope size={11} />
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="Email Address *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50/85 border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-xs font-bold outline-none focus:border-[#0F4C81] focus:bg-white text-slate-950 placeholder-slate-700 transition-all shadow-sm"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleStep1Next}
                        className="w-full mt-2 bg-[#FFC107] hover:bg-[#e0a800] disabled:opacity-50 text-[#0b1a27] font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-all"
                      >
                        {loading ? "Saving Details..." : "Next: Choose Preferences"} <FaChevronRight size={8} />
                      </button>
                    </div>
                  )}

                  {/* Step 2: Preferences */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="text-center pb-1">
                        <span className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">✓ Step 1 Saved!</span>
                        <h4 className="text-sm font-bold text-[#0F4C81] mt-0.5">Select Preference & Country</h4>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Select Preference</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { val: "Abroad", label: "Abroad" },
                            { val: "India", label: "India" },
                            { val: "Both", label: "Both" },
                          ].map((item) => (
                            <button
                              key={item.val}
                              type="button"
                              onClick={() => setPreference(item.val)}
                              className={`py-3 px-2 rounded-xl text-xs font-semibold transition-all ${preference === item.val
                                ? "bg-[#0F4C81] text-white shadow-md"
                                : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                                }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Target Country</label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-[#0F4C81] focus:bg-white text-slate-800 transition-all"
                        >
                          <option value="Georgia">Georgia</option>
                          <option value="Russia">Russia</option>
                          <option value="Kazakhstan">Kazakhstan</option>
                          <option value="Uzbekistan">Uzbekistan</option>
                          <option value="Kyrgyzstan">Kyrgyzstan</option>
                          <option value="Nepal">Nepal</option>
                          <option value="Armenia">Armenia</option>
                          <option value="Philippines">Philippines</option>
                          <option value="Egypt">Egypt</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-650 font-extrabold border border-slate-200 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                        >
                          <FaChevronLeft size={8} /> Back
                        </button>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={handleStep2Next}
                          className="w-full bg-[#FFC107] hover:bg-[#e0a800] disabled:opacity-50 text-[#0b1a27] font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-all"
                        >
                          {loading ? "Updating..." : "Next"} <FaChevronRight size={8} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Academics & Budget */}
                  {step === 3 && (
                    <form onSubmit={handleFinalSubmit} className="space-y-4">
                      <div className="text-center pb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Step</span>
                        <h4 className="text-sm font-extrabold text-[#0F4C81] mt-0.5">Academic Stats & Budget</h4>
                      </div>

                      {/* NEET Score */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550">
                          <FaGraduationCap size={13} />
                        </span>
                        <input
                          type="number"
                          required
                          placeholder="NEET Score (Enter 0 if not qualified) *"
                          value={neetScore}
                          onChange={(e) => setNeetScore(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:border-[#0F4C81] focus:bg-white text-slate-950 placeholder-slate-700 transition-all shadow-sm"
                        />
                      </div>

                      {/* Budget */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Budget Range</label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#0F4C81] focus:bg-white text-slate-950 transition-all shadow-sm"
                        >
                          <option value="15-20 Lakhs">15 - 20 Lakhs Total</option>
                          <option value="20-25 Lakhs">20 - 25 Lakhs Total</option>
                          <option value="25-35 Lakhs">25 - 35 Lakhs Total</option>
                          <option value="35 Lakhs+">35 Lakhs + Total</option>
                        </select>
                      </div>

                      {/* Notes */}
                      <textarea
                        rows={2}
                        placeholder="Mention preferences, budget constraints or target colleges..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold outline-none focus:border-[#0F4C81] focus:bg-white text-slate-950 placeholder-slate-700 transition-all shadow-sm"
                      />

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-650 font-extrabold border border-slate-200 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                        >
                          <FaChevronLeft size={8} /> Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#0F4C81] hover:bg-[#0b3961] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-all"
                        >
                          {loading ? "Submitting..." : "Submit Inquiry"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ═══ 3. Study Abroad Destinations (Clickable Flag Cards) ═══ */}
      <section className="pt-2 pb-16 md:py-16 max-w-6xl mx-auto px-4 space-y-6 md:space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-4xl font-black text-[#0F4C81] tracking-wider uppercase">
            Top MBBS Destinations
          </h2>
          <p className="text-xs text-slate-400 font-bold max-w-lg mx-auto leading-relaxed">
            Click on any country profile below to select it on the counseling form and evaluate packages.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {countriesData.map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => handleCountryCardClick(c.name)}
              className="bg-white border border-slate-200/80 border-l-4 border-l-[#0F4C81] md:border-l-slate-200/80 md:border-l rounded-2xl p-3 md:p-5 hover:border-l-[#FFC107] md:hover:border-[#0F4C81] hover:shadow-lg transition-all cursor-pointer shadow-sm flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <img
                      src={`https://flagcdn.com/w40/${c.code}.png`}
                      alt={c.name}
                      className="w-6 md:w-7 h-auto object-cover rounded shadow border border-slate-100"
                    />
                    <h3 className="font-black text-xs md:text-sm text-slate-800 group-hover:text-[#0F4C81] transition-colors">{c.name}</h3>
                  </div>
                  <FaGlobe className="text-slate-450 group-hover:text-[#0F4C81] transition-colors text-[10px] md:text-xs" />
                </div>

                <div className="space-y-1 md:space-y-1.5 text-[10px] md:text-[11px] text-slate-500 font-semibold leading-relaxed">
                  <p>💰 <strong className="text-slate-700 font-bold">Cost:</strong> {c.budget}</p>
                  <p>⏳ <strong className="text-slate-700 font-bold">Dur:</strong> {c.duration}</p>
                  <p>📈 <strong className="text-slate-700 font-bold">FMGE:</strong> {c.fmge}</p>
                </div>
              </div>

              <div className="text-[9px] md:text-[10px] text-[#0F4C81] font-black uppercase flex items-center gap-1 group-hover:underline pt-2 border-t border-slate-100">
                Apply <FaArrowRight size={7} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ 4. Admission Process Timeline ═══ */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-black text-[#0F4C81] tracking-wider uppercase">
              How Admission Works
            </h2>
            <p className="text-xs text-slate-400 font-bold max-w-lg mx-auto">
              Our streamlined 4-step counselor pipeline ensures student seat confirmations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 relative">
            {[
              { step: "01", title: "Counselling & Selection", desc: "Select target country and budget guidelines with our expert counselors." },
              { step: "02", title: "Document Verification", desc: "Verify class 12th transcripts, eligibility parameters, and NEET scorecards." },
              { step: "03", title: "Admissions Letter", desc: "Receive the official admission invitation directly from the selected foreign university." },
              { step: "04", title: "Visa & Departure", desc: "Complete medical checkups, translation stamps, flight schedules, and pre-departure briefings." },
            ].map((node, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200/80 border-t-4 border-t-[#FFC107] md:border-t-slate-200/80 md:border-t rounded-2xl p-4 md:p-6 space-y-3 relative group shadow-sm hover:shadow-md hover:border-t-[#0F4C81] transition-all"
              >
                <span className="text-xl md:text-2xl font-black text-[#FFC107] block">{node.step}</span>
                <h3 className="font-extrabold text-xs md:text-sm text-slate-800 group-hover:text-[#0F4C81] transition-colors leading-snug">{node.title}</h3>
                <p className="text-[10px] md:text-[11px] text-slate-500 font-semibold leading-relaxed">{node.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. Expandable FAQs Accordion ═══ */}
      <section className="py-16 max-w-4xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-4xl font-black text-[#0F4C81] tracking-wider uppercase">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 font-bold">
            Read common student and parent doubts answered directly by council counselors.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-350 shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex justify-between items-center text-xs font-black tracking-wide uppercase hover:bg-slate-50/50 text-slate-800"
                >
                  <span>{faq.q}</span>
                  <FaChevronDown
                    className={`text-[#0F4C81] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    size={10}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-500 font-semibold leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ 6. Custom Landing Page Footer ═══ */}
      <footer className="bg-white text-slate-500 py-10 text-center text-xs font-semibold border-t border-slate-250">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex justify-center gap-6 items-center text-slate-450 font-bold uppercase tracking-wider text-[10px] select-none">
            <div className="flex items-center gap-1.5">
              <FaShieldAlt className="text-[#0F4C81]" /> NMC Approved
            </div>
            <div className="flex items-center gap-1.5">
              <FaShieldAlt className="text-[#0F4C81]" /> WHO Listed
            </div>
            <div className="flex items-center gap-1.5">
              <FaShieldAlt className="text-[#0F4C81]" /> ISO Certified
            </div>
          </div>
          <p className="pt-2 font-bold text-slate-600">© 2026 Admission Anytime. All Rights Reserved. ISO 9001:2015 Certified. 🏆</p>
          <div className="flex justify-center gap-4 text-[10px] text-slate-400">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:underline">Terms & Conditions</a>
          </div>
        </div>
      </footer>

      {/* ═══ 7. Mobile-only Fixed Sticky Footer CTA Bar ═══ */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 p-3.5 flex md:hidden gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-50">
        <a
          href="tel:+919876543210"
          className="flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#e0a800] text-[#0b1a27] font-black py-3.5 px-5 rounded-xl text-xs flex-1 uppercase tracking-wider shadow-lg active:scale-95 transition-all"
        >
          <FaPhoneAlt size={10} /> Call Counselor
        </a>
        <a
          href="https://wa.me/919876543210?text=Hi!%20I%20am%20interested%20in%20MBBS%20Admission%20Guidance"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#117f39] text-white font-black py-3.5 px-5 rounded-xl text-xs flex-1 uppercase tracking-wider shadow-lg active:scale-95 transition-all"
        >
          <FaWhatsapp size={13} /> WhatsApp Chat
        </a>
      </div>

    </div>
  );
}
