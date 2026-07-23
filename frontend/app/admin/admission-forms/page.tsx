"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaUserPlus,
  FaPhoneAlt,
  FaComments,
  FaFileAlt,
  FaGraduationCap,
  FaSearch,
  FaFilter,
  FaFileExport,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEllipsisV,
  FaArrowUp,
  FaDownload,
  FaPlus,
  FaTimes,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaWhatsapp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";

/* ──────── TYPES ──────── */
interface Lead {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  neetScore: number;
  interestedIn: string;
  country: string;
  status: string;
  notes?: string;
  source?: string;
  createdAt: string;
}

const ASSIGNEES = ["Neha Sharma", "Rohit Verma", "Anjali Mehta"];

/* ──────── HELPERS ──────── */
const fmt = (n: number) => n.toLocaleString("en-IN");
const pct = (v: number, total: number) => total > 0 ? ((v / total) * 100).toFixed(1) : "0.0";

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const avatarColors = ["#3b82f6", "#f59e0b", "#22c55e", "#8b5cf6", "#ef4444", "#ec4899", "#0ea5e9", "#14b8a6"];
const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const getCourse = (interestedIn: string) => {
  const courses: Record<string, string> = { India: "MBBS in India", Abroad: "MBBS Abroad", Both: "BDS" };
  return courses[interestedIn] || interestedIn || "MBBS Abroad";
};

const getDisplayStatus = (st: string) => {
  const map: Record<string, string> = { Pending: "New", "In Discussion": "Counselling Done", Admitted: "Admission", Applied: "Application" };
  return map[st] || st;
};

