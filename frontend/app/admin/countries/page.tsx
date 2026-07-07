"use client";

import React, { useEffect, useState } from "react";
import {
  FaGlobe,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { Country } from "@/types";

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [fmge, setFmge] = useState("");
  const [lang, setLang] = useState("English");
  const [benefits, setBenefits] = useState("");
  const [reqs, setReqs] = useState("");
  const [status, setStatus] = useState("Active");
  const [flagUrl, setFlagUrl] = useState("");

  // Edit Form State
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editFmge, setEditFmge] = useState("");
  const [editLang, setEditLang] = useState("English");
  const [editBenefits, setEditBenefits] = useState("");
  const [editReqs, setEditReqs] = useState("");
  const [editStatus, setEditStatus] = useState("Active");
  const [editFlagUrl, setEditFlagUrl] = useState("");

  async function loadCountries() {
    try {
      setLoading(true);
      const data: any = await api.get("/countries/all");
      if (data && data.success) {
        setCountries(data.countries);
      }
    } catch (err) {
      console.warn("Failed fetching admin countries. Using fallback database.");
      setCountries([
        {
          _id: "c-1",
          name: "Georgia",
          slug: "georgia",
          flagImage: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=200",
          description: "Georgia is one of the top destinations for MBBS. The medical degrees are globally recognized by WHO, NMC (MCI), and FAIMER, and programs are offered 100% in English.",
          benefits: ["100% English Medium Curriculum", "WHO and NMC Approved Universities"],
          averageCost: "3.5 - 5.5 Lakhs / Year",
          duration: "6 Years",
          fmgePassingRate: "28.4%",
          language: "English",
          requirements: ["50% in PCB in 12th", "NEET Qualification mandatory"],
          status: "Active",
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCountries();
  }, []);

  // Open Edit Modal
  const handleEditClick = (country: Country) => {
    setEditingCountry(country);
    setEditName(country.name);
    setEditDesc(country.description);
    setEditCost(country.averageCost);
    setEditDuration(country.duration);
    setEditFmge(country.fmgePassingRate);
    setEditLang(country.language || "English");
    setEditBenefits(country.benefits ? country.benefits.join(", ") : "");
    setEditReqs(country.requirements ? country.requirements.join(", ") : "");
    setEditStatus(country.status);
    setEditFlagUrl(country.flagImage || "");
  };

  // Submit Add Country
  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !desc || !cost || !duration || !fmge) return;

    const benefitsArray = benefits.split(",").map(b => b.trim()).filter(Boolean);
    const reqsArray = reqs.split(",").map(r => r.trim()).filter(Boolean);
    const payload = {
      name,
      description: desc,
      averageCost: cost,
      duration,
      fmgePassingRate: fmge,
      language: lang,
      benefits: benefitsArray,
      requirements: reqsArray,
      status,
      flagImage: flagUrl || "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=200",
    };

    try {
      await api.post("/countries", payload);
      resetAddForm();
      setShowAddForm(false);
      loadCountries();
    } catch (err) {
      console.error(err);
      // Local addition fallback
      const mockCountry: Country = {
        _id: "mock-id-" + Date.now(),
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description: desc,
        averageCost: cost,
        duration,
        fmgePassingRate: fmge,
        language: lang,
        benefits: benefitsArray,
        requirements: reqsArray,
        status: status as any,
        flagImage: payload.flagImage,
        createdAt: new Date().toISOString(),
      };
      setCountries(prev => [...prev, mockCountry]);
      setShowAddForm(false);
      resetAddForm();
    }
  };

  // Submit Edit Country
  const handleUpdateCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCountry) return;

    const benefitsArray = editBenefits.split(",").map(b => b.trim()).filter(Boolean);
    const reqsArray = editReqs.split(",").map(r => r.trim()).filter(Boolean);
    const payload = {
      name: editName,
      description: editDesc,
      averageCost: editCost,
      duration: editDuration,
      fmgePassingRate: editFmge,
      language: editLang,
      benefits: benefitsArray,
      requirements: reqsArray,
      status: editStatus,
      flagImage: editFlagUrl || "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=200",
    };

    try {
      await api.put(`/countries/${editingCountry._id}`, payload);
      setEditingCountry(null);
      loadCountries();
    } catch (err) {
      console.error(err);
      // Fallback local update
      setCountries(prev =>
        prev.map(c =>
          c._id === editingCountry._id
            ? { ...c, ...payload, slug: editName.toLowerCase().replace(/\s+/g, "-") }
            : c
        )
      );
      setEditingCountry(null);
    }
  };

  const resetAddForm = () => {
    setName("");
    setDesc("");
    setCost("");
    setDuration("");
    setFmge("");
    setBenefits("");
    setReqs("");
    setFlagUrl("");
    setStatus("Active");
  };

  // Delete Country
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this country profile?")) return;
    try {
      await api.delete(`/countries/${id}`);
      loadCountries();
    } catch (err) {
      console.error(err);
      setCountries(prev => prev.filter(c => c._id !== id));
    }
  };

  // Client side search filtering
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate Metrics
  const totalCount = countries.length;
  const activeCount = countries.filter(c => c.status === "Active").length;
  
  // Calculate average FMGE passing rates safely
  const fmgeRates = countries
    .map(c => parseFloat(c.fmgePassingRate?.replace("%", "") || "0"))
    .filter(r => r > 0);
  const avgFmge = fmgeRates.length > 0 
    ? (fmgeRates.reduce((a, b) => a + b, 0) / fmgeRates.length).toFixed(1) + "%" 
    : "0.0%";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* ═══ 1. Header & Action ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0c2e60] tracking-wide uppercase">
            Manage Study Abroad Countries
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Create and edit global destination portfolios, and display costs, requirements, and FMGE pass ratios.
          </p>
        </div>
        <button
          onClick={() => { resetAddForm(); setShowAddForm(true); }}
          className="flex items-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-blue-900/10 transition-all uppercase tracking-wider hover:-translate-y-0.5 active:scale-95 duration-200"
        >
          <FaPlus size={10} /> Add Country
        </button>
      </div>

      {/* ═══ 2. CRM Stats Tickers ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Supported Destinations", count: totalCount, color: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-350" },
          { label: "Active Pipelines", count: activeCount, color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-350" },
          { label: "Average FMGE Pass Rate", count: avgFmge, color: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-350" },
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

      {/* ═══ 3. Search Bar ═══ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch size={12} />
          </span>
          <input
            type="text"
            placeholder="Search by country name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          />
        </div>
      </div>

      {/* ═══ 4. Country Table List ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#0c2e60] text-[#f9a825] font-black uppercase tracking-wider">
                <th className="py-4 px-6 text-[10px]">Country</th>
                <th className="py-4 px-6 text-[10px]">Tuition Cost</th>
                <th className="py-4 px-6 text-[10px]">Duration</th>
                <th className="py-4 px-6 text-[10px]">FMGE Pass Rate</th>
                <th className="py-4 px-6 text-[10px]">Instruction Medium</th>
                <th className="py-4 px-6 text-[10px]">Status</th>
                <th className="py-4 px-6 text-right text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-text-dark font-semibold divide-y divide-slate-100">
              {filteredCountries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold italic">
                    <FaInfoCircle className="inline-block mr-1.5" /> No countries profiles registered.
                  </td>
                </tr>
              ) : (
                filteredCountries.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-primary-500 font-bold text-sm overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                        {c.flagImage ? (
                          <img src={c.flagImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FaGlobe />
                        )}
                      </div>
                      <span className="font-black text-sm text-[#0c2e60] block">{c.name}</span>
                    </td>
                    <td className="py-4 px-6 text-primary-500 font-black text-sm">{c.averageCost}</td>
                    <td className="py-4 px-6 text-[11px]">{c.duration}</td>
                    <td className="py-4 px-6 font-black text-[#f9a825] text-sm">{c.fmgePassingRate}</td>
                    <td className="py-4 px-6 text-[11px]">{c.language}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                        c.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="p-2 border border-slate-100 hover:border-blue-200 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block"
                        title="Edit details"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-2 border border-slate-100 hover:border-red-200 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block"
                        title="Delete profile"
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

      {/* ═══ 5. Add Country Modal (Framer Motion transitions) ═══ */}
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
                Create Country Profile
              </h3>
              
              <form onSubmit={handleAddCountry} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Country Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Georgia"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Flag Image URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://...image.jpg"
                      value={flagUrl}
                      onChange={(e) => setFlagUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Short Description</label>
                  <textarea
                    rows={3}
                    placeholder="Summarize benefits, location, safety etc."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Tuition Budget (Yr)</label>
                    <input
                      type="text"
                      placeholder="e.g. 3.5 Lakhs / Yr"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Program Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 6 Years"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">FMGE / NExT Rate</label>
                    <input
                      type="text"
                      placeholder="e.g. 28.4%"
                      value={fmge}
                      onChange={(e) => setFmge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Instruction Language</label>
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
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Benefits (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% English, Safe environment, No donations"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Requirements (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 50% in PCB in 12th, NEET Qualified"
                    value={reqs}
                    onChange={(e) => setReqs(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
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
                    Save Country
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ 6. Edit Country Modal (Framer Motion transitions) ═══ */}
      <AnimatePresence>
        {editingCountry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCountry(null)}
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
                onClick={() => setEditingCountry(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Edit Country Profile
              </h3>
              
              <form onSubmit={handleUpdateCountry} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Country Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Flag Image URL</label>
                    <input
                      type="text"
                      value={editFlagUrl}
                      onChange={(e) => setEditFlagUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Short Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Tuition Budget (Yr)</label>
                    <input
                      type="text"
                      required
                      value={editCost}
                      onChange={(e) => setEditCost(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Program Duration</label>
                    <input
                      type="text"
                      required
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">FMGE / NExT Rate</label>
                    <input
                      type="text"
                      required
                      value={editFmge}
                      onChange={(e) => setEditFmge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Instruction Language</label>
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
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Benefits (Comma separated)</label>
                  <input
                    type="text"
                    value={editBenefits}
                    onChange={(e) => setEditBenefits(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Requirements (Comma separated)</label>
                  <input
                    type="text"
                    value={editReqs}
                    onChange={(e) => setEditReqs(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingCountry(null)}
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
