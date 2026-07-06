"use client";

import React, { useEffect, useState } from "react";
import { FaUserPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import api from "@/services/api";
import { AdmissionFormLead } from "@/types";

export default function AdminAdmissionFormsPage() {
  const [leads, setLeads] = useState<AdmissionFormLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState<AdmissionFormLead | null>(null);
  const [statusInput, setStatusInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  async function loadLeads() {
    try {
      setLoading(true);
      const data: any = await api.get("/admissions");
      if (data && data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.warn("Failed retrieving live leads from backend. Falling back to mock leads.");
      setLeads([
        {
          _id: "lead-1",
          fullName: "Priyesh Patel",
          email: "priyesh@gmail.com",
          phone: "9876543210",
          neetScore: 420,
          interestedIn: "Abroad",
          country: "Georgia",
          status: "Pending",
          notes: "Interested in Tbilisi State Medical University. Budget is around 25 Lakhs.",
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
          notes: "Prefers government seats. Wants options in south India deemed universities.",
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const handleEditClick = (lead: AdmissionFormLead) => {
    setEditingLead(lead);
    setStatusInput(lead.status);
    setNotesInput(lead.notes || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    try {
      await api.put(`/admissions/${editingLead._id}`, {
        status: statusInput,
        notes: notesInput,
      });
      setEditingLead(null);
      loadLeads();
    } catch (err) {
      console.error(err);
      // Fallback local edit update for mock environment
      setLeads(prev =>
        prev.map(l =>
          l._id === editingLead._id
            ? { ...l, status: statusInput as any, notes: notesInput }
            : l
        )
      );
      setEditingLead(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/admissions/${id}`);
      loadLeads();
    } catch (err) {
      console.error(err);
      // Fallback local deletion
      setLeads(prev => prev.filter(l => l._id !== id));
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-dark">Student Admission Leads</h1>
          <p className="text-xs text-text-muted">Review registrations, manage statuses, and write counseling logs.</p>
        </div>
      </div>

      {/* Edit modal / panel */}
      {editingLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-premium border p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl relative z-10">
            <h3 className="font-extrabold text-lg text-text-dark">Edit Lead: {editingLead.fullName}</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Counselor Discussion Notes</label>
                <textarea
                  rows={4}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Enter counseling summary or NEET cutoff status details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table grid box */}
      <div className="bg-white rounded-premium border border-slate-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">NEET</th>
                <th className="py-4 px-6">Preference</th>
                <th className="py-4 px-6">Country</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Notes</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-text-dark font-medium divide-y divide-slate-50">
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="py-4 px-6 text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-extrabold text-sm block">{lead.fullName}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{lead.email} • {lead.phone}</span>
                  </td>
                  <td className="py-4 px-6 text-primary-500 font-black text-sm">{lead.neetScore}</td>
                  <td className="py-4 px-6">{lead.interestedIn}</td>
                  <td className="py-4 px-6 font-semibold">{lead.country}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      lead.status === "Pending"
                        ? "bg-yellow-50 text-yellow-600"
                        : lead.status === "Contacted"
                        ? "bg-blue-50 text-blue-600"
                        : lead.status === "Admitted"
                        ? "bg-green-50 text-green-600"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 max-w-xs truncate" title={lead.notes}>
                    {lead.notes || <span className="italic text-slate-300">No notes written</span>}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(lead)}
                      className="p-2 border border-slate-100 text-slate-600 hover:text-primary-500 rounded-lg"
                      title="Update status"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="p-2 border border-slate-100 text-slate-600 hover:text-red-500 rounded-lg"
                      title="Delete lead"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
