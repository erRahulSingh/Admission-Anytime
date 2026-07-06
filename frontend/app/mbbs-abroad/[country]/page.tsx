"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { FaGraduationCap, FaArrowLeft, FaCheckCircle, FaMoneyBillWave, FaClock, FaUniversity } from "react-icons/fa";
import api from "@/services/api";
import { Country, University } from "@/types";

// Static mock fallback databases for offline rendering
const fallbackCountries: Record<string, Partial<Country>> = {
  georgia: {
    name: "Georgia",
    averageCost: "₹3.5 - ₹5.5 Lakhs / Year",
    duration: "6 Years (including internship)",
    fmgePassingRate: "28.4% (Highest average)",
    language: "English Medium",
    description: "Georgia has emerged as one of the top destinations for MBBS. The medical degrees are globally recognized by WHO, NMC (MCI), and FAIMER, and programs are offered 100% in English.",
    benefits: [
      "100% English Medium Curriculum",
      "No Donation or Entrance Exams like IELTS/TOEFL",
      "WHO and NMC (MCI) Approved Universities",
      "Extremely safe European environment for female students"
    ],
    requirements: ["Minimum 50% in PCB in 12th", "NEET Qualification mandatory"],
  },
  russia: {
    name: "Russia",
    averageCost: "₹2.5 - ₹4.5 Lakhs / Year",
    duration: "6 Years",
    fmgePassingRate: "21.8%",
    language: "English / Russian",
    description: "Russia is a historic leader in medical education. It offers state-of-the-art laboratory infrastructure, highly subsidized fees by the Russian government, and high quality clinical rotations.",
    benefits: [
      "Highly subsidized Russian Govt medical seats",
      "Low cost of living and affordable tuition fees",
      "Well-equipped diagnostic laboratories",
      "Dual degree options in European networks"
    ],
    requirements: ["50% in PCB in 12th (40% for SC/ST)", "NEET Qualified"],
  },
  kazakhstan: {
    name: "Kazakhstan",
    averageCost: "₹2.2 - ₹3.5 Lakhs / Year",
    duration: "5 Years",
    fmgePassingRate: "19.5%",
    language: "English Medium",
    description: "Kazakhstan offers an affordable alternative for MBBS. With close proximity to India, excellent NMC passing record, and structured clinical practice, it is rapidly gaining popularity.",
    benefits: [
      "Very close to India (only 4-hour flight)",
      "Lowest budget MBBS programs in Central Asia",
      "English medium curriculum",
      "Modern, student-centric cities like Almaty"
    ],
    requirements: ["Minimum 50% in PCB in 12th", "NEET Qualified"],
  }
};

