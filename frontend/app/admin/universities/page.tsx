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
  FaGlobe,
  FaMoneyBillWave,
  FaClock,
  FaAward,
  FaBuilding,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaThLarge,
  FaList,
  FaImage,
  FaToggleOn,
  FaToggleOff,
  FaExclamationCircle,
  FaStar,
  FaCloudUploadAlt,
  FaLink,
  FaGraduationCap,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { University, Country } from "@/types";

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

export default function AdminUniversitiesPage() {
  const [unis, setUnis] = useState<University[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // View state: 'grid' | 'table'
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State (Form type: 'add' | 'edit' | null)
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
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
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Image Upload & Preview States
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  // Delete Confirmation Modal State
  const [deletingUni, setDeletingUni] = useState<University | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  async function loadData() {
    try {
      setLoading(true);
      
      const [countriesRes, unisRes] = await Promise.allSettled([
        api.get("/countries/all"),
        api.get("/universities/all")
      ]);

      if (countriesRes.status === "fulfilled") {
        const countryData: any = countriesRes.value;
        if (countryData && countryData.success) {
          setCountries(countryData.countries || []);
        }
      } else {
        console.error("Failed loading countries:", countriesRes.reason);
      }

      if (unisRes.status === "fulfilled") {
        const uniData: any = unisRes.value;
        if (uniData && uniData.success) {
          setUnis(uniData.universities || []);
        }
      } else {
        console.error("Failed loading universities:", unisRes.reason);
      }
    } catch (err: any) {
      console.error("Failed retrieving universities:", err);
      showToast("error", "Failed to load universities data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    resetForm();
    if (countries.length > 0) {
      setCountryId(countries[0]._id);
    }
    setModalMode("add");
  };

  const openEditModal = (uni: University) => {
    setEditingId(uni._id);
    setName(uni.name);
    const cId = typeof uni.country === "object" ? uni.country?._id : uni.country;
    setCountryId(cId || (countries.length > 0 ? countries[0]._id : ""));
    setTuitionFee(uni.tuitionFee || "");
    setHostelFee(uni.hostelFee || "");
    setRanking(uni.ranking || "");
    setEstablished(uni.established || "");
    setLang(uni.mediumOfInstruction || "English");
    setDuration(uni.courseDuration || "6 Years");
    setHighlights(uni.keyHighlights ? uni.keyHighlights.join(", ") : "");
    setDesc(uni.description || "");

    setLogoUrl(uni.logo || "");
    setLogoPreview(uni.logo || "");
    setLogoFile(null);

    setCoverUrl(uni.coverImage || "");
    setCoverPreview(uni.coverImage || "");
    setCoverFile(null);

    setStatus(uni.status || "Active");
    setModalMode("edit");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCountryId(countries.length > 0 ? countries[0]._id : "");
    setTuitionFee("");
    setHostelFee("");
    setRanking("");
    setEstablished("");
    setLang("English");
    setDuration("6 Years");
    setHighlights("");
    setDesc("");
    setLogoUrl("");
    setLogoFile(null);
    setLogoPreview("");
    setCoverUrl("");
    setCoverFile(null);
    setCoverPreview("");
    setStatus("Active");
  };

  const closeModal = () => {
    setModalMode(null);
    resetForm();
  };

  // Handle Logo File Selection
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setLogoUrl("");
    }
  };

  // Handle Cover File Selection
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
      setCoverUrl("");
    }
  };

  // Submit Form (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !countryId || !tuitionFee.trim() || !desc.trim()) {
      showToast("error", "Please fill in all required fields (Name, Country, Tuition Fee, Description).");
      return;
    }

    const highlightsArray = highlights
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    // Build FormData payload for optional file uploads & text fields
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("country", countryId);
    formData.append("tuitionFee", tuitionFee.trim());
    formData.append("hostelFee", hostelFee.trim() || "Contact for details");
    formData.append("ranking", ranking.trim() || "N/A");
    formData.append("established", established.trim());
    formData.append("mediumOfInstruction", lang);
    formData.append("courseDuration", duration);
    formData.append("keyHighlights", JSON.stringify(highlightsArray));
    formData.append("description", desc.trim());
    formData.append("status", status);

    if (logoFile) {
      formData.append("logo", logoFile);
    } else if (logoUrl.trim()) {
      formData.append("logo", logoUrl.trim());
    }

    if (coverFile) {
      formData.append("coverImage", coverFile);
    } else if (coverUrl.trim()) {
      formData.append("coverImage", coverUrl.trim());
    }

    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await api.post("/universities", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("success", `"${name}" added successfully!`);
      } else if (modalMode === "edit" && editingId) {
        await api.put(`/universities/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("success", `"${name}" updated successfully!`);
      }
      closeModal();
      loadData();
    } catch (err: any) {
      console.error("Save error:", err);
      showToast("error", err.message || "Failed to save university. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Active/Inactive Status Quickly
  const handleToggleStatus = async (uni: University) => {
    const newStatus = uni.status === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/universities/${uni._id}`, { status: newStatus });
      setUnis((prev) =>
        prev.map((u) => (u._id === uni._id ? { ...u, status: newStatus } : u))
      );
      showToast("success", `Status changed to ${newStatus} for "${uni.name}"`);
    } catch (err: any) {
      console.error("Status update error:", err);
      showToast("error", "Failed to update status.");
    }
  };

  // Delete University
  const confirmDelete = async () => {
    if (!deletingUni) return;
    try {
      await api.delete(`/universities/${deletingUni._id}`);
      showToast("success", `University deleted successfully.`);
      setUnis((prev) => prev.filter((u) => u._id !== deletingUni._id));
      setDeletingUni(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      showToast("error", "Failed to delete university.");
    }
  };

  // Filter logic
  const filteredUnis = unis.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (uni.description && uni.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const cId = typeof uni.country === "object" ? uni.country?._id : uni.country;
    const matchesCountry = countryFilter === "" || cId === countryFilter;
    const matchesStatus = statusFilter === "" || uni.status === statusFilter;

    return matchesSearch && matchesCountry && matchesStatus;
  });

  // KPI Calculations
  const totalUnis = unis.length;
  const activeUnis = unis.filter((u) => u.status === "Active").length;
  const inactiveUnis = totalUnis - activeUnis;
  const uniqueCountriesCount = new Set(
    unis.map((u) => (typeof u.country === "object" ? u.country?._id : u.country)).filter(Boolean)
  ).size;

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* ═══════════════════ TOAST NOTIFICATION ═══════════════════ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold text-white border backdrop-blur-xl ${
              toastMessage.type === "success"
                ? "bg-emerald-600/95 border-emerald-400 shadow-emerald-900/20"
                : "bg-rose-600/95 border-rose-400 shadow-rose-900/20"
            }`}
          >
            {toastMessage.type === "success" ? <FaCheckCircle className="text-lg text-emerald-200" /> : <FaExclamationCircle className="text-lg text-rose-200" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ HEADER SECTION ═══════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white via-blue-50/40 to-indigo-50/30 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-blue-900/5">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0c2e60] via-[#0F4C81] to-[#1d62a3] flex items-center justify-center text-white shadow-lg shadow-[#0c2e60]/20">
              <FaUniversity className="text-xl text-[#f9a825]" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#0c2e60] bg-white border border-blue-200/80 px-3 py-1 rounded-full shadow-2xs">
              Management Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Universities & Medical Colleges
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Add, update images, fees, and feature medical institutions for student direct admissions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#1d62a3] hover:from-[#0a2550] hover:to-[#0c2e60] text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-[#0c2e60]/25 transition-all duration-300 flex items-center justify-center gap-2.5 text-sm tracking-wide group hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <FaPlus className="text-[#f9a825] text-xs" />
          </div>
          <span>Add New University</span>
        </button>
      </div>

      {/* ═══════════════════ KPI SUMMARY CARDS ═══════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Universities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100/50 flex items-center justify-between group hover:border-[#0c2e60]/40 hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Listed</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{totalUnis}</h3>
            <span className="text-[11px] font-bold text-slate-500 mt-0.5 inline-block">Colleges in database</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-[#0c2e60] border border-blue-200/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            <FaUniversity />
          </div>
        </div>

        {/* Active Universities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100/50 flex items-center justify-between group hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active on Website</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{activeUnis}</h3>
            <span className="text-[11px] font-bold text-emerald-600 mt-0.5 inline-block">Live & visible to students</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 text-emerald-600 border border-emerald-200/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            <FaEye />
          </div>
        </div>

        {/* Countries Represented */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100/50 flex items-center justify-between group hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Countries</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{uniqueCountriesCount}</h3>
            <span className="text-[11px] font-bold text-indigo-600 mt-0.5 inline-block">Study destinations</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 text-indigo-600 border border-indigo-200/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            <FaGlobe />
          </div>
        </div>

        {/* Inactive Universities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100/50 flex items-center justify-between group hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Hidden / Draft</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{inactiveUnis}</h3>
            <span className="text-[11px] font-bold text-amber-600 mt-0.5 inline-block">Draft mode</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 text-amber-600 border border-amber-200/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            <FaEyeSlash />
          </div>
        </div>
      </div>

      {/* ═══════════════════ SEARCH & FILTERS TOOLBAR ═══════════════════ */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search university by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 font-semibold outline-none focus:bg-white focus:border-[#0c2e60] focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
          {/* Country Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#0c2e60] transition-all appearance-none cursor-pointer"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <FaFilter className="text-xs" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#0c2e60] transition-all appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <FaFilter className="text-xs" />
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white text-[#0c2e60] shadow-md shadow-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FaThLarge /> Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-white text-[#0c2e60] shadow-md shadow-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FaList /> Table
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════ MAIN CARDS / TABLE DISPLAY ═══════════════════ */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100/50">
          <div className="w-12 h-12 border-4 border-[#0c2e60] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-500">Loading Universities Database...</p>
        </div>
      ) : filteredUnis.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-100/50 space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#0c2e60] rounded-full flex items-center justify-center mx-auto text-2xl border border-blue-100">
            <FaUniversity />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">No Universities Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm || countryFilter || statusFilter
              ? "No universities match your active search or filter criteria. Try clearing search filters."
              : "No universities added yet. Click 'Add New University' above to get started!"}
          </p>
          {(searchTerm || countryFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCountryFilter("");
                setStatusFilter("");
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* ════════════ ULTRA-PREMIUM GRID VIEW ════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnis.map((uni) => {
            const countryObj = typeof uni.country === "object" ? uni.country : null;
            const countryName = countryObj?.name || "Abroad";

            return (
              <motion.div
                key={uni._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#0c2e60]/40 shadow-lg hover:shadow-2xl hover:shadow-[#0c2e60]/10 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                    {/* Top Cover Banner */}
                    <div className="relative h-44 bg-gradient-to-br from-[#0c2e60] via-[#0F4C81] to-[#1d62a3] overflow-hidden">
                      <img
                        src={
                          uni.coverImage && uni.coverImage.trim() && !uni.coverImage.includes("1568515045052")
                            ? uni.coverImage
                            : campusImagePool[unis.indexOf(uni) % campusImagePool.length]
                        }
                        alt={uni.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            campusImagePool[unis.indexOf(uni) % campusImagePool.length];
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Country Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 backdrop-blur-md text-[#0c2e60] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/60 shadow-md flex items-center gap-1.5">
                        <FaGlobe className="text-blue-600 text-xs" />
                        <span>{countryName}</span>
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleStatus(uni)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md transition-all flex items-center gap-1.5 ${
                          uni.status === "Active"
                            ? "bg-emerald-500/90 text-white border border-emerald-300/40 hover:bg-emerald-600"
                            : "bg-slate-900/90 text-slate-300 border border-slate-700 hover:bg-slate-800"
                        }`}
                        title="Click to toggle status"
                      >
                        {uni.status === "Active" ? <FaEye className="text-xs" /> : <FaEyeSlash className="text-xs" />}
                        <span>{uni.status}</span>
                      </button>
                    </div>

                    {/* Floating Graduation Cap Icon Avatar */}
                    <div className="absolute -bottom-5 left-6 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-lg flex items-center justify-center text-[#13376B] z-10">
                      {uni.logo && !uni.logo.includes('unsplash.com') ? (
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

                  {/* Body Details */}
                  <div className="p-6 pt-9 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0F4C81] transition-colors leading-snug line-clamp-2">
                        {uni.name}
                      </h3>
                      {uni.ranking && uni.ranking !== "N/A" && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg mt-2">
                          <FaAward className="text-amber-500 text-xs" />
                          <span>🏆 {uni.ranking}</span>
                        </span>
                      )}
                    </div>

                    {/* Financials & Duration Quick Pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Annual Tuition
                        </span>
                        <span className="font-extrabold text-emerald-700 text-xs line-clamp-1">
                          {uni.tuitionFee}
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Course Duration
                        </span>
                        <span className="font-extrabold text-slate-800 text-xs line-clamp-1">
                          {uni.courseDuration || "6 Years"}
                        </span>
                      </div>
                    </div>

                    {/* Description Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">
                      {uni.description}
                    </p>

                    {/* Highlights tags */}
                    {uni.keyHighlights && uni.keyHighlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {uni.keyHighlights.slice(0, 3).map((h, i) => (
                          <span
                            key={i}
                            className="bg-blue-50 text-[#0F4C81] border border-blue-100 px-2.5 py-0.5 rounded-md text-[10px] font-bold"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(uni)}
                      className="bg-white hover:bg-blue-50 text-slate-700 hover:text-[#0F4C81] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingUni(uni)}
                      className="bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(uni)}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                    title={uni.status === "Active" ? "Click to set Inactive" : "Click to set Active"}
                  >
                    {uni.status === "Active" ? (
                      <FaToggleOn className="text-emerald-500 text-2xl" />
                    ) : (
                      <FaToggleOff className="text-slate-300 text-2xl" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ════════════ TABLE VIEW ════════════ */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">University</th>
                  <th className="py-4 px-4">Country</th>
                  <th className="py-4 px-4">Tuition Fee</th>
                  <th className="py-4 px-4">Duration</th>
                  <th className="py-4 px-4">Ranking</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {filteredUnis.map((uni) => {
                  const countryObj = typeof uni.country === "object" ? uni.country : null;
                  const countryName = countryObj?.name || "Abroad";

                  return (
                    <tr key={uni._id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {uni.logo ? (
                              <img src={uni.logo} alt={uni.name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <FaUniversity className="text-slate-400 text-lg" />
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block leading-snug">{uni.name}</span>
                            <span className="text-[11px] text-slate-400 font-medium">Est. {uni.established || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-bold inline-block">
                          {countryName}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-emerald-700">{uni.tuitionFee}</td>

                      <td className="py-4 px-4 text-xs text-slate-600">{uni.courseDuration || "6 Years"}</td>

                      <td className="py-4 px-4 text-xs text-amber-700 font-bold">{uni.ranking || "N/A"}</td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(uni)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all inline-flex items-center gap-1 ${
                            uni.status === "Active"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {uni.status === "Active" ? <FaEye className="text-xs" /> : <FaEyeSlash className="text-xs" />}
                          <span>{uni.status}</span>
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(uni)}
                          className="p-2 text-slate-600 hover:text-[#0F4C81] hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit University"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeletingUni(uni)}
                          className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete University"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════ ADD / EDIT MODAL WITH DUAL IMAGE UPLOADER ═══════════════════ */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#0c2e60] via-[#0F4C81] to-[#1d62a3] p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#f9a825]">
                    <FaUniversity className="text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">
                      {modalMode === "add" ? "Add New University" : "Edit University Details"}
                    </h2>
                    <p className="text-xs text-blue-100 font-medium">
                      Fill out institution metadata & upload images for website listing.
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* 1. Basic Metadata */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0F4C81] flex items-center gap-2">
                    <FaBuilding /> 1. Basic Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        University Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tbilisi State Medical University"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Country Destination <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={countryId}
                        onChange={(e) => setCountryId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60] cursor-pointer"
                      >
                        <option value="" disabled>
                          Select Country
                        </option>
                        {countries.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Established Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1918"
                        value={established}
                        onChange={(e) => setEstablished(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Ranking / Accreditation
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Country Rank: 4, World Rank: 3840"
                        value={ranking}
                        onChange={(e) => setRanking(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* 2. Financials & Course Structure */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0F4C81] flex items-center gap-2">
                    <FaMoneyBillWave /> 2. Financials & Duration
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tuition Fee (Annual) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. $5,000 / Year or ₹3,80,000 / Year"
                        value={tuitionFee}
                        onChange={(e) => setTuitionFee(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Hostel Fee (Annual)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. $1,000 / Year"
                        value={hostelFee}
                        onChange={(e) => setHostelFee(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Course Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 6 Years or 5.5 Years"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Medium of Instruction
                      </label>
                      <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                      >
                        <option value="English">English</option>
                        <option value="Bilingual">Bilingual</option>
                        <option value="Native / Russian">Native / Russian</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* 3. Media & Image Uploads */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0F4C81] flex items-center gap-2">
                    <FaImage /> 3. University Images (Upload File or Paste Image URL)
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Cover Banner Image Field */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Cover Photo / Banner Image
                      </label>

                      {/* Cover Live Preview */}
                      {coverPreview ? (
                        <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-200 group">
                          <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setCoverPreview("");
                              setCoverUrl("");
                              setCoverFile(null);
                            }}
                            className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors shadow-md"
                            title="Remove image"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        /* Upload Box */
                        <label className="border-2 border-dashed border-slate-300 hover:border-[#0c2e60] bg-slate-50 hover:bg-blue-50/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                          <FaCloudUploadAlt className="text-3xl text-[#0F4C81] mb-1" />
                          <span className="text-xs font-bold text-slate-800">Click to Upload Cover Image</span>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5">JPG, PNG, WEBP max 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverFileChange}
                            className="hidden"
                          />
                        </label>
                      )}

                      {/* URL Fallback Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs pointer-events-none">
                          <FaLink />
                        </span>
                        <input
                          type="text"
                          placeholder="Or paste Cover Image URL..."
                          value={coverUrl}
                          onChange={(e) => {
                            setCoverUrl(e.target.value);
                            setCoverPreview(e.target.value);
                            setCoverFile(null);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                        />
                      </div>
                    </div>

                    {/* Logo Image Field */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        University Logo Icon
                      </label>

                      {/* Logo Live Preview */}
                      {logoPreview ? (
                        <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-2 group">
                          <img src={logoPreview} alt="Logo Preview" className="h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview("");
                              setLogoUrl("");
                              setLogoFile(null);
                            }}
                            className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors shadow-md"
                            title="Remove image"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        /* Upload Box */
                        <label className="border-2 border-dashed border-slate-300 hover:border-[#0c2e60] bg-slate-50 hover:bg-blue-50/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                          <FaCloudUploadAlt className="text-3xl text-[#0F4C81] mb-1" />
                          <span className="text-xs font-bold text-slate-800">Click to Upload Logo Icon</span>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5">Square PNG/JPG logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileChange}
                            className="hidden"
                          />
                        </label>
                      )}

                      {/* URL Fallback Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs pointer-events-none">
                          <FaLink />
                        </span>
                        <input
                          type="text"
                          placeholder="Or paste Logo URL..."
                          value={logoUrl}
                          onChange={(e) => {
                            setLogoUrl(e.target.value);
                            setLogoPreview(e.target.value);
                            setLogoFile(null);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* 4. Highlights & Overview */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0F4C81] flex items-center gap-2">
                    <FaAward /> 4. Highlights & Details
                  </h4>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Key Highlights (Comma Separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WHO listed, NMC approved, 100% English Medium"
                      value={highlights}
                      onChange={(e) => setHighlights(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Description / Overview <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Provide a detailed overview of clinical exposure, infrastructure, and campus life..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-[#0c2e60]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Website Status
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="radio"
                          name="status"
                          value="Active"
                          checked={status === "Active"}
                          onChange={() => setStatus("Active")}
                          className="text-[#0c2e60] focus:ring-0"
                        />
                        <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          Active (Visible to Students)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="radio"
                          name="status"
                          value="Inactive"
                          checked={status === "Inactive"}
                          onChange={() => setStatus("Inactive")}
                          className="text-[#0c2e60] focus:ring-0"
                        />
                        <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          Inactive (Hidden)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-[#0c2e60] to-[#0F4C81] hover:opacity-95 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaCheckCircle className="text-[#f9a825]" />
                    )}
                    <span>{modalMode === "add" ? "Save University" : "Update University"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ DELETE CONFIRMATION MODAL ═══════════════════ */}
      <AnimatePresence>
        {deletingUni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                <FaTrash />
              </div>
              <h3 className="text-xl font-black text-slate-900">Delete University?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong className="text-slate-800">{deletingUni.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingUni(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
