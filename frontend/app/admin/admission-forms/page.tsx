"use client";

import React, { useEffect, useState } from "react";
import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { AdmissionFormLead } from "@/types";

export default function AdminAdmissionFormsPage() {
  const [leads, setLeads] = useState<AdmissionFormLead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Edit Lead Modal State
  const [editingLead, setEditingLead] = useState<AdmissionFormLead | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editNeetScore, setEditNeetScore] = useState(0);
  const [editInterestedIn, setEditInterestedIn] = useState<"India" | "Abroad" | "Both">("Abroad");
  const [editCountry, setEditCountry] = useState("");
  const [editStatus, setEditStatus] = useState<"Pending" | "Contacted" | "In Discussion" | "Admitted" | "Closed">("Pending");
  const [editNotes, setEditNotes] = useState("");

  // Add Lead Modal State
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newNeetScore, setNewNeetScore] = useState(0);
  const [newInterestedIn, setNewInterestedIn] = useState<"India" | "Abroad" | "Both">("Abroad");
  const [newCountry, setNewCountry] = useState("");
  const [newStatus, setNewStatus] = useState<"Pending" | "Contacted" | "In Discussion" | "Admitted" | "Closed">("Pending");
  const [newNotes, setNewNotes] = useState("");

  async function loadLeads() {
    try {
      setLoading(true);
      const data: any = await api.get("/admissions");
      if (data && data.success) {
        setLeads(data.leads);
      }
    } catch (err: unknown) {
      console.warn("Failed retrieving live leads from backend. Falling back to mock leads.");
      setLeads([
        {
          _id: "lead-1",
          fullName: "Priyesh Patel",
          email: "priyesh@gmail.com",
          phone: "6284063840",
          neetScore: 420,
          interestedIn: "Abroad",
          country: "Georgia",
          status: "Pending",
          notes: "Interested in Tbilisi State Medical University. Budget is around 25 Lakhs.",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "lead-2",
          fullName: "Meera Nair",
          email: "meera@gmail.com",
          phone: "9988776655",
          neetScore: 580,
          interestedIn: "Both",
          country: "India",
          status: "Contacted",
          notes: "Prefers government seats. Wants options in south India deemed universities.",
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  // Open Edit Modal
  const handleEditClick = (lead: AdmissionFormLead) => {
    setEditingLead(lead);
    setEditName(lead.fullName);
    setEditEmail(lead.email);
    setEditPhone(lead.phone);
    setEditNeetScore(lead.neetScore);
    setEditInterestedIn(lead.interestedIn);
    setEditCountry(lead.country);
    setEditStatus(lead.status);
    setEditNotes(lead.notes || "");
  };

  // Submit Edit Details
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    const payload = {
      fullName: editName,
      email: editEmail,
      phone: editPhone,
      neetScore: Number(editNeetScore),
      interestedIn: editInterestedIn as "India" | "Abroad" | "Both",
      country: editCountry,
      status: editStatus as "Pending" | "Contacted" | "In Discussion" | "Admitted" | "Closed",
      notes: editNotes,
    };

    try {
      await api.put(`/admissions/${editingLead._id}`, payload);
      setEditingLead(null);
      loadLeads();
    } catch (err: unknown) {
      console.error(err);
      // Fallback local edit update for mock environment
      setLeads(prev =>
        prev.map(l =>
          l._id === editingLead._id
            ? { ...l, ...payload, _id: editingLead._id, createdAt: l.createdAt }
            : l
        )
      );
      setEditingLead(null);
    }
  };

  // Submit Add Lead
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fullName: newName,
      email: newEmail,
      phone: newPhone,
      neetScore: Number(newNeetScore),
      interestedIn: newInterestedIn as "India" | "Abroad" | "Both",
      country: newCountry,
      status: newStatus as "Pending" | "Contacted" | "In Discussion" | "Admitted" | "Closed",
      notes: newNotes,
    };

    try {
      await api.post("/admissions", payload);
      setIsAdding(false);
      resetAddForm();
      loadLeads();
    } catch (err: unknown) {
      console.error(err);
      // Fallback local creation for mock environment
      const mockLead: AdmissionFormLead = {
        _id: "lead-" + Date.now(),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      setLeads(prev => [mockLead, ...prev]);
      setIsAdding(false);
      resetAddForm();
    }
  };

  const resetAddForm = () => {
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewNeetScore(0);
    setNewInterestedIn("Abroad");
    setNewCountry("");
    setNewStatus("Pending");
    setNewNotes("");
  };

  // Delete Lead
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/admissions/${id}`);
      loadLeads();
    } catch (err: unknown) {
      console.error(err);
      setLeads(prev => prev.filter(l => l._id !== id));
    }
  };

  // Filtering leads on client-side (search and status)
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate quick stats
  const totalCount = leads.length;
  const pendingCount = leads.filter(l => l.status === "Pending").length;
  const contactedCount = leads.filter(l => l.status === "Contacted").length;
  const discussionCount = leads.filter(l => l.status === "In Discussion").length;
  const admittedCount = leads.filter(l => l.status === "Admitted").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* ═══ 1. Title & Action Bar ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0c2e60] tracking-wide uppercase">
            Student Admission Leads
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Review student registrations, manage pipeline statuses, and record counseling logs.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-blue-900/10 transition-all uppercase tracking-wider hover:-translate-y-0.5 active:scale-95 duration-200"
        >
          <FaPlus size={10} /> Add New Lead
        </button>
      </div>

      {/* ═══ 2. CRM Summary Badges (Framer motion hover scale) ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Leads", count: totalCount, color: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-350" },
          { label: "Pending", count: pendingCount, color: "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-350" },
          { label: "Contacted", count: contactedCount, color: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-350" },
          { label: "Discussion", count: discussionCount, color: "border-purple-200 bg-purple-50 text-purple-700 hover:border-purple-350" },
          { label: "Admitted", count: admittedCount, color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-350" },
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

      {/* ═══ 3. Search & Filter Controls ═══ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch size={12} />
          </span>
          <input
            type="text"
            placeholder="Search by name, phone, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          />
        </div>

        {/* Status filter dropdown */}
        <div className="w-full md:w-56 flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold flex-shrink-0 flex items-center gap-1">
            <FaFilter size={10} /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="In Discussion">In Discussion</option>
            <option value="Admitted">Admitted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

      </div>

      {/* ═══ 4. Leads Table ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#0c2e60] text-[#f9a825] font-black uppercase tracking-wider">
                <th className="py-4 px-6 text-[10px]">Date</th>
                <th className="py-4 px-6 text-[10px]">Student Details</th>
                <th className="py-4 px-6 text-[10px]">Source</th>
                <th className="py-4 px-6 text-center text-[10px]">NEET Score</th>
                <th className="py-4 px-6 text-[10px]">Preference</th>
                <th className="py-4 px-6 text-[10px]">Country</th>
                <th className="py-4 px-6 text-[10px]">Status</th>
                <th className="py-4 px-6 text-[10px]">Discussion Logs</th>
                <th className="py-4 px-6 text-right text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-text-dark font-semibold divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold italic">
                    <FaInfoCircle className="inline-block mr-1.5" /> No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-sm text-[#0c2e60] block">{lead.fullName}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{lead.email} • {lead.phone}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider inline-block ${
                        lead.source === "Ads"
                          ? "bg-purple-50 text-purple-600 border border-purple-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {lead.source || "Website"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg font-black text-xs inline-block">
                        {lead.neetScore}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[11px]">{lead.interestedIn}</td>
                    <td className="py-4 px-6 font-bold">{lead.country}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                        lead.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                          : lead.status === "Contacted"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : lead.status === "Admitted"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : lead.status === "In Discussion"
                          ? "bg-purple-50 text-purple-600 border border-purple-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate text-[11px]" title={lead.notes}>
                      {lead.notes || <span className="italic text-slate-300">No logs written</span>}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(lead)}
                        className="p-2 border border-slate-100 hover:border-blue-200 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block"
                        title="Update details"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-2 border border-slate-100 hover:border-red-200 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block"
                        title="Delete lead"
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

      {/* ═══ 5. Add Lead Modal (Framer Motion spring transitions) ═══ */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full space-y-4 shadow-2xl relative z-10"
            >
              <button
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Add New Student Lead
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Student full name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="10 digit mobile"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">NEET Score</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 520"
                      value={newNeetScore || ""}
                      onChange={(e) => setNewNeetScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Preference</label>
                    <select
                      value={newInterestedIn}
                      onChange={(e) => setNewInterestedIn(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Abroad">Abroad</option>
                      <option value="India">India</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Target Country</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Georgia"
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as "Pending" | "Contacted" | "In Discussion" | "Admitted" | "Closed")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Admitted">Admitted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Counselor Discussion Notes</label>
                  <textarea
                    rows={3}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Enter initial counseling logs or budget specifications..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold rounded-xl text-xs shadow-md uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Create Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ 6. Edit Lead Modal (Framer Motion spring transitions) ═══ */}
      <AnimatePresence>
        {editingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingLead(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full space-y-4 shadow-2xl relative z-10"
            >
              <button
                onClick={() => setEditingLead(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Edit Lead Details
              </h3>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">NEET Score</label>
                    <input
                      type="number"
                      required
                      value={editNeetScore || ""}
                      onChange={(e) => setEditNeetScore(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Preference</label>
                    <select
                      value={editInterestedIn}
                      onChange={(e) => setEditInterestedIn(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Abroad">Abroad</option>
                      <option value="India">India</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Target Country</label>
                    <input
                      type="text"
                      required
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as "Pending" | "Contacted" | "In Discussion" | "Admitted" | "Closed")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Admitted">Admitted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Counselor Discussion Notes</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter initial counseling logs or budget specifications..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
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
