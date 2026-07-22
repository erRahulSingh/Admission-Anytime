"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch, FaUniversity, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaGlobe } from "react-icons/fa";
import api from "@/services/api";
import { University } from "@/types";

// Static fallback data for standalone execution
const fallbackUnis: Partial<University>[] = [
  {
    name: "Tbilisi State Medical University",
    country: { name: "Georgia", slug: "georgia" } as any,
    tuitionFee: "$5,000 / Year",
    ranking: "Country Rank: 4, World Rank: 3840",
    courseDuration: "6 Years",
    logo: "",
  },
  {
    name: "Kazan Federal University",
    country: { name: "Russia", slug: "russia" } as any,
    tuitionFee: "3,80,000 Rubles / Year",
    ranking: "World Rank: 347",
    courseDuration: "6 Years",
    logo: "",
  },
  {
    name: "Astana Medical University",
    country: { name: "Kazakhstan", slug: "kazakhstan" } as any,
    tuitionFee: "$3,500 / Year",
    ranking: "Country Rank: 3",
    courseDuration: "5 Years",
    logo: "",
  },
  {
    name: "Batumi Shota Rustaveli State University",
    country: { name: "Georgia", slug: "georgia" } as any,
    tuitionFee: "$4,500 / Year",
    ranking: "Country Rank: 8",
    courseDuration: "6 Years",
    logo: "",
  },
  {
    name: "Tashkent Medical Academy",
    country: { name: "Uzbekistan", slug: "uzbekistan" } as any,
    tuitionFee: "$4,000 / Year",
    ranking: "Country Rank: 2",
    courseDuration: "5 Years",
    logo: "",
  },
  {
    name: "Osh State University",
    country: { name: "Kyrgyzstan", slug: "kyrgyzstan" } as any,
    tuitionFee: "$3,200 / Year",
    ranking: "Country Rank: 5",
    courseDuration: "5 Years",
    logo: "",
  },
  {
    name: "Yerevan State Medical University",
    country: { name: "Armenia", slug: "armenia" } as any,
    tuitionFee: "$5,500 / Year",
    ranking: "Country Rank: 3",
    courseDuration: "6 Years",
    logo: "",
  },
  {
    name: "University of Santo Tomas",
    country: { name: "Philippines", slug: "philippines" } as any,
    tuitionFee: "$4,800 / Year",
    ranking: "World Rank: 801",
    courseDuration: "5 Years",
    logo: "",
  },
  {
    name: "Cairo University",
    country: { name: "Egypt", slug: "egypt" } as any,
    tuitionFee: "$6,000 / Year",
    ranking: "Country Rank: 1",
    courseDuration: "5 Years",
    logo: "",
  },
  {
    name: "Kathmandu University School of Medical Sciences",
    country: { name: "Nepal", slug: "nepal" } as any,
    tuitionFee: "$8,000 / Year",
    ranking: "Country Rank: 2",
    courseDuration: "5.5 Years",
    logo: "",
  }
];

