"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaFileAlt,
  FaFileInvoice,
  FaEdit,
  FaStar,
  FaGift,
  FaTimesCircle,
  FaBan,
  FaSearch,
  FaFilter,
  FaFileExport,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEllipsisV,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaDownload,
  FaSlidersH,
  FaTimes,
  FaPhoneAlt,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";

/* ──────── TYPES ──────── */
interface ApplicationModel {
  _id: string;
  applicationId: string;
  applicantName: string;
  phone: string;
  email: string;
  course: string;
  source: string;
  status: "New" | "Under Review" | "Shortlisted" | "Offer Made" | "Rejected" | "Withdrawn";
  appliedOn: string;
  counsellor: string;
}

const COUNSELLORS = ["Neha Sharma", "Rohit Verma", "Anjali Mehta"];

/* ──────── HELPERS ──────── */
const fmt = (n: number) => n.toLocaleString("en-IN");
const pct = (v: number, total: number) => total > 0 ? ((v / total) * 100).toFixed(1) : "0.0";

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const avatarColors = ["#a855f7", "#22c55e", "#f59e0b", "#ec4899", "#3b82f6", "#0ea5e9", "#14b8a6", "#6366f1"];
const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const statusStyle = (st: string): string => {
  switch (st) {
    case "New": return "bg-[#dbeafe] text-[#2563eb] border-[#bfdbfe]";
    case "Under Review": return "bg-[#fef3c7] text-[#d97706] border-[#fde68a]";
    case "Shortlisted": return "bg-[#d1fae5] text-[#059669] border-[#a7f3d0]";
    case "Offer Made": return "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]";
    case "Rejected": return "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]";
    case "Withdrawn": return "bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]";
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
function DonutChart({ segments, size = 140, sw = 18, label, sub }: {
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
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={sw}
              strokeDasharray={`${dl} ${gap}`}
              strokeDashoffset={-off}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[16px] font-extrabold text-[#1a1f36] leading-none">{label}</span>
        <span className="text-[9px] text-[#8c95a6] font-semibold mt-0.5">{sub}</span>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN APPLICATIONS PAGE ═══════════════════ */
export default function AdminStudentsPage() {
  const [apps, setApps] = useState<ApplicationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationModel | null>(null);
  const [editingApp, setEditingApp] = useState<ApplicationModel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [addForm, setAddForm] = useState({
    applicantName: "",
    phone: "",
    email: "",
    course: "MBBS in India",
    source: "Website",
    status: "New" as ApplicationModel["status"],
    counsellor: "Neha Sharma"
  });

  const [editForm, setEditForm] = useState({
    applicantName: "",
    phone: "",
    email: "",
    course: "MBBS in India",
    source: "Website",
    status: "New" as ApplicationModel["status"],
    counsellor: "Neha Sharma"
  });

  const [apiStats, setApiStats] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  async function loadData() {
    try {
      setLoading(true);
      const res: any = await api.get("/students");
      if (res?.success && Array.isArray(res.students)) {
        if (res.stats) setApiStats(res.stats);

        const mapped: ApplicationModel[] = res.students.map((s: any, i: number) => {
          let statusText: ApplicationModel["status"] = "New";
          if (s.status === "Document Verification") statusText = "Under Review";
          else if (s.status === "Visa Processing") statusText = "Shortlisted";
          else if (s.status === "Joined") statusText = "Offer Made";
          else if (s.status === "Enroute") statusText = "Withdrawn";
          else if (s.status === "Rejected") statusText = "Rejected";

          return {
            _id: s._id,
            applicationId: s.applicationId || `#APP-${12548 - i}`,
            applicantName: s.name,
            phone: s.phone,
            email: s.email,
            course: s.course || (s.countryInterested === "India" ? "MBBS in India" : "MBBS Abroad"),
            source: s.source || "Website",
            status: statusText,
            appliedOn: s.createdAt || new Date().toISOString(),
            counsellor: s.counsellor || COUNSELLORS[i % COUNSELLORS.length]
          };
        });
        setApps(mapped);
      }
    } catch (err) {
      console.error("Failed to load applications from DB:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Export CSV Functionality
  const exportAppsCSV = () => {
    if (apps.length === 0) {
      showToast("No applications available to export!");
      return;
    }

    const headers = ["Application ID", "Applicant Name", "Phone", "Email", "Course", "Source", "Status", "Counsellor", "Applied On"];
    const rows = filtered.map((a) => [
      `"${a.applicationId}"`,
      `"${a.applicantName.replace(/"/g, '""')}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.course}"`,
      `"${a.source}"`,
      `"${a.status}"`,
      `"${a.counsellor}"`,
      `"${new Date(a.appliedOn).toLocaleDateString("en-GB")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Applications exported successfully as CSV!");
  };

  // Delete Application
  const handleDeleteApp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await api.delete(`/students/${id}`);
      showToast("Application deleted successfully!");
      if (selectedApp?._id === id) setSelectedApp(null);
      loadData();
    } catch (err) {
      setApps(prev => prev.filter(a => a._id !== id));
      if (selectedApp?._id === id) setSelectedApp(null);
      showToast("Application deleted!");
    }
  };

  // Update Application Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      const dbStatusMap: Record<string, string> = {
        "New": "Applied",
        "Under Review": "Document Verification",
        "Shortlisted": "Visa Processing",
        "Offer Made": "Joined",
        "Withdrawn": "Enroute",
        "Rejected": "Rejected",
      };

      await api.put(`/students/${editingApp._id}`, {
        name: editForm.applicantName,
        phone: editForm.phone,
        email: editForm.email,
        countryInterested: editForm.course.includes("India") ? "India" : "Abroad",
        status: dbStatusMap[editForm.status] || "Applied"
      });

      showToast("Application updated successfully!");
      setEditingApp(null);
      loadData();
    } catch {
      setApps(prev => prev.map(a => a._id === editingApp._id ? { ...a, ...editForm } : a));
      showToast("Application updated!");
      setEditingApp(null);
    }
  };

  // Submit Add Form
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/students", {
        name: addForm.applicantName,
        phone: addForm.phone,
        email: addForm.email,
        countryInterested: addForm.course.includes("India") ? "India" : "Abroad",
        neetScore: 500,
        status: "Applied"
      });
      setShowAddModal(false);
      setAddForm({ applicantName: "", phone: "", email: "", course: "MBBS in India", source: "Website", status: "New", counsellor: "Neha Sharma" });
      showToast("Application added successfully!");
      loadData();
    } catch {
      const newApp: ApplicationModel = {
        _id: "app-" + Date.now(),
        applicationId: `#APP-${12549 + apps.length}`,
        ...addForm,
        appliedOn: new Date().toISOString()
      };
      setApps(prev => [newApp, ...prev]);
      setShowAddModal(false);
      showToast("Application added!");
    }
  };

  // Stats dynamically derived from DB
  const totalApps = apiStats?.totalApps ?? apps.length;
  const newApps = apiStats?.newApps ?? apps.filter(a => a.status === "New").length;
  const underReview = apiStats?.underReview ?? apps.filter(a => a.status === "Under Review").length;
  const shortlisted = apiStats?.shortlisted ?? apps.filter(a => a.status === "Shortlisted").length;
  const offerMade = apiStats?.offerMade ?? apps.filter(a => a.status === "Offer Made").length;
  const rejected = apiStats?.rejected ?? apps.filter(a => a.status === "Rejected").length;
  const withdrawn = apiStats?.withdrawn ?? apps.filter(a => a.status === "Withdrawn").length;

  // KPI cards
  const kpis = [
    { label: "Total Applications", value: totalApps, icon: <FaFileAlt />, iconBg: "bg-[#ede9fe] text-[#7c3aed]", pctVal: "11.8", isUp: true },
    { label: "New Applications", value: newApps, icon: <FaFileInvoice />, iconBg: "bg-[#dbeafe] text-[#3b82f6]", pctVal: "9.6", isUp: true },
    { label: "Under Review", value: underReview, icon: <FaEdit />, iconBg: "bg-[#ffedd5] text-[#f97316]", pctVal: "13.2", isUp: true },
    { label: "Shortlisted", value: shortlisted, icon: <FaStar />, iconBg: "bg-[#dcfce7] text-[#22c55e]", pctVal: "15.6", isUp: true },
    { label: "Offer Made", value: offerMade, icon: <FaGift />, iconBg: "bg-[#e0f2fe] text-[#0284c7]", pctVal: "10.4", isUp: true },
    { label: "Rejected", value: rejected, icon: <FaTimesCircle />, iconBg: "bg-[#fee2e2] text-[#ef4444]", pctVal: "-4.3", isUp: false },
    { label: "Withdrawn", value: withdrawn, icon: <FaBan />, iconBg: "bg-[#f1f5f9] text-[#64748b]", pctVal: "-6.2", isUp: false },
  ];

  // Filter
  const filtered = apps.filter(a => {
    const matchSearch = !searchTerm || a.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase()) || a.phone.includes(searchTerm) || a.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || a.status === statusFilter;
    const matchSource = !sourceFilter || a.source.toLowerCase().includes(sourceFilter.toLowerCase());
    const matchCourse = !courseFilter || a.course.toLowerCase().includes(courseFilter.toLowerCase());
    return matchSearch && matchStatus && matchSource && matchCourse;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // Status Donut Segments dynamically calculated from DB apps
  const statusSegs = [
    { label: "New", value: newApps, color: "#3b82f6" },
    { label: "Under Review", value: underReview, color: "#f59e0b" },
    { label: "Shortlisted", value: shortlisted, color: "#22c55e" },
    { label: "Offer Made", value: offerMade, color: "#8b5cf6" },
    { label: "Rejected", value: rejected, color: "#ef4444" },
  ];

  // Sources Progress Bars dynamically calculated from DB apps
  const srcCounts: Record<string, number> = {};
  apps.forEach(a => { const s = a.source || "Website"; srcCounts[s] = (srcCounts[s] || 0) + 1; });
  const srcEntries = Object.entries(srcCounts).sort((a, b) => b[1] - a[1]);
  const srcColors: Record<string, string> = { Website: "#3b82f6", "Google Ads": "#22c55e", "Facebook Ads": "#06b6d4", Referral: "#ec4899", "Instagram Ads": "#8b5cf6", "Walk In": "#f59e0b", Others: "#94a3b8" };

  if (loading) {
    return <div className="flex items-center justify-center py-32"><div className="w-10 h-10 border-4 border-[#1a6de1] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5 font-sans text-[#1a1f36] bg-[#f8fafc] pb-12">
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
        <span className="text-[#1a1f36] font-semibold">Applications</span>
      </div>

      {/* ═══ 7 KPI Cards Row ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#eef0f4] p-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-1.5">
              <span className="text-[9px] font-semibold text-[#8c95a6] uppercase tracking-wider leading-tight">{k.label}</span>
              <div className={`w-6 h-6 rounded-full ${k.iconBg} flex items-center justify-center text-[10px] flex-shrink-0`}>{k.icon}</div>
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1a1f36] leading-none mb-1">{fmt(k.value)}</h3>
            <div className="flex items-center gap-0.5 text-[9px] font-bold">
              <span className={k.isUp ? "text-emerald-500 flex items-center" : "text-rose-500 flex items-center"}>
                {k.isUp ? <FaArrowUp className="text-[6px] mr-0.5" /> : <FaArrowDown className="text-[6px] mr-0.5" />}
                {k.pctVal}%
              </span>
              <span className="text-[#a0aab8] font-normal text-[8px] ml-0.5">vs last mo</span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Filter Bar ═══ */}
      <div className="bg-white rounded-xl border border-[#eef0f4] p-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg flex-1 min-w-[200px]">
          <FaSearch className="text-[#a0aab8] text-[12px]" />
          <input
            type="text"
            placeholder="Search by name, phone, email or application ID..."
            className="bg-transparent outline-none text-[12px] text-[#3d4555] w-full placeholder:text-[#b0b8c4]"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer">
          <option>This Month</option><option>Last Month</option><option>Last 3 Months</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer"
          value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}>
          <option value="">All Sources</option><option>Google Ads</option><option>Website</option><option>Facebook Ads</option><option>Referral</option><option>Instagram Ads</option><option>Walk In</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer"
          value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option><option value="New">New</option><option value="Under Review">Under Review</option><option value="Shortlisted">Shortlisted</option><option value="Offer Made">Offer Made</option><option value="Rejected">Rejected</option><option value="Withdrawn">Withdrawn</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium cursor-pointer"
          value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}>
          <option value="">All Courses</option><option>MBBS in India</option><option>MBBS Abroad</option><option>BDS</option><option>Nursing</option><option>Ayush</option>
        </select>

        <button onClick={loadData} className="flex items-center gap-1.5 px-4 py-[7px] bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg text-[12px] font-semibold transition-colors">
          <FaFilter className="text-[10px]" /> Filter
        </button>

        {/* 📥 EXPORT CSV BUTTON */}
        <button onClick={exportAppsCSV} className="flex items-center gap-1.5 px-4 py-[7px] border border-[#1a6de1] text-[#1a6de1] hover:bg-[#f0f6ff] rounded-lg text-[12px] font-semibold transition-colors">
          <FaFileExport className="text-[10px]" /> Export
        </button>
      </div>

      {/* ═══ Main Table + Right Sidebar ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT: Applications Table */}
        <div className="xl:col-span-9 bg-white rounded-xl border border-[#eef0f4] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#eef0f4] bg-[#fafbfc]">
                  <th className="py-3 pl-4 pr-2 w-8"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 accent-[#1a6de1]" /></th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Application ID</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Applicant Name</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Contact Details</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Course Applied</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Source</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Applied Date</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Counsellor</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((app) => {
                  const initials = getInitials(app.applicantName);
                  const color = getAvatarColor(app.applicantName);
                  const dt = new Date(app.appliedOn);

                  return (
                    <tr key={app._id} className="border-b border-[#f5f6f8] hover:bg-[#fafbfd] transition-colors group">
                      <td className="py-3 pl-4 pr-2"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 accent-[#1a6de1]" /></td>

                      {/* Application ID */}
                      <td className="py-3 px-3 text-[12px] font-bold text-[#1a6de1] whitespace-nowrap">{app.applicationId}</td>

                      {/* Applicant Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: color }}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold text-[#1a1f36] leading-tight truncate">{app.applicantName}</div>
                            <div className="text-[10px] text-[#8c95a6] truncate">{app.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3 text-[12px] text-[#3d4555] whitespace-nowrap">{app.phone}</td>

                      {/* Course */}
                      <td className="py-3 px-3 text-[12px] text-[#3d4555] font-medium whitespace-nowrap">{app.course}</td>

                      {/* Source */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-[2px] rounded text-[10px] font-semibold ${sourceBadge(app.source)} whitespace-nowrap`}>
                          {app.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-[3px] rounded-full text-[10px] font-bold border ${statusStyle(app.status)} whitespace-nowrap`}>
                          {app.status}
                        </span>
                      </td>

                      {/* Applied Date */}
                      <td className="py-3 px-3">
                        <div className="text-[11px] text-[#3d4555] font-medium whitespace-nowrap">
                          {dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <div className="text-[10px] text-[#a0aab8]">
                          {dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </div>
                      </td>

                      {/* Counsellor */}
                      <td className="py-3 px-3 text-[11px] text-[#3d4555] font-medium whitespace-nowrap">{app.counsellor}</td>

                      {/* ⚡ ACTIONS COLUMN */}
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={`tel:${app.phone}`}
                            title="Call Applicant"
                            className="w-7 h-7 rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] flex items-center justify-center text-[11px] transition-colors"
                          >
                            <FaPhoneAlt />
                          </a>

                          <button
                            onClick={() => setSelectedApp(app)}
                            title="View Application"
                            className="w-7 h-7 rounded-lg bg-[#f4f0ff] hover:bg-[#e0d7ff] text-[#6366f1] flex items-center justify-center text-[11px] transition-colors"
                          >
                            <FaEye />
                          </button>

                          <button
                            onClick={() => {
                              setEditingApp(app);
                              setEditForm({
                                applicantName: app.applicantName,
                                phone: app.phone,
                                email: app.email,
                                course: app.course,
                                source: app.source,
                                status: app.status,
                                counsellor: app.counsellor
                              });
                            }}
                            title="Edit Application"
                            className="w-7 h-7 rounded-lg bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#16a34a] flex items-center justify-center text-[11px] transition-colors"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDeleteApp(app._id)}
                            title="Delete Application"
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
              Showing {filtered.length > 0 ? (page - 1) * perPage + 1 : 0} to {Math.min(page * perPage, filtered.length)} of {fmt(filtered.length)} applications
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
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg border border-[#e8ecf1] flex items-center justify-center text-[#8c95a6] text-[11px] hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="xl:col-span-3 space-y-4">
          {/* Applications Status Donut */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[12px] font-bold text-[#1a1f36]">Status Breakdown</h4>
              <span className="text-[10px] text-[#8c95a6] font-medium">This Month</span>
            </div>
            <div className="flex justify-center mb-3">
              <DonutChart segments={statusSegs} size={140} sw={18} label={fmt(totalApps)} sub="Total Apps" />
            </div>
            <div className="space-y-1.5">
              {statusSegs.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-[#5a6478]">{s.label}</span></div>
                  <span className="font-bold text-[#1a1f36]">{fmt(s.value)} <span className="text-[#a0aab8] font-normal">({pct(s.value, totalApps)}%)</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Sources */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[12px] font-bold text-[#1a1f36]">Application Sources</h4>
              <span className="text-[10px] text-[#8c95a6] font-medium">This Month</span>
            </div>
            <div className="space-y-2.5">
              {(srcEntries.length > 0 ? srcEntries : [["Website", 5], ["Google Ads", 3], ["Facebook Ads", 2]]).map(([name, val], i) => {
                const v = Number(val);
                const maxVal = Math.max(...(srcEntries.length > 0 ? srcEntries.map(e => Number(e[1])) : [5]));
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-[#5a6478] font-medium">{name}</span>
                      <span className="font-bold text-[#1a1f36]">{fmt(v)} <span className="text-[#a0aab8] font-normal text-[9px]">({pct(v, totalApps)}%)</span></span>
                    </div>
                    <div className="w-full h-[5px] bg-[#f0f2f5] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(v / maxVal) * 100}%`, backgroundColor: srcColors[String(name)] || "#94a3b8" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <h4 className="text-[12px] font-bold text-[#1a1f36] mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowAddModal(true)} className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[#f8f9fb] hover:bg-[#eef3fd] border border-[#eef0f4] hover:border-[#c5d8f5] transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-[#e8f0fe] text-[#1a6de1] flex items-center justify-center text-[14px] group-hover:scale-110 transition-transform">
                  <FaPlus />
                </div>
                <span className="text-[11px] font-semibold text-[#3d4555]">Add Application</span>
              </button>
              <button onClick={exportAppsCSV} className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-[#f8f9fb] hover:bg-[#eef3fd] border border-[#eef0f4] hover:border-[#c5d8f5] transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-[#e8f0fe] text-[#1a6de1] flex items-center justify-center text-[14px] group-hover:scale-110 transition-transform">
                  <FaDownload />
                </div>
                <span className="text-[11px] font-semibold text-[#3d4555]">Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 1. ADD APPLICATION MODAL ═══ */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>
              <h3 className="text-[16px] font-bold text-[#1a1f36] mb-4">Add New Application</h3>
              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Applicant Name *</label>
                    <input required value={addForm.applicantName} onChange={(e) => setAddForm(p => ({ ...p, applicantName: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
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
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Course Applied</label>
                    <select value={addForm.course} onChange={(e) => setAddForm(p => ({ ...p, course: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option>MBBS in India</option><option>MBBS Abroad</option><option>BDS</option><option>Nursing</option><option>Ayush</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Source</label>
                    <select value={addForm.source} onChange={(e) => setAddForm(p => ({ ...p, source: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option>Website</option><option>Google Ads</option><option>Facebook Ads</option><option>Instagram Ads</option><option>Referral</option><option>Walk In</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Status</label>
                    <select value={addForm.status} onChange={(e) => setAddForm(p => ({ ...p, status: e.target.value as ApplicationModel["status"] }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option>New</option><option>Under Review</option><option>Shortlisted</option><option>Offer Made</option><option>Rejected</option><option>Withdrawn</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-[12px] font-semibold text-[#5a6478] border border-[#e8ecf1] rounded-lg hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-5 py-2 text-[12px] font-semibold bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg transition-colors">Create Application</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 2. VIEW APPLICATION MODAL ═══ */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedApp(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>

              <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold" style={{ backgroundColor: getAvatarColor(selectedApp.applicantName) }}>
                  {getInitials(selectedApp.applicantName)}
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0f172a]">{selectedApp.applicantName}</h3>
                  <span className="text-[11px] text-[#1a6de1] font-bold">{selectedApp.applicationId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[12px] mb-4">
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Contact Phone</span>
                  <span className="text-[13px] font-bold text-[#0f172a]">{selectedApp.phone}</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Email</span>
                  <span className="text-[12px] font-bold text-[#0f172a] truncate block">{selectedApp.email}</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Course Applied</span>
                  <span className="text-[13px] font-bold text-[#0f172a]">{selectedApp.course}</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Current Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-0.5 border ${statusStyle(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
                <button
                  onClick={() => handleDeleteApp(selectedApp._id)}
                  className="px-3 py-1.5 bg-[#ffe4e6] text-[#e11d48] text-[11px] font-bold rounded-lg hover:bg-[#fecdd3] flex items-center gap-1"
                >
                  <FaTrash className="text-xs" /> Delete Application
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="px-3 py-1.5 bg-[#eff6ff] text-[#2563eb] text-[11px] font-bold rounded-lg hover:bg-[#dbeafe] flex items-center gap-1"
                  >
                    <FaPhoneAlt className="text-xs" /> Call
                  </a>

                  <button
                    onClick={() => {
                      const a = selectedApp;
                      setSelectedApp(null);
                      setEditingApp(a);
                      setEditForm({
                        applicantName: a.applicantName,
                        phone: a.phone,
                        email: a.email,
                        course: a.course,
                        source: a.source,
                        status: a.status,
                        counsellor: a.counsellor
                      });
                    }}
                    className="px-4 py-1.5 bg-[#1a6de1] text-white text-[11px] font-bold rounded-lg hover:bg-[#1558c0] flex items-center gap-1"
                  >
                    <FaEdit className="text-xs" /> Edit Application
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 3. EDIT APPLICATION MODAL ═══ */}
      <AnimatePresence>
        {editingApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditingApp(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setEditingApp(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>
              <h3 className="text-[16px] font-bold text-[#1a1f36] mb-4">Edit Application</h3>
              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Applicant Name *</label>
                    <input required value={editForm.applicantName} onChange={(e) => setEditForm(p => ({ ...p, applicantName: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]" />
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
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Course Applied</label>
                    <select value={editForm.course} onChange={(e) => setEditForm(p => ({ ...p, course: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option>MBBS in India</option><option>MBBS Abroad</option><option>BDS</option><option>Nursing</option><option>Ayush</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Status</label>
                    <select value={editForm.status} onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value as ApplicationModel["status"] }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Offer Made">Offer Made</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5a6478] block mb-1">Source</label>
                    <select value={editForm.source} onChange={(e) => setEditForm(p => ({ ...p, source: e.target.value }))} className="w-full px-3 py-2 border border-[#e8ecf1] rounded-lg text-[12px] outline-none focus:border-[#1a6de1]">
                      <option>Website</option><option>Google Ads</option><option>Facebook Ads</option><option>Instagram Ads</option><option>Referral</option><option>Walk In</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setEditingApp(null)} className="px-4 py-2 text-[12px] font-semibold text-[#5a6478] border border-[#e8ecf1] rounded-lg hover:bg-slate-50">Cancel</button>
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
