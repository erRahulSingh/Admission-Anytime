"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaUserPlus,
  FaEnvelopeOpen,
  FaUniversity,
  FaGlobe,
  FaChevronRight,
  FaUserCheck,
  FaCheckCircle,
} from "react-icons/fa";
import api from "@/services/api";
import { AdmissionFormLead, ContactRequestLead, DashboardStats } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<AdmissionFormLead[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactRequestLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data: any = await api.get("/dashboard/stats");
        if (data && data.success) {
          setStats(data.stats);
          setRecentLeads(data.recentLeads);
          setRecentContacts(data.recentContacts);
        }
      } catch (err) {
        console.warn("Failed fetching live stats, falling back to mock dashboard stats.");
        setStats({
          totalLeads: 24,
          pendingLeads: 12,
          contactedLeads: 8,
          discussionLeads: 3,
          admittedLeads: 1,
          totalContacts: 9,
          unreadContacts: 5,
          totalCountries: 9,
          totalUniversities: 10,
          totalStudents: 25000,
        });
        setRecentLeads([
          {
            _id: "lead-1",
            fullName: "Priyesh Patel",
            email: "priyesh@gmail.com",
            phone: "9876543210",
            neetScore: 420,
            interestedIn: "Abroad",
            country: "Georgia",
            status: "Pending",
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
            createdAt: new Date().toISOString(),
          }
        ]);
        setRecentContacts([
          {
            _id: "contact-1",
            name: "Dr. Sandeep Sharma",
            email: "sandeep@gmail.com",
            phone: "9123456789",
            subject: "Fee query Kazan Russia",
            message: "What is the detailed hostel fee for Kazan Federal University in Indian Rupees?",
            status: "Unread",
            createdAt: new Date().toISOString(),
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate processing rates
  const totalLeads = stats?.totalLeads || 0;
  const pendingLeads = stats?.pendingLeads || 0;
  const leadRate = totalLeads > 0 ? Math.round(((totalLeads - pendingLeads) / totalLeads) * 100) : 0;

  const totalContacts = stats?.totalContacts || 0;
  const unreadContacts = stats?.unreadContacts || 0;
  const contactRate = totalContacts > 0 ? Math.round(((totalContacts - unreadContacts) / totalContacts) * 100) : 0;

  const analyticsCards = [
    {
      label: "Total Leads",
      value: totalLeads,
      rate: leadRate,
      rateLabel: "Follow-up Rate",
      badge: `${pendingLeads} Pending`,
      badgeColor: "bg-amber-50 text-amber-600 border border-amber-100",
      icon: <FaUserPlus />,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20",
      barColor: "bg-blue-500",
    },
    {
      label: "Contact Inquiries",
      value: totalContacts,
      rate: contactRate,
      rateLabel: "Response Rate",
      badge: `${unreadContacts} Unread`,
      badgeColor: "bg-rose-50 text-rose-600 border border-rose-100",
      icon: <FaEnvelopeOpen />,
      iconBg: "bg-gradient-to-br from-[#f9a825] to-[#f57f17] text-white shadow-yellow-500/20",
      barColor: "bg-[#f9a825]",
    },
    {
      label: "Associated Colleges",
      value: stats?.totalUniversities || 0,
      rate: 100,
      rateLabel: "Active System",
      badge: "Verified List",
      badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      icon: <FaUniversity />,
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
      barColor: "bg-emerald-500",
    },
    {
      label: "Supported Countries",
      value: stats?.totalCountries || 0,
      rate: 100,
      rateLabel: "Network Scope",
      badge: "Global Targets",
      badgeColor: "bg-purple-50 text-purple-600 border border-purple-100",
      icon: <FaGlobe />,
      iconBg: "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/20",
      barColor: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0b1c2c] to-[#0c2e60] text-white p-6 md:p-8 rounded-2xl flex justify-between items-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-full pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <span className="inline-block bg-[#f9a825] text-[#0c2e60] font-extrabold text-[9px] px-2.5 py-1 uppercase tracking-wider rounded">
            Live Counseling Dashboard
          </span>
          <h1 className="text-xl md:text-2xl font-black tracking-wide">Welcome Back, Counselor!</h1>
          <p className="text-slate-300 text-xs font-medium">
            Monitor real-time student registrations, inbound contact queries, and university allocations.
          </p>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                  {card.label}
                </span>
                <p className="text-3xl font-black text-[#0c2e60] tracking-tight">{card.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center text-base flex-shrink-0 shadow-md`}>
                {card.icon}
              </div>
            </div>

            {/* Bottom details with progress bar */}
            <div className="mt-5 space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  {card.rateLabel}: <strong className="text-[#0c2e60]">{card.rate}%</strong>
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${card.barColor} rounded-full transition-all duration-500`} style={{ width: `${card.rate}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lists row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent leads table card */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-black text-sm text-[#0c2e60] tracking-wide uppercase flex items-center gap-2">
              <FaUserCheck className="text-blue-500" /> Recent Leads
            </h3>
            <Link
              href="/admin/admission-forms"
              className="text-xs text-primary-500 font-extrabold hover:underline flex items-center gap-1"
            >
              See All Leads <FaChevronRight className="text-[9px]" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="py-2.5">Student</th>
                  <th className="py-2.5">Mobile</th>
                  <th className="py-2.5 text-center">NEET</th>
                  <th className="py-2.5">Country</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-text-dark font-semibold divide-y divide-slate-50">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 font-black text-[#0c2e60]">{lead.fullName}</td>
                    <td className="py-3.5 text-slate-500">{lead.phone}</td>
                    <td className="py-3.5 text-center text-primary-500 font-extrabold">{lead.neetScore}</td>
                    <td className="py-3.5 font-bold">{lead.country}</td>
                    <td className="py-3.5 text-right">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        lead.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent contact requests */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-black text-sm text-[#0c2e60] tracking-wide uppercase flex items-center gap-2">
              <FaCheckCircle className="text-amber-500" /> Recent Inquiries
            </h3>
            <Link
              href="/admin/contact-requests"
              className="text-xs text-primary-500 font-extrabold hover:underline flex items-center gap-1"
            >
              Inbox <FaChevronRight className="text-[9px]" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentContacts.map((contact) => (
              <div key={contact._id} className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-xs text-[#0c2e60] leading-none">{contact.name}</h4>
                  <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded font-black uppercase">{contact.status}</span>
                </div>
                <p className="text-[10px] font-extrabold text-[#f9a825] uppercase tracking-wide">{contact.subject}</p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                  "{contact.message}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
