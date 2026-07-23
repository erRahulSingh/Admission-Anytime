"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaClock,
  FaTimesCircle,
  FaCheckCircle,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaFileExport,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaPhoneAlt,
  FaWhatsapp,
  FaEllipsisV,
  FaArrowUp,
  FaArrowDown,
  FaPhoneVolume,
  FaRegEdit
} from "react-icons/fa";
import api from "@/services/api";

/* ──────── TYPES ──────── */
interface FollowUpModel {
  _id: string;
  leadId: string;
  name: string;
  phone: string;
  nextFollowUpDate: string;
  nextFollowUpTime: string;
  dueLabel: string;
  dueLabelColor: string;
  lastInteractionDate: string;
  lastInteractionTime: string;
  counsellor: string;
  status: "Pending" | "Upcoming" | "Overdue" | "Completed";
  priority: "High" | "Medium" | "Low";
}

/* ──────── MOCK DATA MATCHING EXACT SCREENSHOT ──────── */
const MOCK_FOLLOWUPS: FollowUpModel[] = [
  {
    _id: "fu-1",
    leadId: "#L-12458",
    name: "Amit Kumar",
    phone: "+91 98765 43210",
    nextFollowUpDate: "01 Jun 2025",
    nextFollowUpTime: "10:00 AM",
    dueLabel: "Due Today",
    dueLabelColor: "bg-[#fef3c7] text-[#d97706]",
    lastInteractionDate: "31 May 2025",
    lastInteractionTime: "04:15 PM",
    counsellor: "Neha Sharma",
    status: "Pending",
    priority: "High"
  },
  {
    _id: "fu-2",
    leadId: "#L-12457",
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    nextFollowUpDate: "02 Jun 2025",
    nextFollowUpTime: "11:30 AM",
    dueLabel: "Tomorrow",
    dueLabelColor: "bg-[#d1fae5] text-[#059669]",
    lastInteractionDate: "31 May 2025",
    lastInteractionTime: "11:20 AM",
    counsellor: "Rohit Verma",
    status: "Upcoming",
    priority: "Medium"
  },
  {
    _id: "fu-3",
    leadId: "#L-12456",
    name: "Rahul Verma",
    phone: "+91 76543 21098",
    nextFollowUpDate: "03 Jun 2025",
    nextFollowUpTime: "02:00 PM",
    dueLabel: "In 2 Days",
    dueLabelColor: "bg-[#f3e8ff] text-[#7c3aed]",
    lastInteractionDate: "30 May 2025",
    lastInteractionTime: "04:45 PM",
    counsellor: "Neha Sharma",
    status: "Upcoming",
    priority: "High"
  },
  {
    _id: "fu-4",
    leadId: "#L-12455",
    name: "Sneha Singh",
    phone: "+91 65432 10987",
    nextFollowUpDate: "31 May 2025",
    nextFollowUpTime: "09:30 AM",
    dueLabel: "Overdue",
    dueLabelColor: "bg-[#fee2e2] text-[#dc2626]",
    lastInteractionDate: "29 May 2025",
    lastInteractionTime: "12:30 PM",
    counsellor: "Rohit Verma",
    status: "Overdue",
    priority: "High"
  },
  {
    _id: "fu-5",
    leadId: "#L-12454",
    name: "Vikash Yadav",
    phone: "+91 54321 09876",
    nextFollowUpDate: "04 Jun 2025",
    nextFollowUpTime: "10:30 AM",
    dueLabel: "In 3 Days",
    dueLabelColor: "bg-[#f3e8ff] text-[#7c3aed]",
    lastInteractionDate: "29 May 2025",
    lastInteractionTime: "10:15 AM",
    counsellor: "Anjali Mehta",
    status: "Upcoming",
    priority: "Medium"
  },
  {
    _id: "fu-6",
    leadId: "#L-12453",
    name: "Neha Kumari",
    phone: "+91 43210 98765",
    nextFollowUpDate: "05 Jun 2025",
    nextFollowUpTime: "03:00 PM",
    dueLabel: "In 4 Days",
    dueLabelColor: "bg-[#f3e8ff] text-[#7c3aed]",
    lastInteractionDate: "28 May 2025",
    lastInteractionTime: "05:20 PM",
    counsellor: "Anjali Mehta",
    status: "Upcoming",
    priority: "Low"
  },
  {
    _id: "fu-7",
    leadId: "#L-12452",
    name: "Arjun Singh",
    phone: "+91 32109 87654",
    nextFollowUpDate: "28 May 2025",
    nextFollowUpTime: "06:00 PM",
    dueLabel: "Overdue",
    dueLabelColor: "bg-[#fee2e2] text-[#dc2626]",
    lastInteractionDate: "26 May 2025",
    lastInteractionTime: "03:10 PM",
    counsellor: "Neha Sharma",
    status: "Overdue",
    priority: "High"
  },
  {
    _id: "fu-8",
    leadId: "#L-12451",
    name: "Meera Patel",
    phone: "+91 21098 76543",
    nextFollowUpDate: "06 Jun 2025",
    nextFollowUpTime: "11:00 AM",
    dueLabel: "In 5 Days",
    dueLabelColor: "bg-[#f3e8ff] text-[#7c3aed]",
    lastInteractionDate: "28 May 2025",
    lastInteractionTime: "04:00 PM",
    counsellor: "Rohit Verma",
    status: "Upcoming",
    priority: "Low"
  }
];

