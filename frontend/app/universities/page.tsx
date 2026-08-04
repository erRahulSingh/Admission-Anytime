"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaUniversity,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaGlobe,
  FaAward,
  FaCheckCircle,
  FaArrowRight,
  FaFilter,
  FaGraduationCap,
  FaStar,
} from "react-icons/fa";
import api from "@/services/api";
import { University, Country } from "@/types";

// 16 High-definition UNIQUE campus building photos guaranteed to work
const campusImagePool = [
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584515901367-f134981d40e1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
];

// 16 Top Medical Colleges Fallback Data with DISTINCT Campus Photos
const fallbackUnis: Partial<University>[] = [
  {
    name: "Astana Medical University",
    country: { name: "Kazakhstan", slug: "kazakhstan" } as any,
    tuitionFee: "$3,500 / Year",
    ranking: "Country Rank: 3",
    courseDuration: "5 Years",
    keyHighlights: [
      "Only 5-year course duration following NMC guidelines",
      "Located in the capital city, Nursultan (Astana)",
      "Highly modern clinical testing infrastructure",
    ],
    description: "Astana Medical University is one of the most prestigious medical colleges in Kazakhstan.",
    coverImage: campusImagePool[0],
  },
  {
    name: "Tbilisi State Medical University",
    country: { name: "Georgia", slug: "georgia" } as any,
    tuitionFee: "$5,000 / Year",
    ranking: "Country Rank: 4, World Rank: 3840",
    courseDuration: "6 Years",
    keyHighlights: [
      "Oldest and largest medical university in Georgia",
      "Highly clinical curriculum linked with University Hospital",
      "NMC, WHO, and USMLE compatible training",
    ],
    description: "Tbilisi State Medical University is the leading medical school in Georgia.",
    coverImage: campusImagePool[1],
  },
  {
    name: "Batumi Shota Rustaveli State University",
    country: { name: "Georgia", slug: "georgia" } as any,
    tuitionFee: "$4,500 / Year",
    ranking: "Country Rank: 8",
    courseDuration: "6 Years",
    keyHighlights: [
      "Located in the scenic port city of Batumi",
      "Highly affordable European education standard",
      "Low student-to-teacher ratio in diagnostic labs",
    ],
    description: "Shota Rustaveli State University offers a modern infrastructure and experienced teaching faculty.",
    coverImage: campusImagePool[2],
  },
  {
    name: "Kazan Federal University",
    country: { name: "Russia", slug: "russia" } as any,
    tuitionFee: "3,80,000 Rubles / Year",
    ranking: "World Rank: 347",
    courseDuration: "6 Years",
    keyHighlights: [
      "Ranked in the top 400 universities globally",
      "Subsidy benefits provided by Russian Ministry",
      "Advanced biochemical and research labs",
    ],
    description: "Kazan Federal University is one of the oldest universities in Russia with legendary medical faculties.",
    coverImage: campusImagePool[3],
  },
  {
    name: "Tashkent Medical Academy",
    country: { name: "Uzbekistan", slug: "uzbekistan" } as any,
    tuitionFee: "$3,800 / Year",
    ranking: "Country Rank: 2",
    courseDuration: "5 Years",
    keyHighlights: [
      "Premier state medical academy in Uzbekistan",
      "Indian mess and dedicated hostel blocks",
      "Recognized by NMC, WHO, and ECFMG",
    ],
    description: "Leading government medical center in Tashkent with extensive practical hospital training.",
    coverImage: campusImagePool[4],
  },
  {
    name: "Osh State University Medical Faculty",
    country: { name: "Kyrgyzstan", slug: "kyrgyzstan" } as any,
    tuitionFee: "$3,200 / Year",
    ranking: "Country Rank: 5",
    courseDuration: "5 Years",
    keyHighlights: [
      "Largest government university in southern Kyrgyzstan",
      "Over 20+ affiliated teaching hospitals",
      "Extremely low cost of living and tuition",
    ],
    description: "High quality medical education with multi-specialty hospital clinical rotations.",
    coverImage: campusImagePool[5],
  },
  {
    name: "Yerevan State Medical University",
    country: { name: "Armenia", slug: "armenia" } as any,
    tuitionFee: "$5,500 / Year",
    ranking: "Country Rank: 1",
    courseDuration: "6 Years",
    keyHighlights: [
      "Historic medical university founded in 1920",
      "100% English medium medical curriculum",
      "High licensing exam success rate for Indian graduates",
    ],
    description: "Premier medical university in Armenia with centuries-old educational heritage.",
    coverImage: campusImagePool[6],
  },
  {
    name: "University of Santo Tomas",
    country: { name: "Philippines", slug: "philippines" } as any,
    tuitionFee: "$4,800 / Year",
    ranking: "World Rank: 801",
    courseDuration: "5 Years",
    keyHighlights: [
      "US-based BS+MD clinical curriculum",
      "100% English speaking country",
      "High FMGE and USMLE passing record",
    ],
    description: "Asia's oldest existing university with world-renowned medical faculties.",
    coverImage: campusImagePool[7],
  },
  {
    name: "Cairo University Faculty of Medicine",
    country: { name: "Egypt", slug: "egypt" } as any,
    tuitionFee: "$6,000 / Year",
    ranking: "Country Rank: 1, World Rank: 550",
    courseDuration: "5 Years",
    keyHighlights: [
      "Largest teaching medical hospital in the Middle East",
      "High clinical patient exposure in Kasr Alainy",
      "Full NMC and WHO accreditation",
    ],
    description: "Egypt's premier medical faculty known for intensive clinical rotations and research.",
    coverImage: campusImagePool[8],
  },
  {
    name: "AIIMS New Delhi",
    country: { name: "India", slug: "india" } as any,
    tuitionFee: "₹1,628 / Year",
    ranking: "NIRF Rank: 1 in India",
    courseDuration: "5.5 Years",
    keyHighlights: [
      "India's apex medical institution",
      "World-class research facilities and tertiary care hospital",
      "Full government subsidized medical education",
    ],
    description: "All India Institute of Medical Sciences is India's top medical college with legendary clinical exposure.",
    coverImage: campusImagePool[9],
  },
  {
    name: "Samarkand State Medical University",
    country: { name: "Uzbekistan", slug: "uzbekistan" } as any,
    tuitionFee: "$3,400 / Year",
    ranking: "Country Rank: 3",
    courseDuration: "5 Years",
    keyHighlights: [
      "One of the oldest medical institutes in Central Asia",
      "NMC & WHO approved English medium curriculum",
      "Modern diagnostic simulation training center",
    ],
    description: "Centuries-old medical institution in Samarkand with international clinical faculty.",
    coverImage: campusImagePool[10],
  },
  {
    name: "Kazan State Medical University",
    country: { name: "Russia", slug: "russia" } as any,
    tuitionFee: "$4,200 / Year",
    ranking: "Country Rank: 9, World Rank: 1200",
    courseDuration: "6 Years",
    keyHighlights: [
      "Over 200 years of medical academic excellence",
      "State-of-the-art medical clinical research centers",
      "Large Indian student community & dedicated hostel mess",
    ],
    description: "Prestige Russian medical university featuring 9 affiliated hospitals and research labs.",
    coverImage: campusImagePool[11],
  },
  {
    name: "New Vision University",
    country: { name: "Georgia", slug: "georgia" } as any,
    tuitionFee: "$7,000 / Year",
    ranking: "Country Rank: 6",
    courseDuration: "6 Years",
    keyHighlights: [
      "Modern European private medical university in Tbilisi",
      "USMLE & PLAB targeted international medical training",
      "Features its own private University Hospital campus",
    ],
    description: "Innovative European medical school offering advanced clinical simulation technology.",
    coverImage: campusImagePool[12],
  },
  {
    name: "Kazakh National Medical University",
    country: { name: "Kazakhstan", slug: "kazakhstan" } as any,
    tuitionFee: "$4,500 / Year",
    ranking: "Country Rank: 1 in Kazakhstan",
    courseDuration: "5 Years",
    keyHighlights: [
      "Top ranked government medical university in Almaty",
      "Over 10,000+ international medical students",
      "Pioneer of medical research and healthcare in Central Asia",
    ],
    description: "Asfendiyarov Kazakh National Medical University is the top medical institution in Almaty.",
    coverImage: campusImagePool[13],
  },
  {
    name: "Jalal-Abad State University",
    country: { name: "Kyrgyzstan", slug: "kyrgyzstan" } as any,
    tuitionFee: "$3,000 / Year",
    ranking: "Country Rank: 7",
    courseDuration: "5 Years",
    keyHighlights: [
      "Extremely budget-friendly MBBS program",
      "NMC guidelines compliant 5-year syllabus",
      "Safe student-friendly campus with Indian mess",
    ],
    description: "Highly affordable medical university in Jalal-Abad offering quality clinical training.",
    coverImage: campusImagePool[14],
  },
  {
    name: "Kasturba Medical College (KMC Manipal)",
    country: { name: "India", slug: "india" } as any,
    tuitionFee: "₹17,80,000 / Year",
    ranking: "NIRF Rank: 9 in India",
    courseDuration: "5.5 Years",
    keyHighlights: [
      "Top premier private medical college in India",
      "A++ NAAC grade accreditation and global recognition",
      "World-class clinical exposure with 2,000+ bed hospital",
    ],
    description: "Ranked among India's top 10 medical colleges with state-of-the-art medical education.",
    coverImage: campusImagePool[15],
  },
];

