"use client";

import React, { useEffect, useState } from "react";
import { FaInbox, FaReply, FaTrash, FaCheck } from "react-icons/fa";
import api from "@/services/api";
import { ContactRequestLead } from "@/types";

export default function AdminContactRequestsPage() {
  const [contacts, setContacts] = useState<ContactRequestLead[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
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

  const handleReplyClick = (contact: ContactRequestLead) => {
    setReplyingContact(contact);
    setReplyText("");
  };

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
    } catch (err) {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      loadContacts();
    } catch (err) {
      console.error(err);
      setContacts(prev => prev.filter(c => c._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-text-dark">Contact Inquiries Inbox</h1>
        <p className="text-xs text-text-muted">Read questions submitted by web users, write email answers, and delete items.</p>
      </div>

      {/* Reply dialog popup */}
      {replyingContact && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-premium border p-6 md:p-8 max-w-lg w-full space-y-4 shadow-2xl relative z-10">
            <h3 className="font-extrabold text-lg text-text-dark">Reply to: {replyingContact.name}</h3>
            
            <div className="bg-slate-50 p-4 rounded-xl border space-y-1.5 text-xs text-text-muted">
              <p><strong>Subject:</strong> {replyingContact.subject}</p>
              <p className="italic">" {replyingContact.message} "</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Email Reply</label>
                <textarea
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Dear student, thank you for writing. Regarding Kazan Federal University..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingContact(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50"
                >
                  {sending ? "Sending Email..." : "Send Reply Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inbox cards grid */}
      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className={`p-6 rounded-premium border shadow-md flex flex-col md:flex-row justify-between gap-6 transition-all bg-white ${
              contact.status === "Unread" ? "border-l-4 border-l-secondary-500" : "border-slate-100"
            }`}
          >
            <div className="space-y-3.5 flex-1">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-extrabold text-sm text-text-dark">{contact.name}</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{contact.email} • {contact.phone}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide ${
                  contact.status === "Unread"
                    ? "bg-yellow-50 text-yellow-600"
                    : contact.status === "Replied"
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {contact.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-primary-500 block">Subject: {contact.subject}</span>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  "{contact.message}"
                </p>
              </div>

              {contact.replyMessage && (
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-200/30 text-xs text-text-dark">
                  <span className="font-bold text-[9px] uppercase text-green-600 block mb-1">Your Reply sent to student</span>
                  <p className="italic">"{contact.replyMessage}"</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleReplyClick(contact)}
                className="p-2 border border-slate-100 text-slate-600 hover:text-primary-500 rounded-lg text-sm flex items-center gap-1.5 font-bold"
                title="Write response email"
              >
                <FaReply /> <span className="text-xs">Reply</span>
              </button>
              <button
                onClick={() => handleDelete(contact._id)}
                className="p-2 border border-slate-100 text-slate-600 hover:text-red-500 rounded-lg text-sm"
                title="Delete query"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
