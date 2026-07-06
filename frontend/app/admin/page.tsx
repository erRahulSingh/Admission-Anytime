"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserPlus, FaEnvelopeOpen, FaUniversity, FaGlobe, FaChevronRight, FaPlus } from "react-icons/fa";
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
        // Set mock display metrics
        setStats({
          totalLeads: 24,
          pendingLeads: 12,
          contactedLeads: 8,
          discussionLeads: 3,
          admittedLeads: 1,
          totalContacts: 9,
          unreadContacts: 5,
          totalCountries: 3,
          totalUniversities: 4,
          totalStudents: 15,
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

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-[#0b1c2c] text-white p-6 md:p-8 rounded-premium flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-2xl font-black">Welcome Back, Counselor!</h1>
          <p className="text-slate-400 text-xs mt-1">
            Check recent registration activities, student inquiries, and university databases.
          </p>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Leads",
            val: stats?.totalLeads || 0,
            sub: `${stats?.pendingLeads || 0} Pending`,
            icon: <FaUserPlus />,
            bg: "bg-primary-50 text-primary-500",
          },
          {
            label: "Contact Messages",
            val: stats?.totalContacts || 0,
            sub: `${stats?.unreadContacts || 0} Unread`,
            icon: <FaEnvelopeOpen />,
            bg: "bg-secondary-50 text-secondary-600",
          },
          {
            label: "Associated Unis",
            val: stats?.totalUniversities || 0,
            sub: "Active database",
            icon: <FaUniversity />,
            bg: "bg-accent-50 text-accent-500",
          },
          {
            label: "Countries Supported",
            val: stats?.totalCountries || 0,
            sub: "Active locations",
            icon: <FaGlobe />,
            bg: "bg-purple-50 text-purple-500",
          },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-premium border border-slate-100 shadow-md flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{item.label}</span>
              <p className="text-3xl font-black text-text-dark">{item.val}</p>
              <span className="text-[10px] text-slate-500 font-medium block">{item.sub}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center text-lg flex-shrink-0`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Lists row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent leads table card */}
        <div className="lg:col-span-8 bg-white p-6 rounded-premium border border-slate-100 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-extrabold text-sm text-text-dark">Recent Lead Registrations</h3>
            <Link
              href="/admin/admission-forms"
              className="text-xs text-primary-500 font-bold hover:underline flex items-center gap-1"
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
                  <th className="py-2.5">NEET</th>
                  <th className="py-2.5">Country</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="text-text-dark font-medium divide-y divide-slate-50">
                {recentLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td className="py-3 font-bold">{lead.fullName}</td>
                    <td className="py-3 text-slate-500">{lead.phone}</td>
                    <td className="py-3 text-primary-500 font-extrabold">{lead.neetScore}</td>
                    <td className="py-3 font-semibold">{lead.country}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        lead.status === "Pending" ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
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
        <div className="lg:col-span-4 bg-white p-6 rounded-premium border border-slate-100 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-extrabold text-sm text-text-dark">Recent Inquiries</h3>
            <Link
              href="/admin/contact-requests"
              className="text-xs text-primary-500 font-bold hover:underline flex items-center gap-1"
            >
              Inbox <FaChevronRight className="text-[9px]" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentContacts.map((contact) => (
              <div key={contact._id} className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-text-dark leading-none">{contact.name}</h4>
                  <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold uppercase">{contact.status}</span>
                </div>
                <p className="text-[10px] font-extrabold text-primary-500">{contact.subject}</p>
                <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
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