export default function UniversitiesFinderPage() {
  const [unis, setUnis] = useState<Partial<University>[]>([]);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUniversities() {
      try {
        setLoading(true);
        let url = "/universities";
        const params: string[] = [];
        if (countryFilter) params.push(`country=${countryFilter}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        
        if (params.length > 0) {
          url += "?" + params.join("&");
        }

        const data: any = await api.get(url);
        if (data && data.success) {
          setUnis(data.universities);
        }
      } catch (err: unknown) {
        console.warn("Failed loading universities from backend. Fallback to mock data.");
        // Filter fallback static list locally
        let list = [...fallbackUnis];
        if (search) {
          list = list.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));
        }
        if (countryFilter) {
          list = list.filter(u => (u.country as any).name?.toLowerCase() === countryFilter.toLowerCase());
        }
        setUnis(list);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadUniversities();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, countryFilter]);

  return (
    <div className="relative bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f1f5f9] min-h-screen py-6 sm:py-12 md:py-20 overflow-hidden">
      {/* Premium blurred ambient background shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-3.5 sm:px-6 space-y-8 sm:space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-primary-500 bg-primary-50 px-3.5 sm:px-4 py-1.5 rounded-full">
            University Finder
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-text-dark">
            Find Your Ideal Medical College
          </h1>
          <p className="text-text-muted text-xs sm:text-sm md:text-base">
            Search, filter, and compare top WHO and NMC-approved government universities in India and abroad.
          </p>
        </div>

        {/* Search controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-premium border border-slate-100 shadow-md flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
          
          {/* Input field */}
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by college name (e.g. Tbilisi State)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Filter dropdown */}
          <div className="w-full md:w-60">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Countries</option>
              <option value="India">India</option>
              <option value="Russia">Russia</option>
              <option value="Georgia">Georgia</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Nepal">Nepal</option>
              <option value="Armenia">Armenia</option>
              <option value="Philippines">Philippines</option>
              <option value="Egypt">Egypt</option>
            </select>
          </div>

        </div>

        {/* Results grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : unis.length === 0 ? (
          <div className="bg-white rounded-premium p-12 text-center border border-slate-100 text-text-muted space-y-4">
            <FaUniversity className="text-5xl text-slate-200 mx-auto" />
            <h3 className="text-lg font-bold text-text-dark">No Universities Found</h3>
            <p className="text-xs">Try clearing search phrases or choosing a different country filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unis.map((uni, idx) => {
              const countryName = (uni.country as any)?.name || "Abroad";
              const countrySlug = (uni.country as any)?.slug?.toLowerCase() || "georgia";
              const flagCodeMap: Record<string, string> = {
                russia: "ru",
                georgia: "ge",
                kazakhstan: "kz",
                uzbekistan: "uz",
                kyrgyzstan: "kg",
                nepal: "np",
                armenia: "am",
                philippines: "ph",
                egypt: "eg",
                india: "in",
              };
              const flagCode = flagCodeMap[countrySlug] || "ge";

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 border-l-[4px] border-l-[#0c2e60] hover:border-l-[#f9a825] shadow-md hover:shadow-2xl hover:shadow-[#0c2e60]/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Row: Icon + Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#0c2e60] to-[#0F4C81] text-[#f9a825] rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <FaUniversity />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                          NMC & WHO Approved
                        </span>
                        <span className="bg-slate-100 border border-slate-200 text-[#0c2e60] px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-2xs">
                          <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={`https://flagcdn.com/w80/${flagCode}.png`}
                              alt={`${countryName} Flag`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{countryName}</span>
                        </span>
                      </div>
                    </div>

                    {/* Title & Ranking */}
                    <div className="space-y-1.5 pt-1">
                      <h3 className="text-base sm:text-lg font-black text-[#0c2e60] leading-snug group-hover:text-[#0F4C81] transition-colors">
                        {uni.name}
                      </h3>
                      {uni.ranking && (
                        <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                          🏆 {uni.ranking}
                        </span>
                      )}
                    </div>

                    {/* Info Pills */}
                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
                      <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                        <span className="flex items-center gap-2 text-slate-500">
                          <FaMoneyBillWave className="text-emerald-600 text-sm" /> Tuition Fee
                        </span>
                        <span className="font-extrabold text-[#0c2e60] text-xs">
                          {uni.tuitionFee || "Contact for Fee"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                        <span className="flex items-center gap-2 text-slate-500">
                          <FaClock className="text-[#0F4C81] text-sm" /> Duration
                        </span>
                        <span className="font-bold text-[#0c2e60] text-xs">
                          {uni.courseDuration || "5 - 6 Years"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-5 pt-0">
                    <Link
                      href="/contact"
                      className="w-full text-center bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold py-3 rounded-xl transition-all duration-300 text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 group-hover:bg-[#0F4C81]"
                    >
                      <span>Apply for Direct Admission</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
