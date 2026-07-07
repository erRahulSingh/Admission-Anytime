"use client";

import React, { useEffect, useState } from "react";
import {
  FaUniversity,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaFilter,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { University, Country } from "@/types";

export default function AdminUniversitiesPage() {
  const [unis, setUnis] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  // Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [hostelFee, setHostelFee] = useState("");
  const [ranking, setRanking] = useState("");
  const [established, setEstablished] = useState("");
  const [lang, setLang] = useState("English");
  const [duration, setDuration] = useState("6 Years");
  const [highlights, setHighlights] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("Active");

  // Edit Form State
  const [editingUni, setEditingUni] = useState<University | null>(null);
  const [editName, setEditName] = useState("");
  const [editCountryId, setEditCountryId] = useState("");
  const [editTuitionFee, setEditTuitionFee] = useState("");
  const [editHostelFee, setEditHostelFee] = useState("");
  const [editRanking, setEditRanking] = useState("");
  const [editEstablished, setEditEstablished] = useState("");
  const [editLang, setEditLang] = useState("English");
  const [editDuration, setEditDuration] = useState("6 Years");
  const [editHighlights, setEditHighlights] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  async function loadData() {
    try {
      setLoading(true);
      // Load countries
      const countryData: any = await api.get("/countries/all");
      if (countryData && countryData.success) {
        setCountries(countryData.countries);
      }
      // Load universities
      const uniData: any = await api.get("/universities/all");
      if (uniData && uniData.success) {
        setUnis(uniData.universities);
      }
    } catch (err) {
      console.warn("Failed retrieving universities. Utilizing fallback database.");
      setCountries([
        { _id: "c-1", name: "Georgia", slug: "georgia" } as any,
        { _id: "c-2", name: "Russia", slug: "russia" } as any,
        { _id: "c-3", name: "Kazakhstan", slug: "kazakhstan" } as any,
        { _id: "c-4", name: "Uzbekistan", slug: "uzbekistan" } as any,
      ]);
      setUnis([
        {
          _id: "uni-1",
          name: "Tbilisi State Medical University",
          slug: "tbilisi-state-medical-university",
          country: { _id: "c-1", name: "Georgia", slug: "georgia" } as any,
          tuitionFee: "$5,000 / Year",
          hostelFee: "$1,000 / Year",
          ranking: "Country Rank: 4",
          established: "1918",
          mediumOfInstruction: "English",
          courseDuration: "6 Years",
          keyHighlights: ["WHO listed", "NMC approved"],
          description: "Oldest medical university in Georgia.",
          status: "Active",
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Open Edit Modal
  const handleEditClick = (uni: University) => {
    setEditingUni(uni);
    setEditName(uni.name);
    setEditCountryId((uni.country as any)?._id || (uni.country as any) || "");
    setEditTuitionFee(uni.tuitionFee);
    setEditHostelFee(uni.hostelFee || "");
    setEditRanking(uni.ranking || "");
    setEditEstablished(uni.established || "");
    setEditLang(uni.mediumOfInstruction || "English");
    setEditDuration(uni.courseDuration || "6 Years");
    setEditHighlights(uni.keyHighlights ? uni.keyHighlights.join(", ") : "");
    setEditDesc(uni.description);
    setEditStatus(uni.status);
  };

  // Submit Add University
  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !countryId || !tuitionFee || !desc) return;

    const highlightsArray = highlights.split(",").map(h => h.trim()).filter(Boolean);
    const payload = {
      name,
      country: countryId,
      tuitionFee,
      hostelFee,
      ranking,
      established,
      mediumOfInstruction: lang,
      courseDuration: duration,
      keyHighlights: highlightsArray,
      description: desc,
      status,
    };

    try {
      await api.post("/universities", payload);
      resetAddForm();
      setShowAddForm(false);
      loadData();
    } catch (err) {
      console.error(err);
      // Local fallback creation
      const chosenCountry = countries.find(c => c._id === countryId);
      const mockUni: University = {
        _id: "mock-uni-" + Date.now(),
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        country: { _id: chosenCountry?._id || countryId, name: chosenCountry?.name || "Abroad" } as any,
        tuitionFee,
        hostelFee,
        ranking,
        established,
        mediumOfInstruction: lang,
        courseDuration: duration,
        keyHighlights: highlightsArray,
        description: desc,
        status: status as any,
        createdAt: new Date().toISOString(),
      };
      setUnis(prev => [...prev, mockUni]);
      setShowAddForm(false);
      resetAddForm();
    }
  };

  // Submit Edit University Details
  const handleUpdateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUni) return;

    const highlightsArray = editHighlights.split(",").map(h => h.trim()).filter(Boolean);
    const payload = {
      name: editName,
      country: editCountryId,
      tuitionFee: editTuitionFee,
      hostelFee: editHostelFee,
      ranking: editRanking,
      established: editEstablished,
      mediumOfInstruction: editLang,
      courseDuration: editDuration,
      keyHighlights: highlightsArray,
      description: editDesc,
      status: editStatus,
    };

    try {
      await api.put(`/universities/${editingUni._id}`, payload);
      setEditingUni(null);
      loadData();
    } catch (err) {
      console.error(err);
      // Fallback local update
      const chosenCountry = countries.find(c => c._id === editCountryId);
      setUnis(prev =>
        prev.map(u =>
          u._id === editingUni._id
            ? {
                ...u,
                ...payload,
                country: { _id: chosenCountry?._id || editCountryId, name: chosenCountry?.name || "Abroad" } as any,
                slug: editName.toLowerCase().replace(/\s+/g, "-"),
              }
            : u
        )
      );
      setEditingUni(null);
    }
  };

  const resetAddForm = () => {
    setName("");
    setCountryId("");
    setTuitionFee("");
    setHostelFee("");
    setRanking("");
    setEstablished("");
    setHighlights("");
    setDesc("");
    setStatus("Active");
  };

  // Delete University
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    try {
      await api.delete(`/universities/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      setUnis(prev => prev.filter(u => u._id !== id));
    }
  };

  // Client-side search and filters
  const filteredUnis = unis.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const uniCountryId = (uni.country as any)?._id || (uni.country as any) || "";
    const matchesCountry = countryFilter === "" || uniCountryId === countryFilter;

    return matchesSearch && matchesCountry;
  });

  // Calculate Metrics
  const totalCount = unis.length;
  const activeCount = unis.filter(u => u.status === "Active").length;
  const uniqueCountries = new Set(
    unis.map(u => (u.country as any)?.name || (u.country as any) || "").filter(Boolean)
  );
  const countriesCount = uniqueCountries.size;

  return (
    <div className="space-y-8">
      
      {/* ═══ 1. Title & Header Action ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0c2e60] tracking-wide uppercase">
            Manage Associated Universities
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Register medical colleges, edit fee frameworks, and manage details displayed on the portal.
          </p>
        </div>
        <button
          onClick={() => { resetAddForm(); setShowAddForm(true); }}
          className="flex items-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-blue-900/10 transition-all uppercase tracking-wider hover:-translate-y-0.5 active:scale-95 duration-200"
        >
          <FaPlus size={10} /> Add University
        </button>
      </div>

      {/* ═══ 2. Stats Ticker Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Registered Colleges", count: totalCount, color: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-350" },
          { label: "Active Institutions", count: activeCount, color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-350" },
          { label: "Countries Represented", count: countriesCount, color: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-350" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className={`p-4 border rounded-2xl flex flex-col justify-between ${item.color} shadow-sm select-none cursor-pointer transition-colors duration-200`}
          >
            <span className="text-[10px] uppercase font-black tracking-wider opacity-85">{item.label}</span>
            <span className="text-2xl font-black mt-1 leading-none">{item.count}</span>
          </motion.div>
        ))}
      </div>

      {/* ═══ 3. Search & Filter Bar ═══ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch size={12} />
          </span>
          <input
            type="text"
            placeholder="Search by university name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          />
        </div>

        {/* Filter */}
        <div className="w-full md:w-60 flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold flex-shrink-0 flex items-center gap-1">
            <FaFilter size={10} /> Country:
          </span>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* ═══ 4. Table Grid ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#0c2e60] text-[#f9a825] font-black uppercase tracking-wider">
                <th className="py-4 px-6 text-[10px]">University</th>
                <th className="py-4 px-6 text-[10px]">Country</th>
                <th className="py-4 px-6 text-[10px]">Tuition Fee</th>
                <th className="py-4 px-6 text-[10px]">Duration</th>
                <th className="py-4 px-6 text-[10px]">Rank</th>
                <th className="py-4 px-6 text-[10px]">Status</th>
                <th className="py-4 px-6 text-right text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-text-dark font-semibold divide-y divide-slate-100">
              {filteredUnis.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold italic">
                    <FaInfoCircle className="inline-block mr-1.5" /> No universities registered.
                  </td>
                </tr>
              ) : (
                filteredUnis.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#0c2e60] text-sm">
                        <FaUniversity />
                      </div>
                      <span className="font-black text-sm text-[#0c2e60] block">{u.name}</span>
                    </td>
                    <td className="py-4 px-6 font-bold">{(u.country as any)?.name || "Abroad"}</td>
                    <td className="py-4 px-6 text-primary-500 font-black text-sm">{u.tuitionFee}</td>
                    <td className="py-4 px-6 text-[11px]">{u.courseDuration}</td>
                    <td className="py-4 px-6 text-slate-400 text-[11px]">{u.ranking}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                        u.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(u)}
                        className="p-2 border border-slate-100 hover:border-blue-200 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block"
                        title="Edit details"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="p-2 border border-slate-100 hover:border-red-200 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block"
                        title="Remove registration"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ 5. Add University Modal (Framer Motion transitions) ═══ */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-xl w-full space-y-4 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Register University
              </h3>

              <form onSubmit={handleAddUniversity} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">University Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tbilisi State Medical University"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Country Destination</label>
                    <select
                      value={countryId}
                      onChange={(e) => setCountryId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    >
                      <option value="">-- Select Country --</option>
                      {countries.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Tuition Fees</label>
                    <input
                      type="text"
                      placeholder="e.g. $5,000 / Year"
                      value={tuitionFee}
                      onChange={(e) => setTuitionFee(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Hostel Fees</label>
                    <input
                      type="text"
                      placeholder="e.g. $1,000 / Year"
                      value={hostelFee}
                      onChange={(e) => setHostelFee(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">World / Country Rank</label>
                    <input
                      type="text"
                      placeholder="e.g. Rank 3840"
                      value={ranking}
                      onChange={(e) => setRanking(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Established Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 1918"
                      value={established}
                      onChange={(e) => setEstablished(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Course Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 6 Years"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Instruction Medium</label>
                    <input
                      type="text"
                      placeholder="e.g. English"
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Key Highlights (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% English, separate girls hostel, 4000+ beds clinical hospital"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter tuition payment guidelines, hostel locations, or admission deadlines..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold rounded-xl text-xs shadow-md uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Register College
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ 6. Edit University Modal (Framer Motion transitions) ═══ */}
      <AnimatePresence>
        {editingUni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUni(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-xl w-full space-y-4 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingUni(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Edit University Details
              </h3>

              <form onSubmit={handleUpdateUniversity} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">University Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Country Destination</label>
                    <select
                      value={editCountryId}
                      onChange={(e) => setEditCountryId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    >
                      <option value="">-- Select Country --</option>
                      {countries.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Tuition Fees</label>
                    <input
                      type="text"
                      required
                      value={editTuitionFee}
                      onChange={(e) => setEditTuitionFee(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Hostel Fees</label>
                    <input
                      type="text"
                      value={editHostelFee}
                      onChange={(e) => setEditHostelFee(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">World / Country Rank</label>
                    <input
                      type="text"
                      value={editRanking}
                      onChange={(e) => setEditRanking(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Established Year</label>
                    <input
                      type="text"
                      value={editEstablished}
                      onChange={(e) => setEditEstablished(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Course Duration</label>
                    <input
                      type="text"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Instruction Medium</label>
                    <input
                      type="text"
                      value={editLang}
                      onChange={(e) => setEditLang(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Key Highlights (Comma separated)</label>
                  <input
                    type="text"
                    value={editHighlights}
                    onChange={(e) => setEditHighlights(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingUni(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold rounded-xl text-xs shadow-md uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
