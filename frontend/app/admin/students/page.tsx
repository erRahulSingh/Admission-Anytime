"use client";

import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaTimes,
  FaInfoCircle,
  FaUserGraduate,
  FaUniversity,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { University } from "@/types";

interface StudentModel {
  _id: string;
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  neetScore: number;
  countryInterested: string;
  selectedUniversity?: string | University | null;
  status: "Applied" | "Document Verification" | "Visa Processing" | "Enroute" | "Joined";
  createdAt: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [unis, setUnis] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [neetScore, setNeetScore] = useState<number | "">("");
  const [countryInterested, setCountryInterested] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [status, setStatus] = useState<StudentModel["status"]>("Applied");

  // Edit Form State
  const [editingStudent, setEditingStudent] = useState<StudentModel | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editNeetScore, setEditNeetScore] = useState<number | "">("");
  const [editCountryInterested, setEditCountryInterested] = useState("");
  const [editSelectedUniversity, setEditSelectedUniversity] = useState("");
  const [editStatus, setEditStatus] = useState<StudentModel["status"]>("Applied");

  async function loadData() {
    try {
      setLoading(true);
      // Fetch Universities
      const uniData: any = await api.get("/universities/all");
      if (uniData && uniData.success) {
        setUnis(uniData.universities);
      }
      
      // Fetch Students
      const studentData: any = await api.get("/students");
      if (studentData && studentData.success) {
        setStudents(studentData.students);
      }
    } catch (err: unknown) {
      console.warn("Failed retrieving students/universities. Utilizing fallback database.");
      setUnis([
        { _id: "uni-1", name: "Tbilisi State Medical University", slug: "tsmu" } as any,
        { _id: "uni-2", name: "Kazan Federal University", slug: "kfu" } as any,
      ]);
      setStudents([
        {
          _id: "stu-1",
          applicationId: "APP783492",
          name: "Amit Rawat",
          email: "amit.rawat@gmail.com",
          phone: "9829384920",
          neetScore: 350,
          countryInterested: "Georgia",
          selectedUniversity: { _id: "uni-1", name: "Tbilisi State Medical University" } as any,
          status: "Visa Processing",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "stu-2",
          applicationId: "APP492049",
          name: "Sneha Patel",
          email: "sneha.p@gmail.com",
          phone: "8829384910",
          neetScore: 540,
          countryInterested: "Russia",
          selectedUniversity: { _id: "uni-2", name: "Kazan Federal University" } as any,
          status: "Joined",
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleEditClick = (student: StudentModel) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditEmail(student.email);
    setEditPhone(student.phone);
    setEditNeetScore(student.neetScore);
    setEditCountryInterested(student.countryInterested);
    setEditSelectedUniversity(
      typeof student.selectedUniversity === "object"
        ? student.selectedUniversity?._id || ""
        : student.selectedUniversity || ""
    );
    setEditStatus(student.status);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || neetScore === "" || !countryInterested) return;

    const payload = {
      name,
      email,
      phone,
      neetScore: Number(neetScore),
      countryInterested,
      selectedUniversity: selectedUniversity || null,
      status,
    };

    try {
      await api.post("/students", payload);
      resetAddForm();
      setShowAddForm(false);
      loadData();
    } catch (err: unknown) {
      console.error(err);
      const chosenUni = unis.find(u => u._id === selectedUniversity);
      const mockStudent: StudentModel = {
        _id: "mock-stu-" + Date.now(),
        applicationId: "APP" + Math.floor(100000 + Math.random() * 900000),
        ...payload,
        selectedUniversity: chosenUni ? { _id: chosenUni._id, name: chosenUni.name } as any : null,
        createdAt: new Date().toISOString(),
      };
      setStudents(prev => [mockStudent, ...prev]);
      setShowAddForm(false);
      resetAddForm();
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const payload = {
      name: editName,
      email: editEmail,
      phone: editPhone,
      neetScore: Number(editNeetScore),
      countryInterested: editCountryInterested,
      selectedUniversity: editSelectedUniversity || null,
      status: editStatus,
    };

    try {
      await api.put(`/students/${editingStudent._id}`, payload);
      setEditingStudent(null);
      loadData();
    } catch (err: unknown) {
      console.error(err);
      const chosenUni = unis.find(u => u._id === editSelectedUniversity);
      setStudents(prev =>
        prev.map(s =>
          s._id === editingStudent._id
            ? {
                ...s,
                ...payload,
                selectedUniversity: chosenUni ? { _id: chosenUni._id, name: chosenUni.name } as any : null,
              }
            : s
        )
      );
      setEditingStudent(null);
    }
  };

  const resetAddForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setNeetScore("");
    setCountryInterested("");
    setSelectedUniversity("");
    setStatus("Applied");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    try {
      await api.delete(`/students/${id}`);
      loadData();
    } catch (err: unknown) {
      console.error(err);
      setStudents(prev => prev.filter(s => s._id !== id));
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm) ||
      student.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = students.length;
  const appliedCount = students.filter(s => s.status === "Applied").length;
  const processingCount = students.filter(s => ["Document Verification", "Visa Processing", "Enroute"].includes(s.status)).length;
  const joinedCount = students.filter(s => s.status === "Joined").length;

  return (
    <div className="space-y-8">
      {/* Title & Header Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0c2e60] tracking-wide uppercase">
            Manage Admitted Students
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Track student application journey from initial documentation, visa progress, till college joining.
          </p>
        </div>
        <button
          onClick={() => { resetAddForm(); setShowAddForm(true); }}
          className="flex items-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-blue-900/10 transition-all uppercase tracking-wider hover:-translate-y-0.5 active:scale-95 duration-200"
        >
          <FaPlus size={10} /> Add Student Record
        </button>
      </div>

      {/* Stats Ticker */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Admissions", count: totalCount, color: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-350" },
          { label: "Newly Applied", count: appliedCount, color: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-350" },
          { label: "Processing & Visa", count: processingCount, color: "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-350" },
          { label: "Successfully Joined", count: joinedCount, color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-350" },
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

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch size={12} />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, app ID, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          />
        </div>

        <div className="w-full md:w-60 flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold flex-shrink-0 flex items-center gap-1">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Document Verification">Document Verification</option>
            <option value="Visa Processing">Visa Processing</option>
            <option value="Enroute">Enroute</option>
            <option value="Joined">Joined</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#0c2e60] text-[#f9a825] font-black uppercase tracking-wider">
                <th className="py-4 px-6 text-[10px]">Student Details</th>
                <th className="py-4 px-6 text-[10px]">NEET Score</th>
                <th className="py-4 px-6 text-[10px]">Interested Country</th>
                <th className="py-4 px-6 text-[10px]">Assigned University</th>
                <th className="py-4 px-6 text-[10px]">Status</th>
                <th className="py-4 px-6 text-right text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-text-dark font-semibold divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold italic">
                    <FaInfoCircle className="inline-block mr-1.5" /> No student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#0c2e60] text-sm flex-shrink-0">
                        <FaUserGraduate />
                      </div>
                      <div>
                        <span className="font-black text-sm text-[#0c2e60] block leading-tight">{s.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{s.applicationId} | {s.email} | {s.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-primary-500 font-black text-sm">{s.neetScore}</td>
                    <td className="py-4 px-6 font-bold">{s.countryInterested}</td>
                    <td className="py-4 px-6">
                      {s.selectedUniversity ? (
                        <span className="flex items-center gap-1.5 text-[#0c2e60] font-bold">
                          <FaUniversity className="text-slate-400" />
                          {typeof s.selectedUniversity === "object" ? s.selectedUniversity.name : s.selectedUniversity}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                        s.status === "Joined" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        s.status === "Applied" ? "bg-slate-50 text-slate-600 border border-slate-100" :
                        "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(s)}
                        className="p-2 border border-slate-100 hover:border-blue-200 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block cursor-pointer"
                        title="Edit student"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-2 border border-slate-100 hover:border-red-200 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block cursor-pointer"
                        title="Delete student"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-xl w-full space-y-4 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Add Student Record
              </h3>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Student Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. student@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 6284063840"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">NEET Score</label>
                    <input
                      type="number"
                      placeholder="e.g. 420"
                      value={neetScore}
                      onChange={(e) => setNeetScore(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Country Interested</label>
                    <input
                      type="text"
                      placeholder="e.g. Georgia"
                      value={countryInterested}
                      onChange={(e) => setCountryInterested(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Assigned University</label>
                    <select
                      value={selectedUniversity}
                      onChange={(e) => setSelectedUniversity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="">-- Select University --</option>
                      {unis.map(u => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Document Verification">Document Verification</option>
                      <option value="Visa Processing">Visa Processing</option>
                      <option value="Enroute">Enroute</option>
                      <option value="Joined">Joined</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-500 font-bold rounded-xl text-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0c2e60] text-white font-extrabold rounded-xl text-xs hover:bg-[#0a2550] shadow-md hover:shadow-blue-900/10 active:scale-95 transition-all cursor-pointer"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStudent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-xl w-full space-y-4 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingStudent(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Edit Student Record
              </h3>

              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Student Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">NEET Score</label>
                    <input
                      type="number"
                      value={editNeetScore}
                      onChange={(e) => setEditNeetScore(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Country Interested</label>
                    <input
                      type="text"
                      value={editCountryInterested}
                      onChange={(e) => setEditCountryInterested(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Assigned University</label>
                    <select
                      value={editSelectedUniversity}
                      onChange={(e) => setEditSelectedUniversity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="">-- Select University --</option>
                      {unis.map(u => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Document Verification">Document Verification</option>
                      <option value="Visa Processing">Visa Processing</option>
                      <option value="Enroute">Enroute</option>
                      <option value="Joined">Joined</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-500 font-bold rounded-xl text-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0c2e60] text-white font-extrabold rounded-xl text-xs hover:bg-[#0a2550] shadow-md hover:shadow-blue-900/10 active:scale-95 transition-all cursor-pointer"
                  >
                    Update Record
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