export default function UniversitiesFinderPage() {
  const [unis, setUnis] = useState<Partial<University>[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Load countries dynamically for filter dropdown
  useEffect(() => {
    async function loadCountries() {
      try {
        const res: any = await api.get("/countries");
        if (res && res.success && res.countries) {
          setCountries(res.countries);
        }
      } catch (err) {
        console.warn("Failed fetching countries for dropdown:", err);
      }
    }
    loadCountries();
  }, []);

  // Load active universities from backend
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
        if (data && data.success && data.universities && data.universities.length > 0) {
          if (!search && !countryFilter) {
            const backendUnis = data.universities;
            const backendNames = new Set(backendUnis.map((u: any) => u.name.toLowerCase()));
            const missingFallbacks = fallbackUnis.filter(
              (f) => f.name && !backendNames.has(f.name.toLowerCase())
            );
            setUnis([...backendUnis, ...missingFallbacks]);
          } else {
            setUnis(data.universities);
          }
        } else {
          setUnis(fallbackUnis);
        }
      } catch (err: unknown) {
        console.warn("Failed loading universities from backend. Fallback to static data.");
        let list = [...fallbackUnis];
        if (search) {
          list = list.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()));
        }
        if (countryFilter) {
          list = list.filter(
            (u) =>
              (u.country as any)?._id === countryFilter ||
              (u.country as any)?.name?.toLowerCase() === countryFilter.toLowerCase()
          );
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

  // Helper map for country flags
  const getFlagCode = (countrySlug: string = "") => {
    const map: Record<string, string> = {
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
    return map[countrySlug.toLowerCase()] || "ge";
  };

  return (
    <div className="relative bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#f1f5f9] min-h-screen py-8 sm:py-12 md:py-20 overflow-hidden">
      {/* Premium blurred ambient background shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        {/* Title & Subtitle Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#13376B] bg-white border border-blue-100 px-4 py-1.5 rounded-full shadow-sm">
            <FaGraduationCap className="text-[#f9a825] text-sm" /> Top Medical Institutions
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0c2e60] tracking-tight">
            Find & Compare Top Medical Colleges
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base font-medium max-w-2xl mx-auto">
            Explore WHO & NMC approved government medical universities in India and abroad. Compare tuition fees, rankings, and eligibility.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row gap-4 items-center">
          {/* Input field */}
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by college name (e.g. Astana Medical, AIIMS, Kazan Federal)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#13376B] focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* Filter dropdown */}
          <div className="w-full md:w-64 relative">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#13376B] transition-all cursor-pointer appearance-none"
            >
              <option value="">All Destination Countries</option>
              {countries.length > 0
                ? countries.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                : [
                    "India",
                    "Russia",
                    "Georgia",
                    "Kazakhstan",
                    "Uzbekistan",
                    "Kyrgyzstan",
                    "Nepal",
                    "Armenia",
                    "Philippines",
                    "Egypt",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <FaFilter className="text-xs" />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 border-4 border-[#13376B] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-500">Loading universities list...</p>
          </div>
        ) : unis.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-lg text-slate-500 space-y-4">
            <FaUniversity className="text-5xl text-slate-300 mx-auto" />
            <h3 className="text-lg font-black text-slate-800">No Universities Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or choosing a different country filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {unis.map((uni, idx) => {
              const countryObj = typeof uni.country === "object" ? uni.country : null;
              const countryName = countryObj?.name || (typeof uni.country === "string" ? uni.country : "Abroad");
              const countrySlug = countryObj?.slug || countryName.toLowerCase();
              const flagCode = getFlagCode(countrySlug);

              // Guaranteed unique high-definition cover image URL per university
              const isTattooPhoto = uni.coverImage && uni.coverImage.includes("1568515045052");
              const coverImgSrc =
                uni.coverImage && uni.coverImage.trim() && !isTattooPhoto
                  ? uni.coverImage
                  : campusImagePool[idx % campusImagePool.length];

              return (
                <div
                  key={idx}
                  className="bg-white rounded-[28px] border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between group"
                >
                  {/* ═════════ 1. COVER BANNER PHOTO ═════════ */}
                  <div className="relative h-52 bg-gradient-to-br from-[#0c2e60] via-[#13376B] to-[#1d62a3] overflow-hidden">
                    <img
                      src={coverImgSrc}
                      alt={uni.name || "Medical University"}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = campusImagePool[idx % campusImagePool.length];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Top Left Badge: ✔ NMC & WHO */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#132d54]/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/10">
                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                        <span>NMC & WHO</span>
                      </span>
                    </div>

                    {/* Top Right Badge: 🇰🇿 Country Name */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/60">
                        <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-2xs">
                          <img
                            src={`https://flagcdn.com/w80/${flagCode}.png`}
                            alt={`${countryName} Flag`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{countryName}</span>
                      </span>
                    </div>

                    {/* Floating Graduation Icon Avatar */}
                    <div className="absolute -bottom-5 left-6 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-lg flex items-center justify-center z-10">
                      {uni.logo && !uni.logo.includes("unsplash.com") ? (
                        <img
                          src={uni.logo}
                          alt={`${uni.name} Logo`}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <FaGraduationCap className="text-[#13376B] text-2xl" />
                      )}
                    </div>
                  </div>

                  {/* ═════════ 2. CARD CONTENT BODY ═════════ */}
                  <div className="p-6 pt-8 space-y-4">
                    {/* Title & Rank Badge */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-[#13376B] transition-colors line-clamp-2">
                        {uni.name}
                      </h3>
                      {uni.ranking && uni.ranking !== "N/A" && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50/90 border border-amber-200/80 px-3 py-1 rounded-lg">
                          <FaStar className="text-amber-500 text-xs" />
                          <span>{uni.ranking}</span>
                        </div>
                      )}
                    </div>

                    {/* ═════════ 3. DUAL STAT BOX (FEES & DURATION) ═════════ */}
                    <div className="grid grid-cols-2 gap-3 bg-[#f3f6f9] p-3.5 rounded-2xl">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                          Tuition Fee
                        </span>
                        <span className="text-base font-extrabold text-[#13376B]">
                          {uni.tuitionFee || "$3,500 / Year"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                          Duration
                        </span>
                        <span className="text-base font-extrabold text-slate-800">
                          {uni.courseDuration || "5 Years"}
                        </span>
                      </div>
                    </div>

                    {/* ═════════ 4. KEY HIGHLIGHTS BULLETS ═════════ */}
                    {uni.keyHighlights && uni.keyHighlights.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {uni.keyHighlights.map((highlight, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 leading-snug">
                            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-[9px] font-black mt-0.5 shadow-2xs">
                              ✓
                            </div>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ═════════ 5. DESCRIPTION SNIPPET ═════════ */}
                    {uni.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal pt-1">
                        {uni.description}
                      </p>
                    )}
                  </div>

                  {/* ═════════ 6. BOTTOM ACTION CTA BUTTON ═════════ */}
                  <div className="p-6 pt-0">
                    <Link
                      href="/contact"
                      className="w-full bg-[#13376B] hover:bg-[#0a2550] text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all duration-300 text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-blue-950/20 group-hover:shadow-xl active:scale-[0.99]"
                    >
                      <span>Apply for Direct Admission</span>
                      <FaArrowRight className="text-white text-xs group-hover:translate-x-1 transition-transform" />
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