/* ──────── HELPERS ──────── */
const fmt = (n: number) => n.toLocaleString("en-IN");

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
    case "Pending": return "bg-[#fef3c7] text-[#d97706] border-[#fde68a]";
    case "Upcoming": return "bg-[#dbeafe] text-[#2563eb] border-[#bfdbfe]";
    case "Overdue": return "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]";
    case "Completed": return "bg-[#d1fae5] text-[#059669] border-[#a7f3d0]";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const priorityStyle = (pr: string): string => {
  switch (pr) {
    case "High": return "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]";
    case "Medium": return "bg-[#ffedd5] text-[#d97706] border-[#fde68a]";
    case "Low": return "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

/* Sparkline Component */
function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg viewBox="0 0 100 20" className="w-full h-4 mt-2">
      <path d={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════ MAIN FOLLOW UPS PAGE ═══════════════════ */
export default function AdminFollowUpsPage() {
  const [followups, setFollowups] = useState<FollowUpModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [counsellorFilter, setCounsellorFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  async function loadData() {
    try {
      setLoading(true);
      const res: any = await api.get("/admissions");
      if (res?.success && Array.isArray(res.leads) && res.leads.length > 0) {
        const mapped: FollowUpModel[] = res.leads.map((l: any, idx: number) => ({
          _id: l._id,
          leadId: `#L-${12458 - idx}`,
          name: l.fullName,
          phone: l.phone,
          nextFollowUpDate: "01 Jun 2025",
          nextFollowUpTime: "10:00 AM",
          dueLabel: idx === 0 ? "Due Today" : idx === 1 ? "Tomorrow" : "In 2 Days",
          dueLabelColor: idx === 0 ? "bg-[#fef3c7] text-[#d97706]" : idx === 1 ? "bg-[#d1fae5] text-[#059669]" : "bg-[#f3e8ff] text-[#7c3aed]",
          lastInteractionDate: "31 May 2025",
          lastInteractionTime: "04:15 PM",
          counsellor: "Neha Sharma",
          status: l.status === "Pending" ? "Pending" : l.status === "Contacted" ? "Upcoming" : "Completed",
          priority: idx % 3 === 0 ? "High" : idx % 3 === 1 ? "Medium" : "Low"
        }));
        setFollowups(mapped);
      } else {
        setFollowups(MOCK_FOLLOWUPS);
      }
    } catch {
      setFollowups(MOCK_FOLLOWUPS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Stats matching screenshot numbers exactly
  const totalNextFollowUps = 2845;
  const dueToday = 542;
  const dueThisWeek = 1245;
  const overdue = 356;
  const completed = 1987;

  // KPI cards
  const kpis = [
    { label: "Total Next Follow Ups", value: "2,845", icon: <FaCalendarAlt />, iconBg: "bg-[#ede9fe] text-[#7c3aed]", pctVal: "14.2", isUp: true, color: "#7c3aed", sparkPoints: "M0,15 Q25,5 50,12 T100,4" },
    { label: "Due Today", value: "542", icon: <FaCalendarCheck />, iconBg: "bg-[#ffedd5] text-[#f97316]", pctVal: "8.7", isUp: true, color: "#f97316", sparkPoints: "M0,12 Q25,18 50,6 T100,8" },
    { label: "Due This Week", value: "1,245", icon: <FaClock />, iconBg: "bg-[#dbeafe] text-[#3b82f6]", pctVal: "11.1", isUp: true, color: "#3b82f6", sparkPoints: "M0,16 Q25,8 50,14 T100,5" },
    { label: "Overdue", value: "356", icon: <FaTimesCircle />, iconBg: "bg-[#fee2e2] text-[#ef4444]", pctVal: "-4.8", isUp: false, color: "#ef4444", sparkPoints: "M0,6 Q25,14 50,8 T100,16" },
    { label: "Completed", value: "1,987", icon: <FaCheckCircle />, iconBg: "bg-[#dcfce7] text-[#22c55e]", pctVal: "16.3", isUp: true, color: "#22c55e", sparkPoints: "M0,14 Q25,4 50,10 T100,3" },
    { label: "Success Rate", value: "69.8%", icon: <FaChartLine />, iconBg: "bg-[#ede9fe] text-[#7c3aed]", pctVal: "6.5", isUp: true, color: "#7c3aed", sparkPoints: "M0,15 Q25,10 50,12 T100,2" },
  ];

  // Filter
  const filtered = followups.filter(f => {
    const matchSearch = !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.phone.includes(searchTerm) || f.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || f.status === statusFilter;
    const matchCounsellor = !counsellorFilter || f.counsellor.toLowerCase().includes(counsellorFilter.toLowerCase());
    return matchSearch && matchStatus && matchCounsellor;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // Time Histogram data (Next Follow Ups by Time)
  const timeHistogram = [
    { label: "12 AM - 6 AM", count: 120 },
    { label: "6 AM - 12 PM", count: 680 },
    { label: "12 PM - 6 PM", count: 1245 },
    { label: "6 PM - 12 AM", count: 800 },
  ];

  // Counsellor distribution bars
  const counsellorBars = [
    { name: "Neha Sharma", val: 785, pctVal: 27.6 },
    { name: "Rohit Verma", val: 695, pctVal: 24.4 },
    { name: "Anjali Mehta", val: 542, pctVal: 19.1 },
    { name: "Vikram Singh", val: 412, pctVal: 14.5 },
    { name: "Pooja Gupta", val: 286, pctVal: 10.0 },
    { name: "Others", val: 125, pctVal: 4.4 },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-32"><div className="w-10 h-10 border-4 border-[#1a6de1] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-5" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Breadcrumb */}
      <div className="text-[12px] text-[#8c95a6] font-medium">
        <Link href="/admin" className="hover:text-[#1a6de1]">Dashboard</Link>
        <span className="mx-1.5">&gt;</span>
        <span className="text-[#1a1f36] font-semibold">Next (Follow Ups)</span>
      </div>

      {/* ═══ 1. KPI Cards (6 Cards with Sparklines) ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#eef0f4] p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[9px] font-semibold text-[#8c95a6] uppercase tracking-wider leading-tight">{k.label}</span>
                <div className={`w-7 h-7 rounded-full ${k.iconBg} flex items-center justify-center text-[11px] flex-shrink-0`}>{k.icon}</div>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#1a1f36] leading-none">{k.value}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-[9px] font-bold flex items-center gap-0.5 ${k.isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {k.isUp ? <FaArrowUp className="text-[6px]" /> : <FaArrowDown className="text-[6px]" />} {k.pctVal}%
                </span>
                <span className="text-[9px] text-[#a0aab8]">vs Apr 01 - Apr 30</span>
              </div>
            </div>
            {/* Sparkline curve */}
            <Sparkline color={k.color} points={k.sparkPoints} />
          </div>
        ))}
      </div>

      {/* ═══ 2. Filter Bar ═══ */}
      <div className="bg-white rounded-xl border border-[#eef0f4] p-3 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg flex-1 min-w-[200px]">
          <FaSearch className="text-[#a0aab8] text-[12px]" />
          <input
            type="text"
            placeholder="Search by name, mobile or lead ID..."
            className="bg-transparent outline-none text-[12px] text-[#3d4555] w-full placeholder:text-[#b0b8c4]"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        {/* Dropdowns */}
        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium appearance-none cursor-pointer pr-7 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238c95a6%22%20d%3D%22M3%204.5L6%208l3-3.5H3z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]">
          <option>This Month</option><option>Last Month</option><option>Today</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium appearance-none cursor-pointer pr-7 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238c95a6%22%20d%3D%22M3%204.5L6%208l3-3.5H3z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
          value={counsellorFilter} onChange={(e) => { setCounsellorFilter(e.target.value); setPage(1); }}>
          <option value="">All Counsellors</option><option>Neha Sharma</option><option>Rohit Verma</option><option>Anjali Mehta</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium appearance-none cursor-pointer pr-7 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238c95a6%22%20d%3D%22M3%204.5L6%208l3-3.5H3z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
          value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option><option>Pending</option><option>Upcoming</option><option>Overdue</option>
        </select>

        <select className="px-3 py-[7px] bg-[#f8f9fb] border border-[#e8ecf1] rounded-lg text-[12px] text-[#3d4555] font-medium appearance-none cursor-pointer pr-7 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238c95a6%22%20d%3D%22M3%204.5L6%208l3-3.5H3z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
          value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}>
          <option value="">All Sources</option><option>Google Ads</option><option>Website</option><option>Facebook Ads</option><option>Referral</option>
        </select>

        <button className="flex items-center gap-1.5 px-4 py-[7px] bg-[#1a6de1] hover:bg-[#1558c0] text-white rounded-lg text-[12px] font-semibold transition-colors">
          <FaFilter className="text-[10px]" /> Filter
        </button>
        <button className="flex items-center gap-1.5 px-4 py-[7px] border border-[#1a6de1] text-[#1a6de1] hover:bg-[#f0f6ff] rounded-lg text-[12px] font-semibold transition-colors">
          <FaFileExport className="text-[10px]" /> Export
        </button>
      </div>

      {/* ═══ 3. Split Content Layout ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* LEFT: Follow Ups Table */}
        <div className="xl:col-span-9 bg-white rounded-xl border border-[#eef0f4] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#eef0f4] bg-[#fafbfc]">
                  <th className="py-3 pl-4 pr-2 w-8"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 accent-[#1a6de1]" /></th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Lead / Contact</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider cursor-pointer">
                    <div className="flex items-center gap-1">Next Follow Up <FaChevronDown className="text-[7px]" /></div>
                  </th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Last Interaction</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Counsellor</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider">Priority</th>
                  <th className="py-3 px-3 text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((fu) => {
                  const initials = getInitials(fu.name);
                  const color = getAvatarColor(fu.name);
                  const counsellorInitials = getInitials(fu.counsellor);

                  return (
                    <tr key={fu._id} className="border-b border-[#f5f6f8] hover:bg-[#fafbfd] transition-colors group">
                      {/* Checkbox */}
                      <td className="py-3 pl-4 pr-2"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 accent-[#1a6de1]" /></td>

                      {/* Lead / Contact */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: color }}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold text-[#1a1f36] leading-tight truncate">{fu.name}</div>
                            <div className="text-[10px] text-[#5a6478]">{fu.phone}</div>
                            <div className="text-[10px] text-[#a0aab8] font-medium">{fu.leadId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Next Follow Up */}
                      <td className="py-3 px-3">
                        <div className="flex items-start gap-2">
                          <FaCalendarAlt className="text-[#f59e0b] text-[12px] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-[11px] font-semibold text-[#1a1f36] leading-tight">{fu.nextFollowUpDate}</div>
                            <div className="text-[10px] text-[#8c95a6] font-medium">{fu.nextFollowUpTime}</div>
                            <span className={`inline-block mt-0.5 px-2 py-[1px] rounded text-[9px] font-bold ${fu.dueLabelColor}`}>
                              {fu.dueLabel}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Last Interaction */}
                      <td className="py-3 px-3">
                        <div className="flex items-start gap-2">
                          <FaPhoneVolume className="text-[#8c95a6] text-[12px] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-[11px] font-semibold text-[#1a1f36] leading-tight">{fu.lastInteractionDate}</div>
                            <div className="text-[10px] text-[#8c95a6] font-medium">{fu.lastInteractionTime}</div>
                          </div>
                        </div>
                      </td>

                      {/* Counsellor */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 flex-shrink-0">
                            {counsellorInitials}
                          </div>
                          <span className="text-[11px] text-[#3d4555] font-medium whitespace-nowrap">{fu.counsellor}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-[3px] rounded-full text-[10px] font-bold border ${statusStyle(fu.status)} whitespace-nowrap`}>
                          {fu.status}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-[3px] rounded-full text-[10px] font-bold border ${priorityStyle(fu.priority)} whitespace-nowrap`}>
                          {fu.priority}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2 opacity-75 group-hover:opacity-100 transition-opacity">
                          <a href={`tel:${fu.phone}`} className="w-7 h-7 rounded-lg bg-[#f0f2f5] hover:bg-[#e2e5ea] flex items-center justify-center text-[#22c55e] text-[12px] transition-colors" title="Call">
                            <FaPhoneAlt />
                          </a>
                          <a href={`https://wa.me/${fu.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-[#f0f2f5] hover:bg-[#e2e5ea] flex items-center justify-center text-[#25d366] text-[13px] transition-colors" title="WhatsApp">
                            <FaWhatsapp />
                          </a>
                          <button className="w-7 h-7 rounded-lg bg-[#f0f2f5] hover:bg-[#e2e5ea] flex items-center justify-center text-[#5a6478] text-[11px] transition-colors">
                            <FaEllipsisV />
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
              Showing 1 to {paged.length} of {fmt(2845)} next follow ups
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-[#e8ecf1] flex items-center justify-center text-[#8c95a6] text-[11px] hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <FaChevronLeft />
              </button>
              {[1, 2, 3].map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-colors ${page === p ? "bg-[#1a6de1] text-white" : "border border-[#e8ecf1] text-[#5a6478] hover:bg-slate-50"}`}>
                  {p}
                </button>
              ))}
              <span className="text-[#8c95a6] text-[12px] px-1">...</span>
              <button onClick={() => setPage(356)} className={`w-8 h-8 rounded-lg text-[12px] font-semibold border border-[#e8ecf1] text-[#5a6478] hover:bg-slate-50 transition-colors ${page === 356 ? "bg-[#1a6de1] text-white border-[#1a6de1]" : ""}`}>
                356
              </button>
              <button onClick={() => setPage(Math.min(356, page + 1))} disabled={page === 356} className="w-8 h-8 rounded-lg border border-[#e8ecf1] flex items-center justify-center text-[#8c95a6] text-[11px] hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <FaChevronRight />
              </button>
              <select value={perPage} className="ml-2 px-2 py-1.5 border border-[#e8ecf1] rounded-lg text-[11px] text-[#5a6478] font-medium bg-white">
                <option>10 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="xl:col-span-3 space-y-4">

          {/* Next Follow Ups by Time (Histogram Bar Chart) */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[12px] font-bold text-[#1a1f36]">Next Follow Ups by Time</h4>
              <button className="text-[10px] text-[#8c95a6] font-medium flex items-center gap-1">This Month <FaChevronDown className="text-[7px]" /></button>
            </div>

            <div className="w-full pt-2">
              <svg viewBox="0 0 280 140" className="w-full">
                {/* Horizontal Grid lines */}
                {[0, 200, 400, 600, 800, 1000].map(v => {
                  const y = 15 + 95 * (1 - v / 1000);
                  return (
                    <g key={v}>
                      <line x1="25" y1={y} x2="275" y2={y} stroke="#f0f2f5" strokeWidth="0.8" />
                      <text x="20" y={y + 3} textAnchor="end" fill="#a0aab8" fontSize="7" fontWeight="600">
                        {v === 1000 ? "1K" : v}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Histogram Bars */}
                {timeHistogram.map((item, i) => {
                  const barW = 24;
                  const x = 38 + i * 62;
                  const barH = 95 * (item.count / 1000);
                  const y = 15 + (95 - barH);

                  return (
                    <g key={i}>
                      {/* Bar Value on top */}
                      <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="#1a1f36" fontSize="8" fontWeight="bold">
                        {fmt(item.count)}
                      </text>
                      {/* Rounded Bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        rx="4"
                        fill="#5850ec"
                        className="hover:opacity-90 transition-opacity"
                      />
                      {/* X Label */}
                      <text x={x + barW / 2} y="128" textAnchor="middle" fill="#8c95a6" fontSize="7" fontWeight="600">
                        {item.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Next Follow Ups by Counsellor */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[12px] font-bold text-[#1a1f36]">Next Follow Ups by Counsellor</h4>
              <span className="text-[10px] text-[#8c95a6] font-medium">This Month</span>
            </div>
            <div className="space-y-2.5">
              {counsellorBars.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-bold text-slate-600">
                        {getInitials(item.name)}
                      </div>
                      <span className="text-[#5a6478] font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#1a1f36]">{fmt(item.val)} <span className="text-[#a0aab8] font-normal">({item.pctVal}%)</span></span>
                  </div>
                  <div className="w-full h-[5px] bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a6de1] rounded-full transition-all duration-500" style={{ width: `${(item.pctVal / 28) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions (4 Action Buttons Grid 2x2) */}
          <div className="bg-white rounded-xl border border-[#eef0f4] p-4">
            <h4 className="text-[12px] font-bold text-[#1a1f36] mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2.5">
              <a href="tel:+919876543210" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#dcfce7] transition-all cursor-pointer group text-center">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] text-[#22c55e] flex items-center justify-center text-[12px] group-hover:scale-110 transition-transform">
                  <FaPhoneAlt />
                </div>
                <span className="text-[11px] font-bold text-[#1a1f36] leading-tight">Call Now</span>
                <span className="text-[9px] text-[#8c95a6]">Start Calling</span>
              </a>

              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#dcfce7] transition-all cursor-pointer group text-center">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] text-[#25d366] flex items-center justify-center text-[13px] group-hover:scale-110 transition-transform">
                  <FaWhatsapp />
                </div>
                <span className="text-[11px] font-bold text-[#1a1f36] leading-tight">WhatsApp</span>
                <span className="text-[9px] text-[#8c95a6]">Send Message</span>
              </a>

              <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#f3e8ff] hover:bg-[#e9d5ff] border border-[#e9d5ff] transition-all cursor-pointer group text-center">
                <div className="w-8 h-8 rounded-full bg-[#e9d5ff] text-[#7c3aed] flex items-center justify-center text-[12px] group-hover:scale-110 transition-transform">
                  <FaCalendarAlt />
                </div>
                <span className="text-[11px] font-bold text-[#1a1f36] leading-tight">Schedule</span>
                <span className="text-[9px] text-[#8c95a6]">Plan Follow Up</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#ffedd5] transition-all cursor-pointer group text-center">
                <div className="w-8 h-8 rounded-full bg-[#ffedd5] text-[#ea580c] flex items-center justify-center text-[12px] group-hover:scale-110 transition-transform">
                  <FaRegEdit />
                </div>
                <span className="text-[11px] font-bold text-[#1a1f36] leading-tight">Add Note</span>
                <span className="text-[9px] text-[#8c95a6]">Add Interaction</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
