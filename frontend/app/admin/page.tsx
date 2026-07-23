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
  FaChevronDown,
  FaChevronRight,
  FaArrowUp,
} from "react-icons/fa";
import api from "@/services/api";

/* ──────────────────── TYPES ──────────────────── */
interface StatsData {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  counsellingDone: number;
  applications: number;
  admissions: number;
}

interface TrendPoint {
  date: string;
  newLeads: number;
  counsellingDone: number;
  admissions: number;
}

interface SourceData {
  website: number;
  facebookAds: number;
  googleAds: number;
  referral: number;
  others: number;
}

interface AdmissionStatusData {
  success: number;
  pending: number;
  rejected: number;
}

interface CourseData {
  course: string;
  percentage: number;
}

interface LocationData {
  state: string;
  percentage: number;
  value: number;
}

interface RecentLead {
  fullName: string;
  phone: string;
  source: string;
  course: string;
  status: string;
  createdAt: string;
}

interface DashboardPayload {
  stats: StatsData;
  trends: TrendPoint[];
  sources: SourceData;
  admissionStatus: AdmissionStatusData;
  topCourses: CourseData[];
  locations: LocationData[];
  recentLeads: RecentLead[];
}

/* ──────────────────── FALLBACK DATA ──────────────────── */
const FALLBACK: DashboardPayload = {
  stats: {
    totalLeads: 12458,
    newLeads: 2345,
    contactedLeads: 6543,
    counsellingDone: 3245,
    applications: 1987,
    admissions: 876,
  },
  trends: [
    { date: "01 May", newLeads: 620, counsellingDone: 420, admissions: 180 },
    { date: "06 May", newLeads: 710, counsellingDone: 530, admissions: 210 },
    { date: "11 May", newLeads: 680, counsellingDone: 490, admissions: 190 },
    { date: "16 May", newLeads: 750, counsellingDone: 560, admissions: 250 },
    { date: "21 May", newLeads: 810, counsellingDone: 590, admissions: 270 },
    { date: "26 May", newLeads: 780, counsellingDone: 510, admissions: 230 },
    { date: "31 May", newLeads: 830, counsellingDone: 610, admissions: 280 },
  ],
  sources: { website: 5678, facebookAds: 2980, googleAds: 2345, referral: 1245, others: 210 },
  admissionStatus: { success: 876, pending: 456, rejected: 123 },
  topCourses: [
    { course: "MBBS in India", percentage: 36.5 },
    { course: "MBBS Abroad", percentage: 24.0 },
    { course: "BDS", percentage: 16.5 },
    { course: "Nursing", percentage: 11.2 },
    { course: "Ayush", percentage: 7.2 },
    { course: "Others", percentage: 4.6 },
  ],
  locations: [
    { state: "Uttar Pradesh", percentage: 19.7, value: 2456 },
    { state: "Maharashtra", percentage: 15.9, value: 1987 },
    { state: "Bihar", percentage: 12.4, value: 1542 },
    { state: "Rajasthan", percentage: 10.0, value: 1245 },
    { state: "West Bengal", percentage: 8.2, value: 1023 },
  ],
  recentLeads: [
    { fullName: "Amit Kumar", phone: "+91 98765 43210", source: "Google Ads", course: "MBBS in India", status: "New", createdAt: "2025-05-31T12:00:00Z" },
    { fullName: "Priya Sharma", phone: "+91 87654 32109", source: "Website", course: "MBBS Abroad", status: "Contacted", createdAt: "2025-05-31T10:30:00Z" },
    { fullName: "Rahul Verma", phone: "+91 76543 21098", source: "Facebook Ads", course: "BDS", status: "Counselling Done", createdAt: "2025-05-30T15:45:00Z" },
    { fullName: "Sneha Singh", phone: "+91 65432 10987", source: "Referral", course: "Nursing", status: "Application", createdAt: "2025-05-30T09:15:00Z" },
    { fullName: "Vikash Yadav", phone: "+91 54321 09876", source: "Google Ads", course: "MBBS in India", status: "Admission", createdAt: "2025-05-29T14:20:00Z" },
  ],
};

/* ──────────────────── HELPERS ──────────────────── */
const fmt = (n: number) => n.toLocaleString("en-IN");
const pct = (v: number, total: number) => (total > 0 ? ((v / total) * 100).toFixed(1) : "0.0");

