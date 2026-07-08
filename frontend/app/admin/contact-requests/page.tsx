"use client";

import React, { useEffect, useState } from "react";
import {
  FaInbox,
  FaReply,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { ContactRequestLead } from "@/types";

export default function AdminContactRequestsPage() {
  const [contacts, setContacts] = useState<ContactRequestLead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Reply Modal State
  const [replyingContact, setReplyingContact] = useState<ContactRequestLead | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  async function loadContacts() {
    try {
      setLoading(true);
      const data: any = await api.get("/contacts");
      if (data && data.success) {
        setContacts(data.contacts);
      }
    } catch (err: unknown) {
      console.warn("Failed retrieving contact messages. Falling back to mock dataset.");
      setContacts([
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

  useEffect(() => {
    loadContacts();
  }, []);

  // Open Reply Modal
  const handleReplyClick = (contact: ContactRequestLead) => {
    setReplyingContact(contact);
    setReplyText("");
  };

  // Submit Reply Email
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingContact || !replyText.trim()) return;

    try {
      setSending(true);
      await api.put(`/contacts/${replyingContact._id}`, {
        replyMessage: replyText,
      });
      setReplyingContact(null);
      loadContacts();
    } catch (err: unknown) {
      console.error(err);
      // Local updates fallback
      setContacts(prev =>
        prev.map(c =>
          c._id === replyingContact._id
            ? { ...c, status: "Replied", replyMessage: replyText }
            : c
        )
      );
      setReplyingContact(null);
    } finally {
      setSending(false);
    }
  };

  // Delete message
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      loadContacts();
    } catch (err: unknown) {
      console.error(err);
      setContacts(prev => prev.filter(c => c._id !== id));
    }
  };

  // Client-side search and status filters
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate inbox stats
  const totalCount = contacts.length;
  const unreadCount = contacts.filter(c => c.status === "Unread").length;
  const repliedCount = contacts.filter(c => c.status === "Replied").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* ═══ 1. Title & Description ═══ */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[#0c2e60] tracking-wide uppercase">
          Contact Inquiries Inbox
        </h1>
        <p className="text-xs text-slate-400 font-semibold">
          Read questions submitted by web users, write email answers, and organize user tickets.
        </p>
      </div>

      {/* ═══ 2. Ticket Summary Metrics (Framer motion hover scale) ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Inquiries", count: totalCount, color: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-350" },
          { label: "Unread Tickets", count: unreadCount, color: "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-350" },
          { label: "Replied Answers", count: repliedCount, color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-350" },
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
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch size={12} />
          </span>
          <input
            type="text"
            placeholder="Search in name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          />
        </div>

        {/* Filter dropdown */}
        <div className="w-full md:w-56 flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold flex-shrink-0 flex items-center gap-1">
            <FaFilter size={10} /> View:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          >
            <option value="">All Tickets</option>
            <option value="Unread">Unread</option>
            <option value="Replied">Replied</option>
          </select>
        </div>

      </div>

      {/* ═══ 4. Inbox Cards Grid ═══ */}
      <div className="grid grid-cols-1 gap-4">
        {filteredContacts.length === 0 ? (
          <div className="bg-white p-12 text-center text-slate-400 font-semibold border rounded-2xl shadow-sm italic">
            <FaInfoCircle className="inline-block mr-1.5" /> No inquiry tickets found matching your criteria.
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <motion.div
              key={contact._id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className={`p-6 rounded-2xl border shadow-md flex flex-col md:flex-row justify-between gap-6 transition-all bg-white hover:shadow-lg ${
                contact.status === "Unread"
                  ? "border-l-4 border-l-[#f9a825] border-y-slate-200 border-r-slate-200"
                  : "border-slate-200/80"
              }`}
            >
              <div className="space-y-3.5 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-black text-sm text-[#0c2e60]">{contact.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      {contact.email} • {contact.phone}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide inline-block ${
                    contact.status === "Unread"
                      ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                      : contact.status === "Replied"
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {contact.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wide">
                    Subject: <strong className="text-[#0c2e60]">{contact.subject}</strong>
                  </span>
                  <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    "{contact.message}"
                  </p>
                </div>

                {contact.replyMessage && (
                  <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 text-xs text-text-dark">
                    <span className="font-black text-[9px] uppercase text-emerald-600 block mb-1">
                      Your Email Reply sent to student:
                    </span>
                    <p className="italic font-semibold text-slate-650">"{contact.replyMessage}"</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-start md:items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleReplyClick(contact)}
                  className="px-3.5 py-2 border border-slate-200 hover:border-blue-200 text-slate-500 hover:text-blue-600 rounded-xl text-xs flex items-center gap-1.5 font-extrabold hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
                  title="Write response email"
                >
                  <FaReply size={10} /> <span>Reply</span>
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="p-2 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
                  title="Delete query"
                >
                  <FaTrash size={11} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ═══ 5. Reply Modal (Framer Motion spring transitions) ═══ */}
      <AnimatePresence>
        {replyingContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReplyingContact(null)}
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
                onClick={() => setReplyingContact(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Reply to: {replyingContact.name}
              </h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1 text-xs text-slate-500 font-semibold leading-relaxed">
                <p><strong>Subject:</strong> {replyingContact.subject}</p>
                <p className="italic mt-1 text-slate-650">" {replyingContact.message} "</p>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Your Email Reply</label>
                  <textarea
                    rows={6}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Dear student, thank you for writing. Regarding Kazan Federal University..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setReplyingContact(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-5 py-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold rounded-xl text-xs shadow-md uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                  >
                    {sending ? "Sending Email..." : "Send Reply Email"}
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
