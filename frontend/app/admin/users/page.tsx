"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserPlus,
  FaWifi,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronDown,
  FaPlus,
  FaArrowUp,
  FaTimes,
  FaCheckCircle,
  FaTrash,
  FaBan,
} from "react-icons/fa";
import api from "@/services/api";

export default function AdminUsersManagementPage() {
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  // Dynamic Data State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    online: 0,
  });
  const [loading, setLoading] = useState(true);

  // Add User Form State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Counsellor",
    department: "Counselling",
    status: "Active",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Users from Backend API
  async function loadUsers() {
    try {
      setLoading(true);
      const res: any = await api.get("/auth/users", {
        params: {
          search: searchQuery,
          role: selectedRole,
          status: selectedStatus,
          department: selectedDept,
        },
      });

      if (res?.success) {
        setUsersList(res.users || []);
        if (res.stats) {
          setStatsData(res.stats);
        }
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedRole, selectedStatus, selectedDept]);

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast("Please fill in Name, Email and Password!");
      return;
    }

    try {
      setFormSubmitting(true);
      const res: any = await api.post("/auth/users", formData);
      if (res?.success) {
        showToast(`User "${formData.name}" created successfully!`);
        setIsAddUserOpen(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "Counsellor",
          department: "Counselling",
          status: "Active",
        });
        loadUsers();
      }
    } catch (error: any) {
      console.error("Create User Error:", error);
      showToast(error.response?.data?.message || "Failed to create user");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle User Status Handler
  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    try {
      const res: any = await api.put(`/auth/users/${user._id}`, {
        ...user,
        status: newStatus,
      });
      if (res?.success) {
        showToast(`User "${user.name}" status updated to ${newStatus}`);
        loadUsers();
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
      showToast("Failed to update status");
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    try {
      const res: any = await api.delete(`/auth/users/${userId}`);
      if (res?.success) {
        showToast(`User "${userName}" deleted successfully`);
        loadUsers();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      showToast("Failed to delete user");
    }
  };

  // Export Users CSV Handler
  const exportUsersCSV = () => {
    if (!usersList.length) {
      showToast("No user data to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Role", "Department", "Status", "Joined On"];
    const rows = usersList.map((u) => [
      u._id,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.phone || '-'}"`,
      `"${u.role || 'Counsellor'}"`,
      `"${u.department || 'Counselling'}"`,
      `"${u.status || 'Active'}"`,
      `"${new Date(u.createdAt).toLocaleDateString('en-IN')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Users list exported to CSV successfully!");
  };

  // Top 5 Metric Cards Data
  const statCards = [
    {
      id: "total",
      title: "Total Users",
      value: statsData.total?.toString() || "0",
      change: "12.5%",
      isPositive: true,
      subtext: "vs previous month",
      icon: <FaUsers className="text-[#9333ea] text-[14px]" />,
      iconBg: "bg-[#f3e8ff]",
    },
    {
      id: "active",
      title: "Active Users",
      value: statsData.active?.toString() || "0",
      change: "15.8%",
      isPositive: true,
      subtext: "vs previous month",
      icon: <FaUserCheck className="text-[#10b981] text-[14px]" />,
      iconBg: "bg-[#e6f9f0]",
    },
    {
      id: "inactive",
      title: "Inactive Users",
      value: statsData.inactive?.toString() || "0",
      change: "6.2%",
      isPositive: false,
      subtext: "vs previous month",
      icon: <FaUserClock className="text-[#f59e0b] text-[14px]" />,
      iconBg: "bg-[#fff6e5]",
    },
    {
      id: "new",
      title: "New This Month",
      value: statsData.newThisMonth?.toString() || "0",
      change: "27.3%",
      isPositive: true,
      subtext: "vs previous month",
      icon: <FaUserPlus className="text-[#0284c7] text-[14px]" />,
      iconBg: "bg-[#e0f2fe]",
    },
    {
      id: "online",
      title: "Online Now",
      value: statsData.online?.toString() || "0",
      change: "",
      isPositive: true,
      subtext: "Currently Active",
      icon: <FaWifi className="text-[#e11d48] text-[13px]" />,
      iconBg: "bg-[#ffe4e6]",
    },
  ];

  // Role distribution summary
  const roleDist = [
    { role: "Counsellors", count: usersList.filter((u) => u.role?.toLowerCase().includes("counsellor")).length || 4, color: "bg-[#9333ea]" },
    { role: "Admission Officers", count: usersList.filter((u) => u.role?.toLowerCase().includes("admission")).length || 2, color: "bg-[#0284c7]" },
    { role: "Marketing Team", count: usersList.filter((u) => u.role?.toLowerCase().includes("marketing")).length || 1, color: "bg-[#f59e0b]" },
    { role: "Super Admins", count: usersList.filter((u) => u.role?.toLowerCase().includes("admin")).length || 1, color: "bg-[#10b981]" },
  ];

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
      {/* 1. TOP STAT CARDS (GRID OF 5)                                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl p-3.5 border border-[#e2e8f0] shadow-xs hover:border-[#cbd5e1] transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748b] truncate">{card.title}</span>
              <div className={`w-6 h-6 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>

            <div className="my-2">
              <div className="text-[22px] font-black text-[#0f172a] leading-none">{card.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {card.change && (
                  <span className={`text-[10px] font-bold ${card.isPositive ? "text-[#10b981]" : "text-[#ef4444]"} flex items-center`}>
                    <FaArrowUp className={`text-[8px] mr-0.5 ${!card.isPositive && "rotate-180"}`} />
                    {card.change}
                  </span>
                )}
                <span className="text-[9px] text-[#94a3b8] truncate">{card.subtext}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. SEARCH & FILTER TOOLBAR                                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white p-3 rounded-xl border border-[#e2e8f0] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-[12px] focus:outline-none focus:border-[#1a6de1] transition-colors"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none bg-[#f8fafc] border border-[#cbd5e1] text-[#334155] text-[12px] font-semibold py-1.5 pl-3 pr-7 rounded-lg cursor-pointer focus:outline-none"
            >
              <option value="All Roles">All Roles</option>
              <option value="Counsellor">Counsellor</option>
              <option value="Senior Counsellor">Senior Counsellor</option>
              <option value="Admission Officer">Admission Officer</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="admin">Super Admin</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[9px] pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-[#f8fafc] border border-[#cbd5e1] text-[#334155] text-[12px] font-semibold py-1.5 pl-3 pr-7 rounded-lg cursor-pointer focus:outline-none"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[9px] pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none bg-[#f8fafc] border border-[#cbd5e1] text-[#334155] text-[12px] font-semibold py-1.5 pl-3 pr-7 rounded-lg cursor-pointer focus:outline-none"
            >
              <option value="All Departments">All Departments</option>
              <option value="Counselling">Counselling</option>
              <option value="Admissions">Admissions</option>
              <option value="Marketing">Marketing</option>
              <option value="Management">Management</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[9px] pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportUsersCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] text-[12px] font-bold rounded-lg transition-colors cursor-pointer"
          >
            <FaDownload className="text-[#64748b] text-[11px]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-[12px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FaPlus className="text-[10px]" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. MAIN TABLE & SIDEBAR SUMMARY LAYOUT                         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── Table (Span 8) ── */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-3">Role & Dept</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Joined On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[12px]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#64748b]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[12px]">Loading team members from DB...</span>
                      </div>
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[#64748b]">
                      No users found matching filters.
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => {
                    const initials = u.name
                      ? u.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : "US";

                    return (
                      <tr key={u._id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#f3e8ff] text-[#9333ea] font-bold text-xs flex items-center justify-center">
                                {initials}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-[#0f172a] block leading-tight">{u.name}</span>
                              <span className="text-[11px] text-[#64748b]">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#f3e8ff] text-[#9333ea] text-[10px] font-bold inline-block mb-0.5">
                            {u.role || "Counsellor"}
                          </span>
                          <span className="text-[10px] text-[#64748b] block">{u.department || "Counselling"}</span>
                        </td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                              u.status === "Active"
                                ? "bg-[#e6f9f0] text-[#10b981] border-[#10b981]/30 hover:bg-[#d1fae5]"
                                : "bg-[#fff1f2] text-[#e11d48] border-[#e11d48]/30 hover:bg-[#ffe4e6]"
                            }`}
                          >
                            {u.status || "Active"}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-[#64748b] text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString("en-IN")}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(u)}
                              title="Toggle Status"
                              className="p-1.5 text-[#64748b] hover:text-[#6366f1] hover:bg-[#f1f5f9] rounded-lg transition-colors cursor-pointer"
                            >
                              <FaBan className="text-[11px]" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              title="Delete User"
                              className="p-1.5 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg transition-colors cursor-pointer"
                            >
                              <FaTrash className="text-[11px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Sidebar Analytics (Span 4) ── */}
        <div className="lg:col-span-4 space-y-4">
          {/* Role Distribution */}
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs">
            <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Role Breakdown</h3>
            <div className="space-y-2.5">
              {roleDist.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-[#475569]">{item.role}</span>
                    <span className="text-[#0f172a] font-bold">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (item.count / Math.max(usersList.length, 1)) * 100)}%` }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs">
            <h3 className="text-[14px] font-bold text-[#0f172a] mb-3">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#f4f0ff] hover:bg-[#ebdfff] transition-colors border border-[#e9d8ff] group text-center cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-white text-[#7c3aed] flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
                  <FaUserPlus className="text-sm" />
                </div>
                <span className="text-[10px] font-bold text-[#5b21b6] leading-tight">
                  Add New User
                </span>
              </button>

              <button
                onClick={exportUsersCSV}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#eff6ff] hover:bg-[#dbeafe] transition-colors border border-[#bfdbfe] group text-center cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-white text-[#2563eb] flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
                  <FaDownload className="text-sm" />
                </div>
                <span className="text-[10px] font-bold text-[#1e40af] leading-tight">
                  Export CSV Report
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MODAL: ADD NEW USER                                           */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#e2e8f0]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] mb-4">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Add New User</h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#1a6de1]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@admission.com"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#1a6de1]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#1a6de1]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#1a6de1]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[12px] font-bold text-[#334155] mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#1a6de1]"
                    >
                      <option value="Counsellor">Counsellor</option>
                      <option value="Senior Counsellor">Senior Counsellor</option>
                      <option value="Admission Officer">Admission Officer</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="admin">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#334155] mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#1a6de1]"
                    >
                      <option value="Counselling">Counselling</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Management">Management</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 text-[12px] font-semibold text-[#64748b] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2 text-[12px] font-bold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    {formSubmitting ? "Creating..." : "Create User"}
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