const statusStyle = (st: string): string => {
  switch (st) {
    case "New": case "Pending": return "bg-[#dbeafe] text-[#2563eb] border-[#93c5fd]";
    case "Contacted": return "bg-[#fef3c7] text-[#d97706] border-[#fcd34d]";
    case "Counselling Done": case "In Discussion": return "bg-[#d1fae5] text-[#059669] border-[#6ee7b7]";
    case "Application": case "Applied": return "bg-[#ede9fe] text-[#7c3aed] border-[#c4b5fd]";
    case "Admission": case "Admitted": return "bg-[#dcfce7] text-[#16a34a] border-[#86efac]";
    case "Closed": return "bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const sourceBadge = (src: string) => {
  const map: Record<string, string> = {
    "Google Ads": "bg-[#fef3c7] text-[#92400e]",
    Website: "bg-[#dbeafe] text-[#1e40af]",
    "Facebook Ads": "bg-[#dbeafe] text-[#1d4ed8]",
    Referral: "bg-[#f3e8ff] text-[#6b21a8]",
    "Instagram Ads": "bg-[#fce7f3] text-[#9d174d]",
    "Walk In": "bg-[#e0f2fe] text-[#0c4a6e]",
  };
  return map[src] || "bg-slate-100 text-slate-600";
};

/* ──────── Donut Helper ──────── */
function MiniDonut({ segments, size = 130, sw = 16, label, sub }: {
  segments: { value: number; color: string }[];
  size?: number; sw?: number; label: string; sub: string;
}) {
  const r = (size - sw) / 2, cx = size / 2, cy = size / 2, C = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let acc = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((seg, i) => {
          const f = seg.value / total, dl = f * C, gap = C - dl, off = (acc / total) * C;
          acc += seg.value;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={sw} strokeDasharray={`${dl} ${gap}`} strokeDashoffset={-off} strokeLinecap="butt" />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[15px] font-extrabold text-[#1a1f36] leading-none">{label}</span>
        <span className="text-[9px] text-[#8c95a6] font-semibold mt-0.5">{sub}</span>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */
export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    fullName: "", phone: "", email: "", neetScore: 0, interestedIn: "Abroad", source: "Website", status: "Pending", notes: ""
  });

  const [editForm, setEditForm] = useState({
    fullName: "", phone: "", email: "", neetScore: 0, interestedIn: "Abroad", source: "Website", status: "Pending", notes: ""
  });

  const [apiStats, setApiStats] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  async function loadLeads() {
    try {
      setLoading(true);
      const data: any = await api.get("/admissions");
      if (data?.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
        if (data.stats) setApiStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load leads from DB:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLeads(); }, []);

  // Export CSV Functionality
  const exportLeadsCSV = () => {
    if (leads.length === 0) {
      showToast("No leads available to export!");
      return;
    }

    const headers = ["ID", "Full Name", "Phone", "Email", "NEET Score", "Course Interested", "Country", "Source", "Status", "Notes", "Created At"];
    const rows = filtered.map((l, idx) => [
      `"#L-${idx + 1}"`,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      l.neetScore || 0,
      `"${getCourse(l.interestedIn)}"`,
      `"${l.country || ''}"`,
      `"${l.source || 'Website'}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleDateString("en-GB")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admission_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Leads exported successfully as CSV!");
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await api.delete(`/admissions/${id}`);
      showToast("Lead deleted successfully!");
      if (selectedLead?._id === id) setSelectedLead(null);
      loadLeads();
    } catch (err: any) {
      setLeads(prev => prev.filter(l => l._id !== id));
      if (selectedLead?._id === id) setSelectedLead(null);
      showToast("Lead deleted!");
    }
  };

  // Update Lead Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    try {
      await api.put(`/admissions/${editingLead._id}`, editForm);
      showToast("Lead updated successfully!");
      setEditingLead(null);
      loadLeads();
    } catch (err: any) {
      setLeads(prev => prev.map(l => l._id === editingLead._id ? { ...l, ...editForm } : l));
      showToast("Lead updated!");
      setEditingLead(null);
    }
  };

  // Stats dynamically derived from DB
  const totalLeads = apiStats?.totalLeads ?? leads.length;
  const newLeads = apiStats?.newLeads ?? leads.filter(l => l.status === "Pending").length;
  const contacted = apiStats?.contacted ?? leads.filter(l => l.status === "Contacted").length;
  const counselling = apiStats?.counselling ?? leads.filter(l => l.status === "In Discussion").length;
  const applications = apiStats?.applications ?? leads.filter(l => ["Applied", "Admitted"].includes(l.status)).length;
  const admissions = apiStats?.admissions ?? leads.filter(l => l.status === "Admitted").length;

  // Filter
  const filtered = leads.filter(l => {
    const matchSearch = !searchTerm || l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || l.email.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm) || (l._id || "").includes(searchTerm);
    const matchStatus = !statusFilter || l.status === statusFilter;
    const matchSource = !sourceFilter || (l.source || "").toLowerCase().includes(sourceFilter.toLowerCase());
    const matchCourse = !courseFilter || getCourse(l.interestedIn).toLowerCase().includes(courseFilter.toLowerCase());
    return matchSearch && matchStatus && matchSource && matchCourse;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, filtered.length);

  // Source stats for sidebar
  const srcCounts: Record<string, number> = {};
  leads.forEach(l => { const s = l.source || "Website"; srcCounts[s] = (srcCounts[s] || 0) + 1; });
  const srcEntries = Object.entries(srcCounts).sort((a, b) => b[1] - a[1]);
  const srcColors: Record<string, string> = { Website: "#22c55e", "Facebook Ads": "#3b82f6", "Google Ads": "#f59e0b", Referral: "#8b5cf6", Others: "#94a3b8", "Instagram Ads": "#ec4899", "Walk In": "#0ea5e9" };

  // Overview segments for donut
  const overviewSegs = [
    { label: "New", value: newLeads, color: "#3b82f6" },
    { label: "Contacted", value: contacted, color: "#22c55e" },
    { label: "Counselling", value: counselling, color: "#f59e0b" },
    { label: "Application", value: applications, color: "#8b5cf6" },
    { label: "Admission", value: admissions, color: "#ec4899" },
  ];

  // Funnel
  const funnelItems = [
    { label: "Total Leads", value: totalLeads, color: "#3b82f6" },
    { label: "Contacted", value: contacted, color: "#22c55e" },
    { label: "Counselling Done", value: counselling, color: "#f59e0b" },
    { label: "Applications", value: applications, color: "#8b5cf6" },
    { label: "Admissions", value: admissions, color: "#ec4899" },
  ];

  // Submit add lead
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admissions", { ...addForm, neetScore: Number(addForm.neetScore) });
      setShowAddModal(false);
      setAddForm({ fullName: "", phone: "", email: "", neetScore: 0, interestedIn: "Abroad", source: "Website", status: "Pending", notes: "" });
      showToast("Lead added successfully!");
      loadLeads();
    } catch {
      const mock: Lead = { _id: "l-" + Date.now(), ...addForm, neetScore: Number(addForm.neetScore), country: "", createdAt: new Date().toISOString() };
      setLeads(prev => [mock, ...prev]);
      setShowAddModal(false);
      showToast("Lead added!");
    }
  };

  // KPI cards
  const kpis = [
    { label: "Total Leads", value: totalLeads, icon: <FaUsers />, iconBg: "bg-[#ede9fe] text-[#7c3aed]", pctUp: "12.5" },
    { label: "New Leads", value: newLeads, icon: <FaUserPlus />, iconBg: "bg-[#dbeafe] text-[#3b82f6]", pctUp: "8.6" },
    { label: "Contacted", value: contacted, icon: <FaPhoneAlt />, iconBg: "bg-[#ffedd5] text-[#f97316]", pctUp: "10.2" },
    { label: "Counselling Done", value: counselling, icon: <FaComments />, iconBg: "bg-[#dcfce7] text-[#22c55e]", pctUp: "14.3" },
    { label: "Applications", value: applications, icon: <FaFileAlt />, iconBg: "bg-[#ede9fe] text-[#8b5cf6]", pctUp: "11.8" },
    { label: "Admissions (Success)", value: admissions, icon: <FaGraduationCap />, iconBg: "bg-[#e0f2fe] text-[#0ea5e9]", pctUp: "15.7" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-32"><div className="w-10 h-10 border-4 border-[#1a6de1] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-[#0c1527] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#1a6de1]"
          >
            <FaCheckCircle className="text-[#10b981] text-lg" />
            <span className="text-[13px] font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="text-[12px] text-[#8c95a6] font-medium">
        <Link href="/admin" className="hover:text-[#1a6de1]">Dashboard</Link>
        <span className="mx-1.5">&gt;</span>
        <span className="text-[#1a1f36] font-semibold">Leads</span>
      </div>

      {/* ═══ KPI Cards ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#eef0f4] p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[9px] font-semibold text-[#8c95a6] uppercase tracking-wider leading-tight">{k.label}</span>
              <div className={`w-7 h-7 rounded-full ${k.iconBg} flex items-center justify-center text-[11px] flex-shrink-0`}>{k.icon}</div>
            </div>
            <h3 className="text-[20px] font-extrabold text-[#1a1f36] leading-none">{fmt(k.value)}</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5"><FaArrowUp className="text-[6px]" /> {k.pctUp}%</span>
              <span className="text-[9px] text-[#a0aab8]">vs Apr 01 - Apr 30</span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Filter Bar ═══ */}
      <div className="bg-white rounded-xl border border-[#eef0f4] p-3 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg flex-1 min-w-[200px]">
          <FaSearch className="text-[#a0aab8] text-[12px]" />
          <input
            type="text"
            placeholder="Search by name, phone, email or lead ID..."
            className="bg-transparent outline-none text-[12px] text-[#3d4555] w-full placeholder:text-[#b0b8c4]"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        {/* Dropdowns */}
        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer">
          <option>This Month</option><option>Last Month</option><option>Last 3 Months</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer"
          value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}>
          <option value="">All Sources</option><option>Google Ads</option><option>Website</option><option>Facebook Ads</option><option>Referral</option><option>Instagram Ads</option><option>Walk In</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer"
          value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option><option value="Pending">New</option><option value="Contacted">Contacted</option><option value="In Discussion">Counselling Done</option><option value="Admitted">Admission</option><option value="Closed">Closed</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer"
          value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}>
          <option value="">All Courses</option><option>MBBS in India</option><option>MBBS Abroad</option><option>BDS</option><option>Nursing</option><option>Ayush</option>
        </select>

        <button onClick={loadLeads} className="flex items-center gap-1.5 px-4 py-[7px] bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg text-[12px] font-semibold transition-colors">
          <FaFilter className="text-[10px]" /> Filter
        </button>

        {/* 📥 EXPORT CSV BUTTON */}
        <button onClick={exportLeadsCSV} className="flex items-center gap-1.5 px-4 py-[7px] border border-[#1a6de1] text-[#1a6de1] hover:bg-[#f0f6ff] rounded-lg text-[12px] font-semibold transition-colors">
          <FaFileExport className="text-[10px]" /> Export
        </button>
      </div>

      {/* ═══ Main Content: Table + Right Sidebar ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* LEFT: Leads Table */}
        <div className="xl:col-span-9 bg-white rounded-xl border border-[#eef0f4] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#eef0f4] bg-[#fafbfc]">
                  <th className="py-3 pl-4 pr-2 w-8"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 accent-[#1a6de1]" /></th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Lead Details</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Contact</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Source</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Course Interested</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Assigned To</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Created At</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((lead, idx) => {
                  const initials = getInitials(lead.fullName);
                  const color = getAvatarColor(lead.fullName);
                  const leadNum = totalLeads - ((page - 1) * perPage + idx);
                  const display = getDisplayStatus(lead.status);
                  const source = lead.source || "Website";
                  const course = getCourse(lead.interestedIn);
                  const assignee = ASSIGNEES[(page - 1 + idx) % ASSIGNEES.length];
                  const assigneeInit = getInitials(assignee);
                  const dt = new Date(lead.createdAt);

                  return (
                    <tr key={lead._id} className="border-b border-[#f5f6f8] hover:bg-[#fafbfd] transition-colors group">
                      {/* Checkbox */}
                      <td className="py-3 pl-4 pr-2"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 accent-[#1a6de1]" /></td>

                      {/* Lead Details */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: color }}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold text-[#1a1f36] leading-tight truncate">{lead.fullName}</div>
                            <div className="text-[10px] text-[#a0aab8] font-medium">#L-{leadNum}</div>
                            <div className="text-[10px] text-[#8c95a6] truncate">{lead.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3 text-[12px] text-[#3d4555] whitespace-nowrap">{lead.phone}</td>

                      {/* Source */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-semibold ${sourceBadge(source)} whitespace-nowrap`}>
                          {source}
                        </span>
                      </td>

                      {/* Course */}
                      <td className="py-3 px-3 text-[12px] text-[#3d4555] font-medium whitespace-nowrap">{course}</td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-[3px] rounded-full text-[10px] font-bold border ${statusStyle(display)} whitespace-nowrap`}>
                          {display}
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 flex-shrink-0">
                            {assigneeInit}
                          </div>
                          <span className="text-[11px] text-[#3d4555] font-medium whitespace-nowrap">{assignee}</span>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-3 px-3">
                        <div className="text-[11px] text-[#3d4555] font-medium whitespace-nowrap">
                          {dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <div className="text-[10px] text-[#a0aab8]">
                          {dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </div>
                      </td>

                      {/* ⚡ ACTIONS COLUMN (Phone Call, View Modal, Edit, Delete) */}
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Call Button */}
                          <a
                            href={`tel:${lead.phone}`}
                            title="Call Lead"
                            className="w-7 h-7 rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] flex items-center justify-center text-[11px] transition-colors"
                          >
                            <FaPhoneAlt />
                          </a>

                          {/* View Button */}
                          <button
                            onClick={() => setSelectedLead(lead)}
                            title="View Lead Details"
                            className="w-7 h-7 rounded-lg bg-[#f4f0ff] hover:bg-[#e0d7ff] text-[#6366f1] flex items-center justify-center text-[11px] transition-colors"
                          >
                            <FaEye />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setEditForm({
                                fullName: lead.fullName,
                                phone: lead.phone,
                                email: lead.email,
                                neetScore: lead.neetScore || 0,
                                interestedIn: lead.interestedIn || "Abroad",
                                source: lead.source || "Website",
                                status: lead.status || "Pending",
                                notes: lead.notes || "",
                              });
                            }}
                            title="Edit Lead"
                            className="w-7 h-7 rounded-lg bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#16a34a] flex items-center justify-center text-[11px] transition-colors"
                          >
                            <FaEdit />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            title="Delete Lead"
                            className="w-7 h-7 rounded-lg bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48] flex items-center justify-center text-[11px] transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-[#eef0f4] flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-[#8c95a6] font-medium">
              Showing {startIdx} to {endIdx} of {fmt(filtered.length)} leads
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-[#e8ecf1] flex items-center justify-center text-[#8c95a6] text-[11px] hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <FaChevronLeft />
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-colors ${page === p ? "bg-[#1a6de1] text-white" : "border border-[#e8ecf1] text-[#5a6478] hover:bg-slate-50"}`}>
                  {p}
                </button>
              ))}
              {totalPages > 4 && <span className="text-[#8c95a6] text-[12px] px-1">...</span>}
              {totalPages > 3 && (
                <button onClick={() => setPage(totalPages)} className={`w-8 h-8 rounded-lg text-[12px] font-semibold border border-[#e8ecf1] text-[#5a6478] hover:bg-slate-50 transition-colors ${page === totalPages ? "bg-[#1a6de1] text-white border-[#1a6de1]" : ""}`}>
                  {totalPages}
                </button>
              )}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg border border-[#e8ecf1] flex items-center justify-center text-[#8c95a6] text-[11px] hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="xl:col-span-3 space-y-4">
          {/* Leads Overview */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[12px] font-bold text-[#1a1f36]">Leads Overview</h4>
              <span className="text-[10px] text-[#8c95a6] font-medium">This Month</span>
            </div>
            <div className="flex justify-center mb-3">
              <MiniDonut segments={overviewSegs} size={140} sw={18} label={fmt(totalLeads)} sub="Total" />
            </div>
            <div className="space-y-1.5">
              {overviewSegs.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-[#5a6478]">{s.label}</span></div>
                  <span className="font-bold text-[#1a1f36]">{fmt(s.value)} <span className="text-[#a0aab8] font-normal">({pct(s.value, totalLeads)}%)</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Leads Source */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[12px] font-bold text-[#1a1f36]">Leads Source</h4>
              <span className="text-[10px] text-[#8c95a6] font-medium">This Month</span>
            </div>
            <div className="space-y-2.5">
              {(srcEntries.length > 0 ? srcEntries : [["Website", 5678], ["Facebook Ads", 2980], ["Google Ads", 2345], ["Referral", 1245], ["Others", 210]]).map(([name, val], i) => {
                const v = Number(val);
                const maxVal = Math.max(...(srcEntries.length > 0 ? srcEntries.map(e => Number(e[1])) : [5678]));
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-[#5a6478] font-medium">{name}</span>
                      <span className="font-bold text-[#1a1f36]">{fmt(v)} <span className="text-[#a0aab8] font-normal text-[9px]">({pct(v, totalLeads)}%)</span></span>
                    </div>
                    <div className="w-full h-[5px] bg-[#f0f2f5] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(v / maxVal) * 100}%`, backgroundColor: srcColors[String(name)] || "#94a3b8" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Status Funnel */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <h4 className="text-[12px] font-bold text-[#1a1f36] mb-3">Lead Status Funnel</h4>
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 100 130" className="w-[80px] flex-shrink-0">
                {funnelItems.map((fi, i) => {
                  const h = 22, gap = 3, y = i * (h + gap), fullW = 90;
                  const w = fullW * (1 - i * 0.18);
                  const nw = i < funnelItems.length - 1 ? fullW * (1 - (i + 1) * 0.18) : w * 0.7;
                  const x = (fullW - w) / 2 + 5, nx = (fullW - nw) / 2 + 5;
                  return <polygon key={i} points={`${x},${y} ${x + w},${y} ${nx + nw},${y + h} ${nx},${y + h}`} fill={fi.color} />;
                })}
              </svg>
              <div className="space-y-2">
                {funnelItems.map((fi, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: fi.color }} />
                    <span className="text-[10px] text-[#5a6478]">{fi.label}</span>
                    <span className="text-[11px] font-bold text-[#1a1f36] ml-auto">{fmt(fi.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <h4 className="text-[12px] font-bold text-[#1a1f36] mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowAddModal(true)} className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[#f8f9fb] hover:bg-[#eef3fd] border border-[#eef0f4] hover:border-[#c5d8f5] transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-[#e8f0fe] text-[#1a6de1] flex items-center justify-center text-[14px] group-hover:scale-110 transition-transform">
                  <FaUserPlus />
                </div>
                <span className="text-[11px] font-semibold text-[#3d4555]">Add New Lead</span>
              </button>

              <button onClick={exportLeadsCSV} className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[#f8f9fb] hover:bg-[#eef3fd] border border-[#eef0f4] hover:border-[#c5d8f5] transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-[#e8f0fe] text-[#1a6de1] flex items-center justify-center text-[14px] group-hover:scale-110 transition-transform">
                  <FaDownload />
                </div>
                <span className="text-[11px] font-semibold text-[#3d4555]">Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 1. ADD LEAD MODAL ═══ */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>
              <h3 className="text-[16px] font-bold text-[#1a1f36] mb-4">Add New Lead</h3>
              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Full Name *</label>
                    <input required value={addForm.fullName} onChange={(e) => setAddForm(p => ({ ...p, fullName: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Phone *</label>
                    <input required value={addForm.phone} onChange={(e) => setAddForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Email</label>
                    <input value={addForm.email} onChange={(e) => setAddForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">NEET Score</label>
                    <input type="number" value={addForm.neetScore} onChange={(e) => setAddForm(p => ({ ...p, neetScore: Number(e.target.value) }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Interested In</label>
                    <select value={addForm.interestedIn} onChange={(e) => setAddForm(p => ({ ...p, interestedIn: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option>India</option><option>Abroad</option><option>Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Source</label>
                    <select value={addForm.source} onChange={(e) => setAddForm(p => ({ ...p, source: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option>Website</option><option>Google Ads</option><option>Facebook Ads</option><option>Instagram Ads</option><option>Referral</option><option>Walk In</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Notes</label>
                  <textarea value={addForm.notes} onChange={(e) => setAddForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1] resize-none" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-[12px] font-semibold text-[#5a6478] border border-[#e8ecf1] rounded-lg hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-5 py-2 text-[12px] font-semibold bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg transition-colors">Add Lead</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 2. VIEW LEAD DETAILS MODAL ═══ */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>
              
              <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold" style={{ backgroundColor: getAvatarColor(selectedLead.fullName) }}>
                  {getInitials(selectedLead.fullName)}
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0f172a]">{selectedLead.fullName}</h3>
                  <span className="text-[11px] text-[#64748b]">{selectedLead.email} • {selectedLead.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[12px] mb-4">
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">NEET Score</span>
                  <span className="text-[14px] font-bold text-[#0f172a]">{selectedLead.neetScore || 'N/A'}</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Course Preference</span>
                  <span className="text-[14px] font-bold text-[#0f172a]">{getCourse(selectedLead.interestedIn)}</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Lead Source</span>
                  <span className="text-[14px] font-bold text-[#0f172a]">{selectedLead.source || 'Website'}</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Current Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-0.5 border ${statusStyle(getDisplayStatus(selectedLead.status))}`}>
                    {getDisplayStatus(selectedLead.status)}
                  </span>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="p-3 bg-[#fffbeeb] border border-[#fef3c7] rounded-xl text-[11px] mb-4">
                  <span className="font-bold text-[#92400e] block mb-0.5">Notes:</span>
                  <p className="text-[#b45309]">{selectedLead.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
                <button
                  onClick={() => handleDeleteLead(selectedLead._id)}
                  className="px-3 py-1.5 bg-[#ffe4e6] text-[#e11d48] text-[11px] font-bold rounded-lg hover:bg-[#fecdd3] flex items-center gap-1"
                >
                  <FaTrash className="text-xs" /> Delete Lead
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="px-3 py-1.5 bg-[#eff6ff] text-[#2563eb] text-[11px] font-bold rounded-lg hover:bg-[#dbeafe] flex items-center gap-1"
                  >
                    <FaPhoneAlt className="text-xs" /> Call
                  </a>

                  <button
                    onClick={() => {
                      const l = selectedLead;
                      setSelectedLead(null);
                      setEditingLead(l);
                      setEditForm({
                        fullName: l.fullName,
                        phone: l.phone,
                        email: l.email,
                        neetScore: l.neetScore || 0,
                        interestedIn: l.interestedIn || "Abroad",
                        source: l.source || "Website",
                        status: l.status || "Pending",
                        notes: l.notes || "",
                      });
                    }}
                    className="px-4 py-1.5 bg-[#1a6de1] text-white text-[11px] font-bold rounded-lg hover:bg-[#1558c0] flex items-center gap-1"
                  >
                    <FaEdit className="text-xs" /> Edit Lead
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 3. EDIT / UPDATE LEAD MODAL ═══ */}
      <AnimatePresence>
        {editingLead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditingLead(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setEditingLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>
              <h3 className="text-[16px] font-bold text-[#1a1f36] mb-4">Edit Lead</h3>
              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Full Name *</label>
                    <input required value={editForm.fullName} onChange={(e) => setEditForm(p => ({ ...p, fullName: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Phone *</label>
                    <input required value={editForm.phone} onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Email</label>
                    <input value={editForm.email} onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">NEET Score</label>
                    <input type="number" value={editForm.neetScore} onChange={(e) => setEditForm(p => ({ ...p, neetScore: Number(e.target.value) }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Status</label>
                    <select value={editForm.status} onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option value="Pending">New / Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">Counselling Done</option>
                      <option value="Admitted">Admission</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Source</label>
                    <select value={editForm.source} onChange={(e) => setEditForm(p => ({ ...p, source: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option>Website</option><option>Google Ads</option><option>Facebook Ads</option><option>Instagram Ads</option><option>Referral</option><option>Walk In</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Notes</label>
                  <textarea value={editForm.notes} onChange={(e) => setEditForm(p => ({ ...p, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1] resize-none" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingLead(null)} className="px-4 py-2 text-[12px] font-semibold text-[#5a6478] border border-[#e8ecf1] rounded-lg hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-5 py-2 text-[12px] font-semibold bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg transition-colors">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