const fallbackUniversities: Record<string, Partial<University>[]> = {
  georgia: [
    {
      name: "Tbilisi State Medical University",
      tuitionFee: "$5,000 / Year",
      hostelFee: "$1,000 / Year",
      ranking: "Country Rank: 4, World Rank: 3840",
      established: "1918",
      mediumOfInstruction: "English",
      courseDuration: "6 Years",
      keyHighlights: ["Oldest and largest medical university in Georgia", "Highly clinical curriculum", "WHO listed"],
    },
    {
      name: "Batumi Shota Rustaveli State University",
      tuitionFee: "$4,500 / Year",
      hostelFee: "$800 / Year",
      ranking: "Country Rank: 8",
      established: "1935",
      mediumOfInstruction: "English",
      courseDuration: "6 Years",
      keyHighlights: ["Scenic port city of Batumi", "Affordable European education standard"],
    }
  ],
  russia: [
    {
      name: "Kazan Federal University",
      tuitionFee: "3,80,000 Rubles / Year",
      hostelFee: "20,000 Rubles / Year",
      ranking: "World Rank: 347",
      established: "1804",
      mediumOfInstruction: "English",
      courseDuration: "6 Years",
      keyHighlights: ["Ranked in top 400 universities", "Advanced biochemical labs"],
    }
  ],
  kazakhstan: [
    {
      name: "Astana Medical University",
      tuitionFee: "$3,500 / Year",
      hostelFee: "$600 / Year",
      ranking: "Country Rank: 3",
      established: "1964",
      mediumOfInstruction: "English",
      courseDuration: "5 Years",
      keyHighlights: ["Only 5 years course duration compliant with NMC rules", "Located in capital city Nursultan"],
    }
  ]
};

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export default function CountryPage({ params }: CountryPageProps) {
  const resolvedParams = use(params);
  const countrySlug = resolvedParams.country;
  
  const [country, setCountry] = useState<Partial<Country> | null>(null);
  const [unis, setUnis] = useState<Partial<University>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Attempt backend retrieval
        const countryRes: any = await api.get(`/countries/${countrySlug}`);
        if (countryRes && countryRes.success) {
          setCountry(countryRes.country);
          
          // Fetch universities in this country
          const uniRes: any = await api.get(`/universities?country=${countryRes.country._id}`);
          if (uniRes && uniRes.success) {
            setUnis(uniRes.universities);
          }
        }
      } catch (err) {
        console.warn("Failed fetching from backend. Utilizing fallback database profiles.", err);
        // Fallback static files
        const matchedCountry = fallbackCountries[countrySlug] || {
          name: countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1),
          averageCost: "₹2.5 - ₹4.0 Lakhs / Year",
          duration: "5-6 Years",
          fmgePassingRate: "20%+",
          language: "English",
          description: `Pursue low-cost NMC-compliant MBBS courses in ${countrySlug}. WHO listed government programs with separate Indian hostels and dining facilities.`,
          benefits: ["100% English medium lectures", "WHO & NMC approved", "Affordable hostel dining"],
          requirements: ["50% in PCB in 12th", "NEET Qualified"]
        };
        setCountry(matchedCountry);
        setUnis(fallbackUniversities[countrySlug] || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [countrySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!country) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-[1280px] mx-auto px-4 space-y-10">
        
        {/* Back Link */}
        <Link href="/mbbs-abroad" className="inline-flex items-center gap-2 text-primary-500 font-bold hover:underline text-sm">
          <FaArrowLeft /> Back to Countries
        </Link>

        {/* Country Header Info */}
        <div className="bg-[#0b1c2c] text-white rounded-premium p-8 md:p-14 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4">
            <span className="text-secondary-500 font-extrabold uppercase text-xs tracking-widest">
              Mbbs Destinations
            </span>
            <h1 className="text-3xl md:text-5xl font-black">
              Study MBBS in {country.name}
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {country.description}
            </p>
          </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Course Duration", val: country.duration, icon: <FaClock /> },
            { label: "Annual Tuition", val: country.averageCost, icon: <FaMoneyBillWave /> },
            { label: "NExT / FMGE Pass Rate", val: country.fmgePassingRate, icon: <FaCheckCircle /> },
            { label: "Medium of Instruction", val: country.language, icon: <FaGraduationCap /> },
          ].map((hl, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center text-lg flex-shrink-0">
                {hl.icon}
              </div>
              <div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{hl.label}</span>
                <p className="text-sm font-black text-text-dark mt-0.5">{hl.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Body columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Universities list */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-black text-text-dark flex items-center gap-2">
              <FaUniversity className="text-primary-500" /> Medical Universities in {country.name}
            </h2>

            {unis.length === 0 ? (
              <div className="bg-white p-8 rounded-premium text-center border border-slate-100 text-text-muted">
                No universities registered yet. Our counselors can suggest partner universities in this country.
              </div>
            ) : (
              <div className="space-y-6">
                {unis.map((uni, idx) => (
                  <div key={idx} className="bg-white p-6 md:p-8 rounded-premium border border-slate-100 shadow-md flex flex-col md:flex-row justify-between gap-6 hover:shadow-xl transition-all">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-text-dark">{uni.name}</h3>
                        <span className="text-[10px] font-bold text-slate-400">Est. {uni.established} | {uni.ranking}</span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                        <span><strong>Tuition:</strong> {uni.tuitionFee}</span>
                        <span>•</span>
                        <span><strong>Hostel:</strong> {uni.hostelFee}</span>
                        <span>•</span>
                        <span><strong>Medium:</strong> {uni.mediumOfInstruction}</span>
                      </div>

                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-text-muted">
                        {uni.keyHighlights?.map((hl, hIdx) => (
                          <li key={hIdx}>{hl}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col justify-center items-stretch md:items-end gap-2.5">
                      <Link
                        href="/contact"
                        className="bg-primary-500 text-white font-bold text-center px-6 py-2.5 rounded-xl text-xs hover:bg-primary-600 transition-colors shadow-sm"
                      >
                        Apply Online
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Benefits */}
            <div className="bg-white p-6 md:p-8 rounded-premium border border-slate-100 shadow-md space-y-4">
              <h4 className="font-extrabold text-sm text-text-dark uppercase tracking-wider border-b pb-2">Why Study Here?</h4>
              <ul className="space-y-3">
                {country.benefits?.map((bf, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-text-dark">
                    <FaCheckCircle className="text-accent-500 flex-shrink-0 mt-0.5" />
                    <span>{bf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white p-6 md:p-8 rounded-premium border border-slate-100 shadow-md space-y-4">
              <h4 className="font-extrabold text-sm text-text-dark uppercase tracking-wider border-b pb-2">Eligibility Criteria</h4>
              <ul className="space-y-3">
                {country.requirements?.map((req, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-text-dark">
                    <FaCheckCircle className="text-secondary-500 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