/** SVG Donut ring component */
function DonutChart({
  segments,
  size = 160,
  strokeWidth = 22,
  centerLabel,
  centerSub,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel: string;
  centerSub: string;
}) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  let accumulated = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dashLen = frac * C;
          const gap = C - dashLen;
          const offset = (accumulated / total) * C;
          accumulated += seg.value;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLen} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[18px] font-extrabold text-[#1a1f36] leading-none">{centerLabel}</span>
        <span className="text-[10px] text-[#8c95a6] font-semibold mt-0.5">{centerSub}</span>
      </div>
    </div>
  );
}

/* ──────────────────── MAIN PAGE ──────────────────── */
export default function AdminDashboardPage() {
  const [d, setD] = useState<DashboardPayload>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res: any = await api.get("/dashboard/stats");
        if (res?.success) {
          setD((prev) => ({
            stats: res.stats ?? prev.stats,
            trends: res.trends ?? prev.trends,
            sources: res.sources ?? prev.sources,
            admissionStatus: res.admissionStatus ?? prev.admissionStatus,
            topCourses: res.topCourses ?? prev.topCourses,
            locations: res.locations ?? prev.locations,
            recentLeads: res.recentLeads ?? prev.recentLeads,
          }));
        }
      } catch {
        /* fallback stays */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Derived
  const s = d.stats;
  const totalLd = s.totalLeads || 1;

  /* KPI cards config */
  const kpis = [
    { label: "Total Leads", value: s.totalLeads, icon: <FaUsers />, iconBg: "bg-[#ede9fe] text-[#7c3aed]", pctUp: "12.5" },
    { label: "New Leads", value: s.newLeads, icon: <FaUserPlus />, iconBg: "bg-[#dbeafe] text-[#3b82f6]", pctUp: "8.6" },
    { label: "Contacted", value: s.contactedLeads, icon: <FaPhoneAlt />, iconBg: "bg-[#ffedd5] text-[#f97316]", pctUp: "10.2" },
    { label: "Counselling Done", value: s.counsellingDone, icon: <FaComments />, iconBg: "bg-[#dcfce7] text-[#22c55e]", pctUp: "14.3" },
    { label: "Applications", value: s.applications, icon: <FaFileAlt />, iconBg: "bg-[#ede9fe] text-[#8b5cf6]", pctUp: "11.8" },
    { label: "Admissions (Success)", value: s.admissions, icon: <FaGraduationCap />, iconBg: "bg-[#e0f2fe] text-[#0ea5e9]", pctUp: "15.7" },
  ];

  /* Leads Overview segments */
  const overviewSegs = [
    { label: "New", value: s.newLeads, color: "#3b82f6" },
    { label: "Contacted", value: s.contactedLeads, color: "#22c55e" },
    { label: "Counselling Done", value: s.counsellingDone, color: "#f59e0b" },
    { label: "Application", value: s.applications, color: "#8b5cf6" },
    { label: "Admission", value: s.admissions, color: "#ec4899" },
  ];

  /* Source segments */
  const srcTotal = Object.values(d.sources).reduce((a, b) => a + b, 0) || 1;
  const sourceSegs = [
    { label: "Website", value: d.sources.website, color: "#22c55e" },
    { label: "Facebook Ads", value: d.sources.facebookAds, color: "#3b82f6" },
    { label: "Google Ads", value: d.sources.googleAds, color: "#f59e0b" },
    { label: "Referral", value: d.sources.referral, color: "#8b5cf6" },
    { label: "Others", value: d.sources.others, color: "#94a3b8" },
  ];

  /* Admission Status */
  const admTotal = d.admissionStatus.success + d.admissionStatus.pending + d.admissionStatus.rejected || 1;
  const admSegs = [
    { label: "Success", value: d.admissionStatus.success, color: "#22c55e" },
    { label: "Pending", value: d.admissionStatus.pending, color: "#f59e0b" },
    { label: "Rejected", value: d.admissionStatus.rejected, color: "#ef4444" },
  ];

  /* Line chart math */
  const W = 460, H = 160, PAD_L = 35, PAD_B = 22, PAD_T = 10;
  const maxY = 1000;
  const colW = (W - PAD_L) / (d.trends.length - 1);

  const toXY = (key: keyof TrendPoint) =>
    d.trends.map((t, i) => ({
      x: PAD_L + i * colW,
      y: PAD_T + (H - PAD_B - PAD_T) * (1 - (t[key] as number) / maxY),
    }));
  const ptsNew = toXY("newLeads");
  const ptsCoun = toXY("counsellingDone");
  const ptsAdm = toXY("admissions");

  const line = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = (pts: { x: number; y: number }[]) => {
    const bottom = H - PAD_B;
    return `${line(pts)} L${pts[pts.length - 1].x},${bottom} L${pts[0].x},${bottom} Z`;
  };

  /* Funnel layers */
  const funnelLayers = [
    { label: "Total Leads", value: s.totalLeads, color: "#3b82f6", w: 1 },
    { label: "Contacted", value: s.contactedLeads, color: "#22c55e", w: 0.78 },
    { label: "Counselling Done", value: s.counsellingDone, color: "#f59e0b", w: 0.58 },
    { label: "Applications", value: s.applications, color: "#8b5cf6", w: 0.40 },
    { label: "Admissions", value: s.admissions, color: "#ec4899", w: 0.25 },
  ];

  /* Status badge color */
  const statusStyle = (st: string) => {
    switch (st) {
      case "New": case "Pending": return "bg-[#dbeafe] text-[#2563eb] border-[#bfdbfe]";
      case "Contacted": return "bg-[#fef3c7] text-[#d97706] border-[#fde68a]";
      case "Counselling Done": case "In Discussion": return "bg-[#d1fae5] text-[#059669] border-[#a7f3d0]";
      case "Application": case "Applied": return "bg-[#ede9fe] text-[#7c3aed] border-[#ddd6fe]";
      case "Admission": case "Admitted": return "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-[#1a6de1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* ═══════ ROW 1: KPI CARDS ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#eef0f4] p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-semibold text-[#8c95a6] uppercase tracking-wider leading-tight">{k.label}</span>
              <div className={`w-8 h-8 rounded-full ${k.iconBg} flex items-center justify-center text-[13px] flex-shrink-0`}>
                {k.icon}
              </div>
            </div>
            <div>
              <h3 className="text-[22px] font-extrabold text-[#1a1f36] leading-none tracking-tight">{fmt(k.value)}</h3>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                  <FaArrowUp className="text-[7px]" /> {k.pctUp}%
                </span>
                <span className="text-[10px] text-[#a0aab8]">vs Apr 01 - Apr 30</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ ROW 2: OVERVIEW, TREND, SOURCE ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leads Overview */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#eef0f4] p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[13px] font-bold text-[#1a1f36]">Leads Overview</h4>
            <button className="text-[11px] text-[#8c95a6] font-medium flex items-center gap-1">This Month <FaChevronDown className="text-[8px]" /></button>
          </div>
          <div className="flex items-center gap-5">
            <DonutChart
              segments={overviewSegs}
              size={150}
              strokeWidth={20}
              centerLabel={fmt(totalLd)}
              centerSub="Total"
            />
            <div className="space-y-2 flex-1 min-w-0">
              {overviewSegs.map((seg, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-[8px] h-[8px] rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-[#5a6478] font-medium">{seg.label}</span>
                  </div>
                  <span className="font-bold text-[#1a1f36]">
                    {fmt(seg.value)} <span className="text-[#a0aab8] font-normal text-[10px]">({pct(seg.value, totalLd)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Trend */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#eef0f4] p-5">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-bold text-[#1a1f36]">Leads Trend</h4>
            <button className="text-[11px] text-[#8c95a6] font-medium flex items-center gap-1">This Month <FaChevronDown className="text-[8px]" /></button>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-3 text-[10px] text-[#8c95a6] font-medium">
            <span className="flex items-center gap-1"><span className="w-2.5 h-[3px] bg-[#3b82f6] rounded" /> New Leads</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-[3px] bg-[#22c55e] rounded" /> Counselling Done</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-[3px] bg-[#f59e0b] rounded" /> Admissions</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <defs>
              <linearGradient id="gBlu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity=".12" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient>
              <linearGradient id="gGrn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity=".12" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></linearGradient>
            </defs>
            {/* Grid */}
            {[0, 200, 400, 600, 800, 1000].map(v => {
              const y = PAD_T + (H - PAD_B - PAD_T) * (1 - v / maxY);
              return <g key={v}><line x1={PAD_L} y1={y} x2={W} y2={y} stroke="#f0f2f5" strokeWidth="0.8" /><text x={PAD_L - 5} y={y + 3} textAnchor="end" fill="#a0aab8" fontSize="8" fontWeight="600">{v === 1000 ? "1K" : v}</text></g>;
            })}
            {/* Areas */}
            <path d={area(ptsNew)} fill="url(#gBlu)" />
            <path d={area(ptsCoun)} fill="url(#gGrn)" />
            {/* Lines */}
            <path d={line(ptsNew)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={line(ptsCoun)} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={line(ptsAdm)} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {ptsNew.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" stroke="white" strokeWidth="1.5" />)}
            {ptsCoun.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22c55e" stroke="white" strokeWidth="1.5" />)}
            {ptsAdm.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#f59e0b" stroke="white" strokeWidth="1.5" />)}
            {/* X Labels */}
            {d.trends.map((t, i) => <text key={i} x={PAD_L + i * colW} y={H - 4} textAnchor="middle" fill="#a0aab8" fontSize="8" fontWeight="600">{t.date}</text>)}
          </svg>
        </div>

        {/* Leads Source */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#eef0f4] p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[13px] font-bold text-[#1a1f36]">Leads Source</h4>
            <span className="text-[11px] text-[#8c95a6] font-medium">This Month</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <DonutChart
              segments={sourceSegs}
              size={140}
              strokeWidth={18}
              centerLabel={fmt(totalLd)}
              centerSub="Total"
            />
            <div className="w-full space-y-1.5">
              {sourceSegs.map((seg, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-[8px] h-[8px] rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-[#5a6478] font-medium">{seg.label}</span>
                  </div>
                  <span className="font-bold text-[#1a1f36]">
                    {fmt(seg.value)} <span className="text-[#a0aab8] font-normal text-[10px]">({pct(seg.value, srcTotal)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ ROW 3: FUNNEL, ADMISSION STATUS, TOP COURSES ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Lead Status Funnel */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#eef0f4] p-5">
          <h4 className="text-[13px] font-bold text-[#1a1f36] mb-4">Lead Status Funnel</h4>
          <div className="flex items-center gap-4">
            {/* Funnel SVG */}
            <svg viewBox="0 0 160 180" className="w-[140px] flex-shrink-0">
              {funnelLayers.map((layer, i) => {
                const layerH = 30;
                const gap = 5;
                const y = i * (layerH + gap);
                const fullW = 140;
                const w = fullW * layer.w;
                const x = (fullW - w) / 2 + 10;
                const nextW = i < funnelLayers.length - 1 ? fullW * funnelLayers[i + 1].w : w * 0.6;
                const nextX = (fullW - nextW) / 2 + 10;
                return (
                  <polygon
                    key={i}
                    points={`${x},${y} ${x + w},${y} ${nextX + nextW},${y + layerH} ${nextX},${y + layerH}`}
                    fill={layer.color}
                    className="hover:opacity-90 transition-opacity"
                  />
                );
              })}
            </svg>
            {/* Labels */}
            <div className="space-y-3 flex-1 min-w-0">
              {funnelLayers.map((layer, i) => (
                <div key={i}>
                  <div className="text-[16px] font-extrabold text-[#1a1f36] leading-none">{fmt(layer.value)}</div>
                  <div className="text-[10px] text-[#8c95a6] font-medium">
                    {layer.label} {i > 0 && `(${pct(layer.value, totalLd)}%)`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admission Status */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#eef0f4] p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[13px] font-bold text-[#1a1f36]">Admission Status</h4>
            <button className="text-[11px] text-[#8c95a6] font-medium flex items-center gap-1">This Month <FaChevronDown className="text-[8px]" /></button>
          </div>
          <div className="flex items-center gap-5">
            <DonutChart
              segments={admSegs}
              size={150}
              strokeWidth={20}
              centerLabel={fmt(admTotal)}
              centerSub="Total"
            />
            <div className="space-y-3 flex-1 min-w-0">
              {admSegs.map((seg, i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-[#5a6478] font-medium">{seg.label}</span>
                  </div>
                  <span className="font-bold text-[#1a1f36]">
                    {fmt(seg.value)} <span className="text-[#a0aab8] font-normal text-[10px]">({pct(seg.value, admTotal)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Courses */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#eef0f4] p-5">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-[13px] font-bold text-[#1a1f36]">Top Courses (By Admissions)</h4>
            <button className="text-[11px] text-[#8c95a6] font-medium flex items-center gap-1">This Month <FaChevronDown className="text-[8px]" /></button>
          </div>
          {/* Header */}
          <div className="flex justify-between text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider mt-3 mb-2">
            <span>Course</span>
            <span>Admissions</span>
          </div>
          <div className="space-y-3">
            {d.topCourses.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#3d4555] font-medium">{c.course}</span>
                  <span className="font-bold text-[#1a1f36]">{c.percentage}%</span>
                </div>
                <div className="w-full h-[6px] bg-[#f0f2f5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1a6de1] rounded-full transition-all duration-700" style={{ width: `${(c.percentage / 40) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ ROW 4: LOCATION + RECENT LEADS ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leads by Location (India) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#eef0f4] p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[13px] font-bold text-[#1a1f36]">Leads by Location (India)</h4>
            <button className="text-[11px] text-[#8c95a6] font-medium flex items-center gap-1">This Month <FaChevronDown className="text-[8px]" /></button>
          </div>
          <div className="flex items-start gap-5">
            {/* India Map SVG */}
            <div className="w-[130px] flex-shrink-0">
              <svg viewBox="0 0 200 240" className="w-full">
                <path
                  d="M95 15 L100 18 L108 16 L115 22 L118 30 L125 38 L130 42 L140 48 L148 55 L152 65 L150 75 L145 80 L140 78 L135 82 L138 90 L148 95 L160 100 L170 108 L175 118 L172 128 L165 132 L158 130 L152 136 L148 142 L140 140 L134 146 L138 158 L132 170 L124 180 L120 192 L115 205 L110 215 L106 210 L104 195 L100 182 L95 168 L90 158 L84 148 L78 140 L72 132 L68 125 L64 115 L60 105 L58 95 L62 88 L56 82 L50 78 L44 74 L48 68 L55 64 L62 60 L70 58 L78 55 L85 50 L90 40 L92 30 L95 22 Z"
                  fill="#e8f4fd"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                />
                {/* State dots */}
                <circle cx="100" cy="65" r="5" fill="#3b82f6" opacity="0.7"><animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" /></circle>
                <circle cx="85" cy="105" r="4" fill="#3b82f6" opacity="0.6" />
                <circle cx="110" cy="125" r="4.5" fill="#3b82f6" opacity="0.7" />
                <circle cx="105" cy="155" r="4" fill="#3b82f6" opacity="0.6" />
                <circle cx="145" cy="100" r="3.5" fill="#3b82f6" opacity="0.5" />
              </svg>
            </div>
            {/* Location bars */}
            <div className="flex-1 space-y-3.5 min-w-0">
              {d.locations.map((loc, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#3d4555] font-semibold">{loc.state}</span>
                    <span className="text-[#8c95a6] font-medium">{fmt(loc.value)} ({loc.percentage}%)</span>
                  </div>
                  <div className="w-full h-[5px] bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#3b82f6] rounded-full transition-all duration-700" style={{ width: `${(loc.percentage / 20) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#eef0f4] p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[13px] font-bold text-[#1a1f36]">Recent Leads</h4>
            <Link href="/admin/admission-forms" className="text-[11px] text-[#22c55e] font-semibold hover:underline flex items-center gap-0.5">
              View All Leads <FaChevronRight className="text-[8px]" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f0f2f5]">
                  {["Name", "Mobile", "Source", "Course", "Status", "Created At"].map((h) => (
                    <th key={h} className="text-[10px] text-[#8c95a6] font-semibold uppercase tracking-wider py-2.5 pr-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.recentLeads.map((lead, i) => {
                  const displayStatus = lead.status === "In Discussion" ? "Counselling Done" : lead.status === "Admitted" ? "Admission" : lead.status;
                  return (
                    <tr key={i} className="border-b border-[#f8f9fa] hover:bg-[#fafbfc] transition-colors">
                      <td className="py-3 pr-3 text-[12px] font-semibold text-[#1a1f36] whitespace-nowrap">{lead.fullName}</td>
                      <td className="py-3 pr-3 text-[12px] text-[#5a6478] whitespace-nowrap">{lead.phone}</td>
                      <td className="py-3 pr-3 text-[12px] text-[#5a6478] whitespace-nowrap">{lead.source}</td>
                      <td className="py-3 pr-3 text-[12px] text-[#3d4555] font-medium whitespace-nowrap">{lead.course}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-block px-2.5 py-[3px] rounded-full text-[10px] font-bold border ${statusStyle(displayStatus)} whitespace-nowrap`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-3 text-[12px] text-[#8c95a6] whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
