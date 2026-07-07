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
      } catch (err) {
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
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-500 bg-primary-50 px-4 py-1.5 rounded-full">
            University Finder
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-text-dark">
            Find Your Ideal Medical College
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Search, filter, and compare top WHO and NMC-approved government universities in India and abroad.
          </p>
        </div>

        {/* Search controls */}
        <div className="bg-white p-6 rounded-premium border border-slate-100 shadow-md flex flex-col md:flex-row gap-4 items-center">
          
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
            {unis.map((uni, idx) => (
              <div
                key={idx}
                className="bg-white rounded-premium border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6 md:p-8 space-y-5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      <FaUniversity />
                    </div>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <FaGlobe className="text-[9px]" /> {(uni.country as any)?.name || "Abroad"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-text-dark leading-snug group-hover:text-primary-500 transition-colors">
                      {uni.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 block mt-1">{uni.ranking}</span>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-50 text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-secondary-500" />
                      <span><strong>Tuition:</strong> {uni.tuitionFee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-primary-500" />
                      <span><strong>Course Duration:</strong> {uni.courseDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-50/50 mt-4 bg-slate-50/20">
                  <Link
                    href={`/contact`}
                    className="w-full text-center block bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all duration-300 text-xs shadow-sm hover:shadow-md"
                  >
                    Apply for Direct Admission
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
