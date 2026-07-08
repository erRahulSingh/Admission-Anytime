"use client";

import React, { useEffect, useState } from "react";
import {
  FaServicestack,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { ServiceModel } from "@/types";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("FaUserTie");
  const [desc, setDesc] = useState("");
  const [order, setOrder] = useState(0);

  // Edit Form State
  const [editingService, setEditingService] = useState<ServiceModel | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIcon, setEditIcon] = useState("FaUserTie");
  const [editDesc, setEditDesc] = useState("");
  const [editOrder, setEditOrder] = useState(0);

  async function loadServices() {
    try {
      setLoading(true);
      const data: any = await api.get("/services");
      if (data && data.success) {
        setServices(data.services);
      }
    } catch (err: unknown) {
      console.warn("Failed retrieving services. Utilizing fallback database.");
      setServices([
        {
          _id: "s-1",
          title: "Career Counseling",
          icon: "FaUserTie",
          description: "One-on-one sessions to align student scores and budgets.",
          order: 1,
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  // Open Edit Modal
  const handleEditClick = (service: ServiceModel) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditIcon(service.icon || "FaUserTie");
    setEditDesc(service.description);
    setEditOrder(service.order || 0);
  };

  // Submit Add Service
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;

    const payload = {
      title,
      icon,
      description: desc,
      order,
    };

    try {
      await api.post("/services", payload);
      resetAddForm();
      setShowAddForm(false);
      loadServices();
    } catch (err: unknown) {
      console.error(err);
      // Local fallback addition
      const mockService: ServiceModel = {
        _id: "mock-service-" + Date.now(),
        title,
        icon,
        description: desc,
        order,
        createdAt: new Date().toISOString(),
      };
      setServices(prev => [...prev, mockService].sort((a, b) => a.order - b.order));
      setShowAddForm(false);
      resetAddForm();
    }
  };

  // Submit Edit Service
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const payload = {
      title: editTitle,
      icon: editIcon,
      description: editDesc,
      order: editOrder,
    };

    try {
      await api.put(`/services/${editingService._id}`, payload);
      setEditingService(null);
      loadServices();
    } catch (err: unknown) {
      console.error(err);
      // Local fallback update
      setServices(prev =>
        prev
          .map(s => (s._id === editingService._id ? { ...s, ...payload } : s))
          .sort((a, b) => a.order - b.order)
      );
      setEditingService(null);
    }
  };

  const resetAddForm = () => {
    setTitle("");
    setIcon("FaUserTie");
    setDesc("");
    setOrder(0);
  };

  // Delete Service
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      loadServices();
    } catch (err: unknown) {
      console.error(err);
      setServices(prev => prev.filter(s => s._id !== id));
    }
  };

  // Client side search filtration
  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate Metrics
  const totalCount = services.length;
  const maxOrder = services.length > 0 ? Math.max(...services.map(s => s.order)) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* ═══ 1. Title & Action Bar ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0c2e60] tracking-wide uppercase">
            Manage Services Offered
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Configure student packages, adjust sequence weights, and update landing page feature cards.
          </p>
        </div>
        <button
          onClick={() => { resetAddForm(); setShowAddForm(true); }}
          className="flex items-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-blue-900/10 transition-all uppercase tracking-wider hover:-translate-y-0.5 active:scale-95 duration-200"
        >
          <FaPlus size={10} /> Add Service
        </button>
      </div>

      {/* ═══ 2. CRM Stats Tickers ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Total Active Offerings", count: totalCount, color: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-350" },
          { label: "Maximum Priority Rank", count: maxOrder, color: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-350" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className={`p-4 border rounded-2xl flex flex-col justify-between ${item.color} shadow-sm select-none cursor-pointer transition-colors duration-200`}
          >
            <span className="text-[10px] uppercase font-black tracking-wider opacity-85">{item.label}</span>
            <span className="text-2xl font-black mt-1 leading-none">{item.count}</span>
          </motion.div>
        ))}
      </div>

      {/* ═══ 3. Search Bar ═══ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch size={12} />
          </span>
          <input
            type="text"
            placeholder="Search by service title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          />
        </div>
      </div>

      {/* ═══ 4. Services Offered Cards Grid ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-slate-400 font-semibold border rounded-2xl shadow-sm italic">
            <FaInfoCircle className="inline-block mr-1.5" /> No service cards registered.
          </div>
        ) : (
          filteredServices.map((s) => (
            <motion.div
              key={s._id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-blue-50 text-[#0c2e60] rounded-xl flex items-center justify-center border border-blue-100 shadow-sm text-sm">
                    <FaServicestack />
                  </div>
                  <span className="text-[9px] bg-slate-100 border border-slate-250 text-slate-550 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                    Priority: {s.order}
                  </span>
                </div>
                <h3 className="font-black text-sm text-[#0c2e60]">{s.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  {s.description}
                </p>
              </div>

              <div className="border-t pt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEditClick(s)}
                  className="p-2 border border-slate-150 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                  title="Edit details"
                >
                  <FaEdit size={11} />
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="p-2 border border-slate-150 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                  title="Remove service offering"
                >
                  <FaTrash size={11} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ═══ 5. Add Service Modal (Framer Motion transitions) ═══ */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl relative z-10"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Register Service Offering
              </h3>
              
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Service Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Travel & Departure Support"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">React Icon Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. FaUserTie"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Display Sort Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Short Description</label>
                  <textarea
                    rows={4}
                    placeholder="Summarize the support scope details..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold rounded-xl text-xs shadow-md uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ 6. Edit Service Modal (Framer Motion transitions) ═══ */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl relative z-10"
            >
              <button
                onClick={() => setEditingService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Edit Service Offering
              </h3>
              
              <form onSubmit={handleUpdateService} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Service Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">React Icon Tag</label>
                    <input
                      type="text"
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Display Sort Order</label>
                    <input
                      type="number"
                      value={editOrder}
                      onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Short Description</label>
                  <textarea
                    rows={4}
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold rounded-xl text-xs shadow-md uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Save Changes
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
