"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDownload,
  FaFileExcel,
  FaSync,
  FaChevronDown,
  FaArrowUp,
  FaMagic,
  FaGoogle,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaStar,
  FaCheckCircle,
  FaChartLine,
  FaUsers,
  FaRupeeSign,
  FaFileAlt,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import api from "@/services/api";

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState("This Month");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  async function loadReportData() {
    try {
      setLoading(true);
      const res: any = await api.get("/reports", {
        params: { timeRange, courseFilter },
      });
      if (res?.success) {
        setReportData(res);
      }
    } catch (err) {
      console.error("Failed to load reports data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReportData();
  }, [timeRange, courseFilter]);

  // CSV Export for Reports
  const exportReportsCSV = () => {
    if (!reportData) {
      showToast("No report data available to export.");
      return;
    }

    const headers = ["Category / Metric", "Value / Details"];
    const rows = [
      ["Total Estimated Revenue", `"${reportData.revenue || '₹ 4.82 Cr'}"`],
      ["Admission Success Rate", `"${reportData.successRate || 75.6}%"`],
      ["AI Summary", `"${(reportData.aiSummary || '').replace(/"/g, '""')}"`],
    ];

    if (Array.isArray(reportData.courseData)) {
      reportData.courseData.forEach((c: any) => {
        rows.push([`Course Breakdown - ${c.name}`, `"${c.count} applications (${c.percent}%)"`]);
      });
    }

    if (Array.isArray(reportData.counsellors)) {
      reportData.counsellors.forEach((cn: any) => {
        rows.push([`Counsellor - ${cn.name}`, `"Apps: ${cn.apps}, Admissions: ${cn.admissions}, Revenue: ${cn.revenue}"`]);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Reports exported to CSV successfully!");
  };

  // Dynamic Data extractors with fallbacks
  const revenue = reportData?.revenue || "₹ 4.82 Cr";
  const successRate = reportData?.successRate || 75.6;
  const aiSummary = reportData?.aiSummary || "Admissions have grown consistently this month. Google Ads and Website inquiries lead with the highest ROI.";
  const courseData = reportData?.courseData || [
    { name: "MBBS", percent: 42, count: "2,654", color: "#2563eb", bg: "border-[#2563eb]" },
    { name: "BDS", percent: 18, count: "1,134", color: "#8b5cf6", bg: "border-[#8b5cf6]" },
    { name: "BAMS", percent: 12, count: "756", color: "#10b981", bg: "border-[#10b981]" },
    { name: "Nursing", percent: 10, count: "632", color: "#f97316", bg: "border-[#f97316]" },
    { name: "Paramedical", percent: 8, count: "489", color: "#ec4899", bg: "border-[#ec4899]" },
  ];
  const collegeTiles = reportData?.collegeTiles || [
    { name: "KMC Manipal", count: 156, color: "bg-[#2563eb]", flex: "col-span-3 row-span-2" },
    { name: "DY Patil", count: 128, color: "bg-[#8b5cf6]", flex: "col-span-2 row-span-2" },
    { name: "Amrita", count: 98, color: "bg-[#0d9488]", flex: "col-span-2 row-span-2" },
    { name: "AIIMS", count: 87, color: "bg-[#f97316]", flex: "col-span-3 row-span-2" },
    { name: "JIPMER", count: 76, color: "bg-[#ec4899]", flex: "col-span-2 row-span-2" },
    { name: "SGT", count: 65, color: "bg-[#0284c7]", flex: "col-span-2 row-span-2" },
    { name: "BHU", count: 54, color: "bg-[#06b6d4]", flex: "col-span-1 row-span-2" },
    { name: "Others", count: 169, color: "bg-[#64748b]", flex: "col-span-2 row-span-2" },
  ];
  const counsellors = reportData?.counsellors || [
    { name: "Neha Sharma", role: "Senior Counsellor", rating: "4.8", apps: "186", admissions: "86", revenue: "₹48.6L", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
    { name: "Rohit Verma", role: "Counsellor", rating: "4.6", apps: "152", admissions: "71", revenue: "₹39.2L", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
    { name: "Anjali Mehta", role: "Counsellor", rating: "4.5", apps: "142", admissions: "64", revenue: "₹36.8L", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
    { name: "Vikram Singh", role: "Counsellor", rating: "4.3", apps: "118", admissions: "52", revenue: "₹28.6L", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  ];
  const stackedBarData = reportData?.stackedBarData || [
    { week: "Week 1", gads: 320, fb: 280, ig: 200, web: 180, ref: 120, yt: 80 },
    { week: "Week 2", gads: 450, fb: 340, ig: 260, web: 220, ref: 150, yt: 100 },
    { week: "Week 3", gads: 510, fb: 390, ig: 310, web: 250, ref: 180, yt: 110 },
    { week: "Week 4", gads: 580, fb: 420, ig: 350, web: 290, ref: 210, yt: 130 },
    { week: "Week 5", gads: 620, fb: 450, ig: 380, web: 310, ref: 230, yt: 140 },
  ];
  const stateData = reportData?.stateData || [
    { state: "Maharashtra", count: 1245 },
    { state: "Karnataka", count: 1021 },
    { state: "Tamil Nadu", count: 834 },
    { state: "Kerala", count: 612 },
    { state: "Uttar Pradesh", count: 498 },
    { state: "Delhi", count: 412 },
  ];
  const journeyFlow = reportData?.journeyFlow || {
    leads: "12,458",
    counselling: "6,245",
    applications: "1,987",
    admissions: "876",
    rates: { counsellingRate: "50.1%", applicationRate: "31.8%", admissionRate: "44.1%" },
  };

  return (
    <div className="space-y-5 pb-12 font-sans text-[#1a1f36] bg-[#f8fafc]">
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

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP ACTION & FILTER BAR                                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0] shadow-xs">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#64748b] mr-1">
            <FaFilter className="text-[#6366f1]" />
            <span>Filters:</span>
          </div>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-[#f8fafc] border border-[#cbd5e1] hover:border-[#94a3b8] text-[#334155] font-semibold text-[12px] py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none transition-colors"
            >
              <option value="This Month">This Month</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[9px] pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="appearance-none bg-[#f8fafc] border border-[#cbd5e1] hover:border-[#94a3b8] text-[#334155] font-semibold text-[12px] py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none transition-colors"
            >
              <option value="All Courses">All Courses</option>
              <option value="MBBS">MBBS</option>
              <option value="BDS">BDS</option>
              <option value="BAMS">BAMS</option>
              <option value="Nursing">Nursing</option>
              <option value="Paramedical">Paramedical</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[9px] pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportReportsCSV}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-[12px] font-bold shadow-sm transition-colors cursor-pointer"
          >
            <FaDownload className="text-[11px]" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={exportReportsCSV}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] rounded-lg text-[12px] font-bold transition-colors cursor-pointer"
          >
            <FaFileExcel className="text-[#16a34a] text-[12px]" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => {
              loadReportData();
              showToast("Refreshing live analytics from DB...");
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] rounded-lg text-[12px] font-bold transition-colors cursor-pointer"
          >
            <FaSync className={`text-[#64748b] text-[11px] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. TOP ROW (AI Insights Banner + Admission Success + Lead Sources) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── Box 1: AI INSIGHTS Banner (Span 5) ── */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#4338ca] text-white rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <path
                d="M 0 100 Q 150 20 300 120 T 500 40 L 500 200 L 0 200 Z"
                fill="url(#ai-wave-grad)"
              />
              <defs>
                <linearGradient id="ai-wave-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-[#a5b4fc] mb-3">
              <FaMagic className="text-[10px]" />
              <span>AI INSIGHTS</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#c7d2fe] font-medium block">Total Estimated Revenue</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[26px] font-black leading-none">{revenue}</span>
                  <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30 text-[10px] font-bold flex items-center gap-0.5">
                    <FaArrowUp className="text-[8px]" /> 28%
                  </span>
                </div>
                <span className="text-[10px] text-[#a5b4fc]">vs previous period</span>
              </div>

              {/* Circular Growth Gauge */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeDasharray={`${Math.round(successRate)}, 100`}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[14px] font-black leading-none block">{successRate}%</span>
                  <span className="text-[8px] text-[#93c5fd] block mt-0.5">Growth Score</span>
                </div>
              </div>
            </div>

            {/* AI Generated Summary */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[10px] font-bold text-[#a5b4fc] uppercase tracking-wider block mb-1">
                AI Generated Summary
              </span>
              <p className="text-[11px] text-[#e0e7ff] leading-relaxed">
                {aiSummary}
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-3">
            <button
              onClick={() => showToast("Opening Full AI Analytics Report...")}
              className="px-4 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-[11px] font-bold shadow-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              View Full Report →
            </button>
          </div>
        </div>

        {/* ── Box 2: Admission Success Rate Gauge (Span 3) ── */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Admission Success Rate</h3>
            <span className="text-xs text-[#94a3b8] cursor-pointer">ⓘ</span>
          </div>

          {/* Speedometer Gauge SVG */}
          <div className="relative w-full h-[130px] flex items-center justify-center my-auto">
            <svg className="w-[180px] h-[100px]" viewBox="0 0 100 60">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 82 25"
                fill="none"
                stroke="url(#gauge-grad)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              <text x="10" y="58" fontSize="6" fill="#94a3b8" textAnchor="middle">0%</text>
              <text x="25" y="32" fontSize="6" fill="#94a3b8" textAnchor="middle">25%</text>
              <text x="50" y="14" fontSize="6" fill="#94a3b8" textAnchor="middle">50%</text>
              <text x="75" y="32" fontSize="6" fill="#94a3b8" textAnchor="middle">75%</text>
              <text x="90" y="58" fontSize="6" fill="#94a3b8" textAnchor="middle">100%</text>

              <line x1="50" y1="50" x2="72" y2="28" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="50" cy="50" r="4" fill="#0f172a" />
            </svg>

            <div className="absolute bottom-1 text-center">
              <span className="text-[20px] font-black text-[#0f172a] block leading-none">{successRate}%</span>
              <span className="text-[10px] text-[#64748b] font-semibold block">Success Rate</span>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-[#f1f5f9]">
            <span className="text-[11px] font-bold text-[#10b981] inline-flex items-center gap-1">
              <FaArrowUp className="text-[9px]" /> 8.6% vs last month
            </span>
          </div>
        </div>

        {/* ── Box 3: Lead Sources Comparison (Span 4) ── */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Lead Sources Comparison</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">{timeRange}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold mb-2">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#2563eb]" />Google Ads</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#1d4ed8]" />Facebook</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#e1306c]" />Instagram</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#10b981]" />Website</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#f59e0b]" />Referral</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ef4444]" />YouTube</span>
          </div>

          {/* Stacked Bar Chart */}
          <div className="h-[140px] w-full flex items-end justify-between gap-3 pt-2">
            {stackedBarData.map((item: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex flex-col-reverse rounded-t overflow-hidden">
                  <div style={{ height: `${(item.gads || 300) / 20}px` }} className="bg-[#2563eb]" />
                  <div style={{ height: `${(item.fb || 250) / 20}px` }} className="bg-[#1d4ed8]" />
                  <div style={{ height: `${(item.ig || 200) / 20}px` }} className="bg-[#e1306c]" />
                  <div style={{ height: `${(item.web || 180) / 20}px` }} className="bg-[#10b981]" />
                  <div style={{ height: `${(item.ref || 120) / 20}px` }} className="bg-[#f59e0b]" />
                  <div style={{ height: `${(item.yt || 80) / 20}px` }} className="bg-[#ef4444]" />
                </div>
                <span className="text-[9px] text-[#64748b] font-medium mt-1">{item.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. MIDDLE ROW (Students by State + Course Apps + Journey Flow) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── Box 1: Students by State (India) (Span 4) ── */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Students by State (India)</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">{courseFilter}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-[120px] h-[140px] bg-[#f1f5f9] rounded-xl flex flex-col items-center justify-center p-2 relative flex-shrink-0 border border-[#e2e8f0]">
              <FaMapMarkerAlt className="text-[#6366f1] text-2xl animate-bounce mb-1" />
              <span className="text-[10px] font-bold text-[#0f172a] text-center">India Region</span>
              <span className="text-[8px] text-[#64748b]">Density Map</span>
            </div>

            <div className="space-y-1 text-[11px] font-medium flex-1">
              {stateData.map((st: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b border-[#f1f5f9] pb-0.5">
                  <span className="text-[#475569]">{st.state}</span>
                  <span className="font-bold text-[#0f172a]">{typeof st.count === "number" ? st.count.toLocaleString("en-IN") : st.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Box 2: Applications by Course (Span 4) ── */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Applications by Course</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">{timeRange}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 my-auto text-center">
            {courseData.map((course: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full border-4 ${course.bg} flex flex-col items-center justify-center bg-white shadow-xs`}
                >
                  <span className="text-[12px] font-black text-[#0f172a] leading-none">
                    {course.percent}%
                  </span>
                  <span className="text-[8px] text-[#64748b]">{course.count}</span>
                </div>
                <span className="text-[10px] font-bold text-[#334155] mt-1.5">{course.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Box 3: Admission Journey Flow (Span 4) ── */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Admission Journey Flow</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">{timeRange}</span>
          </div>

          <div className="py-2 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 bg-[#2563eb] text-white p-2 rounded-lg text-center">
                <span className="text-[9px] block uppercase font-bold opacity-80">Leads</span>
                <span className="text-[13px] font-black">{journeyFlow.leads}</span>
              </div>
              <span className="text-[10px] font-bold text-[#2563eb]">➔</span>
              <div className="flex-1 bg-[#8b5cf6] text-white p-2 rounded-lg text-center">
                <span className="text-[9px] block uppercase font-bold opacity-80">Counselling</span>
                <span className="text-[13px] font-black">{journeyFlow.counselling}</span>
              </div>
              <span className="text-[10px] font-bold text-[#8b5cf6]">➔</span>
              <div className="flex-1 bg-[#f97316] text-white p-2 rounded-lg text-center">
                <span className="text-[9px] block uppercase font-bold opacity-80">Application</span>
                <span className="text-[13px] font-black">{journeyFlow.applications}</span>
              </div>
              <span className="text-[10px] font-bold text-[#f97316]">➔</span>
              <div className="flex-1 bg-[#10b981] text-white p-2 rounded-lg text-center">
                <span className="text-[9px] block uppercase font-bold opacity-80">Admission</span>
                <span className="text-[13px] font-black">{journeyFlow.admissions}</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-[#64748b] px-2">
              <span className="text-[#10b981]">★ {journeyFlow.rates?.counsellingRate || "50.1%"} Conversion</span>
              <span className="text-[#10b981]">★ {journeyFlow.rates?.applicationRate || "31.8%"} Conversion</span>
              <span className="text-[#10b981]">★ {journeyFlow.rates?.admissionRate || "44.1%"} Conversion</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 4. THIRD ROW (College Treemap + Conversion Funnel + Journey Line) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── Box 1: College-wise Admissions (Treemap) (Span 4) ── */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-[#0f172a]">College-wise Admissions</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">{timeRange}</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 h-[140px]">
            {collegeTiles.map((tile: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`${tile.flex} ${tile.color} text-white p-2 rounded-lg flex flex-col justify-between shadow-xs transition-transform`}
              >
                <span className="text-[10px] font-bold truncate">{tile.name}</span>
                <span className="text-[12px] font-black">{tile.count}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Box 2: Lead Conversion Funnel (Span 4) ── */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Lead Conversion Funnel</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">{timeRange}</span>
          </div>

          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#475569]">Total Leads</span>
              <span className="font-bold text-[#0f172a]">{journeyFlow.leads}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#475569]">Counselled</span>
              <span className="font-bold text-[#0f172a]">{journeyFlow.counselling} ({journeyFlow.rates?.counsellingRate})</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#475569]">Applications</span>
              <span className="font-bold text-[#0f172a]">{journeyFlow.applications} ({journeyFlow.rates?.applicationRate})</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-[#475569]">Admitted</span>
              <span className="font-bold text-[#0f172a]">{journeyFlow.admissions} ({journeyFlow.rates?.admissionRate})</span>
            </div>
          </div>
        </div>

        {/* ── Box 3: Month-wise Admissions Journey (Span 4) ── */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Month-wise Admissions Journey</h3>
            <div className="flex items-center gap-2 text-[9px] font-semibold">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2563eb]" />Leads</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />Applications</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]" />Admissions</span>
            </div>
          </div>

          <div className="h-[140px] w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
              <path d="M 0 30 Q 100 10 200 25 T 400 15" fill="none" stroke="#2563eb" strokeWidth="2" />
              <path d="M 0 60 Q 100 45 200 55 T 400 45" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              <path d="M 0 90 Q 100 80 200 85 T 400 75" fill="none" stroke="#10b981" strokeWidth="2" />

              <circle cx="400" cy="15" r="4" fill="#2563eb" />
              <circle cx="400" cy="45" r="4" fill="#8b5cf6" />
              <circle cx="400" cy="75" r="4" fill="#10b981" />
            </svg>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 5. BOTTOM ROW (AI Recommendations + Top Counsellors + Revenue)  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── Box 1: AI Recommendations (Span 5) ── */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <FaMagic className="text-[#6366f1] text-[13px]" />
            <h3 className="text-[14px] font-bold text-[#0f172a]">AI Recommendations</h3>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between">
              <div>
                <div className="w-6 h-6 rounded bg-[#ea4335]/10 text-[#ea4335] flex items-center justify-center text-xs mb-1.5">
                  <FaGoogle />
                </div>
                <div className="text-[10px] font-bold text-[#0f172a] leading-tight">
                  Google Ads are performing great!
                </div>
                <p className="text-[9px] text-[#64748b] leading-tight mt-1">
                  Increase your Google Ads budget by 18% to get more leads.
                </p>
              </div>
              <button
                onClick={() => showToast("Applying Google Ads Budget Recommendation...")}
                className="mt-2 text-[9px] font-bold text-[#1a6de1] hover:underline cursor-pointer"
              >
                View Details
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between">
              <div>
                <div className="w-6 h-6 rounded bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center text-xs mb-1.5">
                  <FaMapMarkerAlt />
                </div>
                <div className="text-[10px] font-bold text-[#0f172a] leading-tight">
                  South India is your highest converting region.
                </div>
                <p className="text-[9px] text-[#64748b] leading-tight mt-1">
                  Focus more on Karnataka and Tamil Nadu.
                </p>
              </div>
              <button
                onClick={() => showToast("Viewing Regional Analytics...")}
                className="mt-2 text-[9px] font-bold text-[#1a6de1] hover:underline cursor-pointer"
              >
                View Details
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between">
              <div>
                <div className="w-6 h-6 rounded bg-[#9333ea]/10 text-[#9333ea] flex items-center justify-center text-xs mb-1.5">
                  <FaGraduationCap />
                </div>
                <div className="text-[10px] font-bold text-[#0f172a] leading-tight">
                  MBBS Abroad demand increased by 24%.
                </div>
                <p className="text-[9px] text-[#64748b] leading-tight mt-1">
                  Consider increasing counsellors for MBBS Abroad.
                </p>
              </div>
              <button
                onClick={() => showToast("Allocating Counsellors...")}
                className="mt-2 text-[9px] font-bold text-[#1a6de1] hover:underline cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* ── Box 2: Top Performing Counsellors (Span 4) ── */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Top Performing Counsellors</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">{timeRange}</span>
          </div>

          <div className="space-y-2">
            {counsellors.map((c: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f8fafc] transition-colors border border-transparent hover:border-[#f1f5f9]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#94a3b8] w-3">{idx + 1}</span>
                  {/* eslint-disable-next-html-element-suppression */}
                  <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <div className="text-[11px] font-bold text-[#0f172a] leading-tight flex items-center gap-1">
                      <span>{c.name}</span>
                      <span className="px-1 py-0.2 bg-[#e0f2fe] text-[#0284c7] text-[8px] font-bold rounded flex items-center gap-0.5">
                        {c.rating} <FaStar className="text-[7px]" />
                      </span>
                    </div>
                    <div className="text-[9px] text-[#64748b]">{c.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-[10px] font-bold text-[#0f172a]">{c.apps}</div>
                    <div className="text-[8px] text-[#94a3b8]">Applications</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#0f172a]">{c.admissions}</div>
                    <div className="text-[8px] text-[#94a3b8]">Admissions</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#10b981]">{c.revenue}</div>
                    <div className="text-[8px] text-[#94a3b8]">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Box 3: Revenue Analytics (Span 3) ── */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-bold text-[#0f172a]">Revenue Analytics</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">{timeRange}</span>
          </div>

          <div className="h-[140px] w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
              <path d="M 0 80 Q 75 60 150 40 T 300 20" fill="none" stroke="#2563eb" strokeWidth="2.5" />
              <circle cx="225" cy="30" r="5" fill="#2563eb" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

