"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaChartLine,
  FaHistory,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaPhoneAlt,
  FaEye,
  FaComments,
  FaEllipsisV,
  FaVideo,
  FaWhatsapp,
  FaBuilding,
  FaFileAlt,
  FaStickyNote,
  FaUserPlus,
  FaTimes,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaChevronLeft,
  FaChevronRight,
  FaRegFilePdf,
  FaFileExport,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import api from "@/services/api";

/* ──────── TYPES ──────── */
interface CounsellingSession {
  _id: string;
  id: string;
  studentName: string;
  phone: string;
  email: string;
  avatarInitials: string;
  avatarBg: string;
  course: string;
  country: string;
  countryFlag: string;
  counsellor: string;
  counsellorAvatar: string;
  dateTime: string;
  mode: string;
  modeBg: string;
  status: "Completed" | "Upcoming" | "Pending" | "Cancelled";
  statusBg: string;
  nextFollowUp: string;
  subject?: string;
  message?: string;
  replyMessage?: string;
}

const COUNSELLORS_LIST = [
  { name: "Neha Sharma", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
  { name: "Rohit Verma", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
  { name: "Anjali Mehta", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
];

/* ──────── HELPERS ──────── */
const fmt = (n: number) => n.toLocaleString("en-IN");
const pct = (v: number, total: number) => total > 0 ? ((v / total) * 100).toFixed(1) : "0.0";

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const avatarColors = ["#9333ea", "#10b981", "#f59e0b", "#e11d48", "#0284c7", "#0d9488", "#2563eb", "#6366f1"];
const getAvatarBg = (name: string) => {
  const col = avatarColors[name.charCodeAt(0) % avatarColors.length];
  return `bg-[${col}]/10 text-[${col}]`;
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Completed": case "Replied": return "bg-[#e6f9f0] text-[#10b981] border-[#a7f3d0]";
    case "Upcoming": case "Read": return "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]";
    case "Pending": case "Unread": return "bg-[#fff6e5] text-[#d97706] border-[#fde68a]";
    case "Cancelled": return "bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const getModeStyle = (mode: string) => {
  switch (mode) {
    case "Zoom": case "Video": return "bg-[#e0f2fe] text-[#0284c7]";
    case "Call": case "Phone": return "bg-[#e0f2fe] text-[#0284c7]";
    case "Office": return "bg-[#f3e8ff] text-[#9333ea]";
    case "WhatsApp": return "bg-[#dcfce7] text-[#16a34a]";
    default: return "bg-slate-100 text-slate-600";
  }
};

/* ──────── Donut Chart Helper Component ──────── */
function DonutChart({ segments, size = 140, sw = 18, label, sub }: {
  segments: { value: number; color: string }[];
  size?: number; sw?: number; label: string; sub: string;
}) {
  const r = (size - sw) / 2, cx = size / 2, cy = size / 2, C = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let acc = 0;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
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
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[16px] font-black text-[#0f172a] leading-none">{label}</span>
        <span className="text-[9px] text-[#64748b] font-bold mt-1">{sub}</span>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN COUNSELLING PAGE ═══════════════════ */
export default function AdminCounsellingManagementPage() {
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCounsellor, setSelectedCounsellor] = useState("All Counsellors");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Modals & Toast State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CounsellingSession | null>(null);
  const [editingSession, setEditingSession] = useState<CounsellingSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    studentName: "",
    phone: "",
    email: "",
    course: "MBBS",
    country: "India",
    counsellor: "Neha Sharma",
    dateTime: "01 Jun 2025 10:30 AM",
    mode: "Zoom",
    status: "Upcoming" as CounsellingSession["status"],
  });

  const [noteForm, setNoteForm] = useState({
    replyMessage: "",
  });

  const [apiStats, setApiStats] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  async function loadData() {
    try {
      setLoading(true);
      const res: any = await api.get("/contacts");
      if (res?.success && Array.isArray(res.contacts)) {
        if (res.stats) setApiStats(res.stats);

        const modes = ["Zoom", "Call", "Office", "WhatsApp"];
        const courses = ["MBBS", "BDS", "Nursing", "BAMS"];

        const mapped: CounsellingSession[] = res.contacts.map((c: any, i: number) => {
          let statusText: CounsellingSession["status"] = "Pending";
          if (c.status === "Replied") statusText = "Completed";
          else if (c.status === "Read") statusText = "Upcoming";
          else if (c.status === "Unread") statusText = "Pending";

          const mode = modes[i % modes.length];
          const course = courses[i % courses.length];
          const counsellorObj = COUNSELLORS_LIST[i % COUNSELLORS_LIST.length];

          return {
            _id: c._id,
            id: `L-${12458 - i}`,
            studentName: c.name,
            phone: c.phone,
            email: c.email,
            avatarInitials: getInitials(c.name),
            avatarBg: getAvatarBg(c.name),
            course,
            country: i % 2 === 0 ? "India" : "Abroad",
            countryFlag: i % 2 === 0 ? "🇮🇳" : "🌐",
            counsellor: counsellorObj.name,
            counsellorAvatar: counsellorObj.avatar,
            dateTime: new Date(c.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " 10:30 AM",
            mode,
            modeBg: getModeStyle(mode),
            status: statusText,
            statusBg: getStatusStyle(statusText),
            nextFollowUp: statusText === "Upcoming" ? "02 Jun 2025" : "—",
            subject: c.subject,
            message: c.message,
            replyMessage: c.replyMessage,
          };
        });

        setSessions(mapped);
      }
    } catch (err) {
      console.error("Failed to load counselling requests from DB:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Export CSV Functionality
  const exportCSV = () => {
    if (sessions.length === 0) {
      showToast("No counselling sessions available to export!");
      return;
    }

    const headers = ["Session ID", "Student Name", "Phone", "Email", "Course", "Country", "Counsellor", "Date & Time", "Mode", "Status", "Subject", "Message"];
    const rows = filteredSessions.map((s) => [
      `"${s.id}"`,
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      `"${s.course}"`,
      `"${s.country}"`,
      `"${s.counsellor}"`,
      `"${s.dateTime}"`,
      `"${s.mode}"`,
      `"${s.status}"`,
      `"${(s.subject || '').replace(/"/g, '""')}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `counselling_sessions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Counselling sessions exported successfully as CSV!");
  };

  // Delete Session
  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this counselling inquiry?")) return;

    try {
      await api.delete(`/contacts/${id}`);
      showToast("Counselling session deleted!");
      if (selectedSession?._id === id) setSelectedSession(null);
      loadData();
    } catch {
      setSessions((prev) => prev.filter((s) => s._id !== id));
      if (selectedSession?._id === id) setSelectedSession(null);
      showToast("Counselling session deleted!");
    }
  };

  // Schedule Submit
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/contacts", {
        name: scheduleForm.studentName,
        phone: scheduleForm.phone,
        email: scheduleForm.email,
        subject: `Counselling Session for ${scheduleForm.course}`,
        message: `Mode: ${scheduleForm.mode}, Date: ${scheduleForm.dateTime}`,
        status: "Unread",
      });
      setIsScheduleOpen(false);
      showToast("Counselling session scheduled successfully!");
      loadData();
    } catch {
      const mock: CounsellingSession = {
        _id: "cs-" + Date.now(),
        id: `L-${12459 + sessions.length}`,
        ...scheduleForm,
        avatarInitials: getInitials(scheduleForm.studentName),
        avatarBg: getAvatarBg(scheduleForm.studentName),
        countryFlag: scheduleForm.country === "India" ? "🇮🇳" : "🌐",
        counsellorAvatar: COUNSELLORS_LIST[0].avatar,
        modeBg: getModeStyle(scheduleForm.mode),
        statusBg: getStatusStyle(scheduleForm.status),
        nextFollowUp: "02 Jun 2025",
      };
      setSessions((prev) => [mock, ...prev]);
      setIsScheduleOpen(false);
      showToast("Counselling session scheduled!");
    }
  };

  // Add Note / Reply Submit
  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    try {
      await api.put(`/contacts/${selectedSession._id}`, {
        replyMessage: noteForm.replyMessage,
        status: "Replied",
      });
      showToast("Note added & response saved successfully!");
      setIsAddNoteOpen(false);
      setSelectedSession(null);
      setNoteForm({ replyMessage: "" });
      loadData();
    } catch {
      setSessions((prev) =>
        prev.map((s) =>
          s._id === selectedSession._id
            ? { ...s, status: "Completed", statusBg: getStatusStyle("Completed"), replyMessage: noteForm.replyMessage }
            : s
        )
      );
      showToast("Note added!");
      setIsAddNoteOpen(false);
      setSelectedSession(null);
      setNoteForm({ replyMessage: "" });
    }
  };

  // Derived Stats
  const totalSessionsCount = apiStats?.totalSessions ?? sessions.length;
  const pendingSessionsCount = apiStats?.pendingSessions ?? sessions.filter((s) => s.status === "Pending" || s.status === "Upcoming").length;
  const completedSessionsCount = apiStats?.completedSessions ?? sessions.filter((s) => s.status === "Completed").length;

  // Stat Cards Config
  const statCards = [
    {
      id: "sessions",
      title: "Total Sessions",
      value: fmt(totalSessionsCount),
      change: "12.5%",
      isPositive: true,
      subtext: "vs Apr 01 - Apr 30",
      icon: <FaUsers className="text-[#9333ea] text-[14px]" />,
      iconBg: "bg-[#f3e8ff]",
    },
    {
      id: "today",
      title: "Today's Appointments",
      value: "42",
      change: "8.7%",
      isPositive: true,
      subtext: "vs Yesterday",
      icon: <FaCalendarAlt className="text-[#0284c7] text-[14px]" />,
      iconBg: "bg-[#e0f2fe]",
    },
    {
      id: "pending",
      title: "Pending Sessions",
      value: fmt(pendingSessionsCount),
      change: "3.4%",
      isPositive: false,
      subtext: "vs Apr 01 - Apr 30",
      icon: <FaClock className="text-[#f59e0b] text-[14px]" />,
      iconBg: "bg-[#fff6e5]",
    },
    {
      id: "completed",
      title: "Completed Sessions",
      value: fmt(completedSessionsCount),
      change: "15.3%",
      isPositive: true,
      subtext: "vs Apr 01 - Apr 30",
      icon: <FaCheckCircle className="text-[#10b981] text-[14px]" />,
      iconBg: "bg-[#e6f9f0]",
    },
    {
      id: "conversion",
      title: "Conversion Rate",
      value: "32.6%",
      change: "6.2%",
      isPositive: true,
      subtext: "vs Apr 01 - Apr 30",
      icon: <FaChartLine className="text-[#0d9488] text-[14px]" />,
      iconBg: "bg-[#e6fffa]",
    },
    {
      id: "avg_time",
      title: "Avg. Response Time",
      value: "18m 24s",
      change: "5.6%",
      isPositive: false,
      subtext: "vs Apr 01 - Apr 30",
      icon: <FaHistory className="text-[#e11d48] text-[14px]" />,
      iconBg: "bg-[#ffe4e6]",
    },
  ];

  // Filter Sessions List
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCounsellor =
      selectedCounsellor === "All Counsellors" || s.counsellor === selectedCounsellor;

    const matchesStatus =
      selectedStatus === "All Status" || s.status === selectedStatus;

    const matchesCourse =
      selectedCourse === "All Courses" || s.course === selectedCourse;

    return matchesSearch && matchesCounsellor && matchesStatus && matchesCourse;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / perPage));
  const pagedSessions = filteredSessions.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Overview Donut Segments
  const modeCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    const m = s.mode || "Call";
    modeCounts[m] = (modeCounts[m] || 0) + 1;
  });
  const modeSegs = [
    { label: "Zoom / Video", value: modeCounts["Zoom"] || 3, color: "#0284c7" },
    { label: "Phone Call", value: modeCounts["Call"] || 3, color: "#3b82f6" },
    { label: "Office Visit", value: modeCounts["Office"] || 1, color: "#9333ea" },
    { label: "WhatsApp Chat", value: modeCounts["WhatsApp"] || 1, color: "#16a34a" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-[#1a6de1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12 font-sans text-[#1a1f36] bg-[#f8fafc]">
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

      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-xs">
        <div className="text-[12px] text-[#8c95a6] font-medium">
          <Link href="/admin" className="hover:text-[#1a6de1]">Dashboard</Link>
          <span className="mx-1.5">&gt;</span>
          <span className="text-[#1a1f36] font-semibold">Counselling Management</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] rounded-lg text-[12px] font-bold shadow-2xs transition-colors"
          >
            <FaFileExport className="text-xs text-[#6366f1]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg text-[12px] font-bold shadow-sm transition-all active:scale-95"
          >
            <FaPlus className="text-xs" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP 6 STAT CARDS GRID                                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card) => (
          <div key={card.id} className="bg-white rounded-xl border border-[#e2e8f0] p-3.5 space-y-2 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#64748b]">{card.title}</span>
              <div className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-extrabold text-[#0f172a] leading-none">{card.value}</h3>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${card.isPositive ? "text-[#10b981]" : "text-[#e11d48]"}`}>
                {card.isPositive ? <FaArrowUp className="text-[6px]" /> : <FaArrowDown className="text-[6px]" />}
                {card.change}
              </span>
            </div>
            <span className="text-[9px] text-[#94a3b8] block">{card.subtext}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN LAYOUT: LEFT TABLE (75%) & RIGHT SIDEBAR (25%)          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── LEFT PANEL (Span 9): Filters & Sessions Table ── */}
        <div className="lg:col-span-9 space-y-3">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl p-3 border border-[#e2e8f0] shadow-xs flex flex-wrap items-center justify-between gap-2 text-[12px]">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search student, phone, or ID..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg py-1.5 pl-8 pr-3 text-[11px] font-medium focus:outline-none focus:border-[#1a6de1]"
              />
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[10px]" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCounsellor}
                onChange={(e) => { setSelectedCounsellor(e.target.value); setCurrentPage(1); }}
                className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#334155] cursor-pointer"
              >
                <option>All Counsellors</option>
                <option>Neha Sharma</option>
                <option>Rohit Verma</option>
                <option>Anjali Mehta</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#334155] cursor-pointer"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Upcoming</option>
                <option>Pending</option>
              </select>

              <select
                value={selectedCourse}
                onChange={(e) => { setSelectedCourse(e.target.value); setCurrentPage(1); }}
                className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#334155] cursor-pointer"
              >
                <option>All Courses</option>
                <option>MBBS</option>
                <option>BDS</option>
                <option>Nursing</option>
                <option>BAMS</option>
              </select>

              <button
                onClick={loadData}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] text-[#334155] rounded-lg font-bold text-[11px] transition-colors"
              >
                <FaFilter className="text-[10px]" /> Filter
              </button>
            </div>
          </div>

          {/* Sessions Data Table */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                    <th className="py-3 px-3 text-center w-8"><input type="checkbox" className="rounded text-[#1a6de1]" /></th>
                    <th className="py-3 px-3">Lead ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Course / Pref</th>
                    <th className="py-3 px-3">Counsellor</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Mode</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[11px]">
                  {pagedSessions.map((session) => (
                    <tr key={session._id} className="hover:bg-[#f8fafc] transition-colors group">
                      <td className="py-3 px-3 text-center"><input type="checkbox" className="rounded text-[#1a6de1]" /></td>

                      {/* Lead ID */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#1a6de1] hover:underline cursor-pointer">
                          {session.id}
                        </span>
                      </td>

                      {/* Student Name & Phone */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${session.avatarBg}`}>
                            {session.avatarInitials}
                          </div>
                          <div>
                            <span className="font-bold text-[#0f172a] block">{session.studentName}</span>
                            <span className="text-[9px] text-[#64748b]">{session.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Course / Country */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#334155] block">{session.course}</span>
                        <span className="text-[9px] text-[#64748b]">{session.countryFlag} {session.country}</span>
                      </td>

                      {/* Counsellor */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img src={session.counsellorAvatar} alt={session.counsellor} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                          <span className="font-semibold text-[#334155]">{session.counsellor}</span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-3 font-medium text-[#334155] whitespace-nowrap">{session.dateTime}</td>

                      {/* Mode */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${session.modeBg}`}>
                          {session.mode}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${session.statusBg}`}>
                          {session.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={`tel:${session.phone}`}
                            title="Call Student"
                            className="w-6 h-6 rounded-md bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] flex items-center justify-center text-[10px] transition-colors"
                          >
                            <FaPhoneAlt />
                          </a>

                          <button
                            onClick={() => setSelectedSession(session)}
                            title="View Session Details"
                            className="w-6 h-6 rounded-md bg-[#f4f0ff] hover:bg-[#e0d7ff] text-[#6366f1] flex items-center justify-center text-[10px] transition-colors"
                          >
                            <FaEye />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setIsAddNoteOpen(true);
                            }}
                            title="Add Note / Reply"
                            className="w-6 h-6 rounded-md bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#16a34a] flex items-center justify-center text-[10px] transition-colors"
                          >
                            <FaStickyNote />
                          </button>

                          <button
                            onClick={() => handleDeleteSession(session._id)}
                            title="Delete Session"
                            className="w-6 h-6 rounded-md bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48] flex items-center justify-center text-[10px] transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-3 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-[#64748b] font-medium">
                Showing {filteredSessions.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to {Math.min(currentPage * perPage, filteredSessions.length)} of {fmt(totalSessionsCount)} entries
              </span>
              <div className="flex items-center gap-1 font-bold">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-lg border border-[#cbd5e1] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-40"
                >
                  <FaChevronLeft className="text-[9px]" />
                </button>

                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg text-[11px] transition-all ${
                      currentPage === p
                        ? "bg-[#1a6de1] text-white shadow-xs"
                        : "border border-[#cbd5e1] text-[#334155] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-lg border border-[#cbd5e1] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-40"
                >
                  <FaChevronRight className="text-[9px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (Span 3): Donut + Counsellors + Quick Actions ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Card 1: Mode Distribution */}
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-[#0f172a]">Mode Breakdown</h3>
              <span className="text-[9px] text-[#64748b]">This Month</span>
            </div>

            <div className="flex items-center justify-center py-1">
              <DonutChart segments={modeSegs} size={130} sw={16} label={fmt(totalSessionsCount)} sub="Sessions" />
            </div>

            <div className="space-y-1.5 text-[11px]">
              {modeSegs.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[#334155] font-semibold">{s.label}</span>
                  </div>
                  <span className="font-bold text-[#0f172a]">{s.value} ({pct(s.value, totalSessionsCount)}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Counsellor Performance */}
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs space-y-3">
            <h3 className="text-[13px] font-bold text-[#0f172a]">Counsellor Performance</h3>
            <div className="space-y-3 text-[11px]">
              {COUNSELLORS_LIST.map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-bold text-[#334155]">{c.name}</span>
                    </div>
                    <span className="font-extrabold text-[#0f172a]">{80 - i * 15} sessions</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1a6de1] rounded-full"
                      style={{ width: `${85 - i * 18}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs space-y-3">
            <h3 className="text-[13px] font-bold text-[#0f172a]">Quick Actions</h3>

            <div className="space-y-2">
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="w-full p-2.5 rounded-xl bg-[#f8fafc] hover:bg-[#f4f0ff] border border-[#f1f5f9] hover:border-[#e0d7ff] flex items-center gap-3 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  <FaPlus />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#0f172a] block">Schedule Session</span>
                  <span className="text-[9px] text-[#64748b]">Book a new student counseling slot</span>
                </div>
              </button>

              <button
                onClick={exportCSV}
                className="w-full p-2.5 rounded-xl bg-[#f8fafc] hover:bg-[#f4f0ff] border border-[#f1f5f9] hover:border-[#e0d7ff] flex items-center gap-3 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#e6f9f0] text-[#10b981] flex items-center justify-center text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  <FaFileExport />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#0f172a] block">Export CSV Report</span>
                  <span className="text-[9px] text-[#64748b]">Download full counseling log data</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. MODALS (SCHEDULE, VIEW, ADD NOTE)                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* Schedule Session Modal */}
      <AnimatePresence>
        {isScheduleOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setIsScheduleOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsScheduleOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>
              <h3 className="text-[16px] font-bold text-[#0f172a] mb-4">Schedule Counselling Session</h3>
              <form onSubmit={handleScheduleSubmit} className="space-y-3 text-[12px]">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#64748b] block mb-1">Student Name *</label>
                    <input required value={scheduleForm.studentName} onChange={(e) => setScheduleForm(p => ({ ...p, studentName: e.target.value }))} className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#1a6de1]" />
                  </div>
                  <div>
                    <label className="font-semibold text-[#64748b] block mb-1">Phone *</label>
                    <input required value={scheduleForm.phone} onChange={(e) => setScheduleForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#1a6de1]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#64748b] block mb-1">Email</label>
                    <input value={scheduleForm.email} onChange={(e) => setScheduleForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#1a6de1]" />
                  </div>
                  <div>
                    <label className="font-semibold text-[#64748b] block mb-1">Course</label>
                    <select value={scheduleForm.course} onChange={(e) => setScheduleForm(p => ({ ...p, course: e.target.value }))} className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#1a6de1]">
                      <option>MBBS</option><option>BDS</option><option>Nursing</option><option>BAMS</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#64748b] block mb-1">Counsellor</label>
                    <select value={scheduleForm.counsellor} onChange={(e) => setScheduleForm(p => ({ ...p, counsellor: e.target.value }))} className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#1a6de1]">
                      <option>Neha Sharma</option><option>Rohit Verma</option><option>Anjali Mehta</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#64748b] block mb-1">Session Mode</label>
                    <select value={scheduleForm.mode} onChange={(e) => setScheduleForm(p => ({ ...p, mode: e.target.value }))} className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#1a6de1]">
                      <option>Zoom</option><option>Call</option><option>Office</option><option>WhatsApp</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setIsScheduleOpen(false)} className="px-4 py-2 font-bold text-[#64748b] border border-[#cbd5e1] rounded-lg hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-5 py-2 font-bold bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg transition-colors">Schedule</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Session Details Modal */}
      <AnimatePresence>
        {selectedSession && !isAddNoteOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedSession(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedSession(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>

              <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${selectedSession.avatarBg}`}>
                  {selectedSession.avatarInitials}
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0f172a]">{selectedSession.studentName}</h3>
                  <span className="text-[11px] text-[#1a6de1] font-bold">{selectedSession.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] mb-4">
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Phone</span>
                  <span className="text-[12px] font-bold text-[#0f172a]">{selectedSession.phone}</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Counsellor</span>
                  <span className="text-[12px] font-bold text-[#0f172a]">{selectedSession.counsellor}</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Course</span>
                  <span className="text-[12px] font-bold text-[#0f172a]">{selectedSession.course} ({selectedSession.country})</span>
                </div>
                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                  <span className="text-[10px] font-semibold text-[#64748b] block">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 border ${selectedSession.statusBg}`}>
                    {selectedSession.status}
                  </span>
                </div>
              </div>

              {selectedSession.message && (
                <div className="p-3 bg-[#fffbeeb] border border-[#fef3c7] rounded-xl text-[11px] mb-4">
                  <span className="font-bold text-[#92400e] block mb-0.5">Inquiry Message:</span>
                  <p className="text-[#b45309]">{selectedSession.message}</p>
                </div>
              )}

              {selectedSession.replyMessage && (
                <div className="p-3 bg-[#e6f9f0] border border-[#a7f3d0] rounded-xl text-[11px] mb-4">
                  <span className="font-bold text-[#065f46] block mb-0.5">Counsellor Reply:</span>
                  <p className="text-[#047857]">{selectedSession.replyMessage}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
                <button onClick={() => handleDeleteSession(selectedSession._id)} className="px-3 py-1.5 bg-[#ffe4e6] text-[#e11d48] text-[11px] font-bold rounded-lg hover:bg-[#fecdd3]">Delete</button>
                <a href={`tel:${selectedSession.phone}`} className="px-4 py-1.5 bg-[#1a6de1] text-white text-[11px] font-bold rounded-lg hover:bg-[#1558c0]">Call Student</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Note / Reply Modal */}
      <AnimatePresence>
        {isAddNoteOpen && selectedSession && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setIsAddNoteOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsAddNoteOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><FaTimes /></button>
              <h3 className="text-[16px] font-bold text-[#0f172a] mb-2">Add Note / Send Reply</h3>
              <p className="text-[11px] text-[#64748b] mb-4">Replying to {selectedSession.studentName} ({selectedSession.phone})</p>

              <form onSubmit={handleAddNoteSubmit} className="space-y-3 text-[12px]">
                <div>
                  <label className="font-semibold text-[#64748b] block mb-1">Counsellor Remarks / Response Email *</label>
                  <textarea required value={noteForm.replyMessage} onChange={(e) => setNoteForm({ replyMessage: e.target.value })} rows={4} placeholder="Type counseling notes or reply email..." className="w-full px-3 py-2 border border-[#cbd5e1] rounded-lg outline-none focus:border-[#1a6de1] resize-none" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddNoteOpen(false)} className="px-4 py-2 font-bold text-[#64748b] border border-[#cbd5e1] rounded-lg hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-5 py-2 font-bold bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg transition-colors">Send & Complete</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
