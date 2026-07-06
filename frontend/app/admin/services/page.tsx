"use client";

import React, { useEffect, useState } from "react";
import { FaServicestack, FaPlus, FaTrash } from "react-icons/fa";
import api from "@/services/api";
import { ServiceModel } from "@/types";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("FaUserTie");
  const [desc, setDesc] = useState("");
  const [order, setOrder] = useState(0);

  async function loadServices() {
    try {
      setLoading(true);
      const data: any = await api.get("/services");
      if (data && data.success) {
        setServices(data.services);
      }
    } catch (err) {
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
      setTitle("");
      setDesc("");
      setOrder(0);
      setShowAddForm(false);
      loadServices();
    } catch (err) {
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
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      loadServices();
    } catch (err) {
      console.error(err);
      setServices(prev => prev.filter(s => s._id !== id));
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
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-dark">Manage Services Offered</h1>
          <p className="text-xs text-text-muted">Inspect services card definitions and update sorting priorities.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
        >
          <FaPlus /> Add Service
        </button>
      </div>

      {/* Add Form modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-premium border p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl relative z-10">
            <h3 className="font-extrabold text-lg text-text-dark">Register Service Offering</h3>
            
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Service Title</label>
                <input
                  type="text"
                  placeholder="e.g. Travel & Departure"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">React Icon Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. FaUserTie"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Short Description</label>
                <textarea
                  rows={4}
                  placeholder="Summarize the support scope details..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s._id} className="bg-white p-6 rounded-premium border border-slate-100 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center text-sm">
                  <FaServicestack />
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">Priority: {s.order}</span>
              </div>
              <h3 className="font-extrabold text-sm text-text-dark">{s.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {s.description}
              </p>
            </div>

            <div className="border-t pt-4 flex justify-end">
              <button
                onClick={() => handleDelete(s._id)}
                className="p-2 border border-slate-100 text-slate-500 hover:text-red-500 rounded-lg text-xs"
                title="Remove service offering"
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
