"use client";

import React, { useEffect, useState } from "react";
import { FaGlobe, FaPlus, FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import api from "@/services/api";
import { Country } from "@/types";

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [fmge, setFmge] = useState("");
  const [lang, setLang] = useState("English");
  const [benefits, setBenefits] = useState("");
  const [reqs, setReqs] = useState("");
  const [status, setStatus] = useState("Active");
  const [flagUrl, setFlagUrl] = useState("");

  async function loadCountries() {
    try {
      setLoading(true);
      const data: any = await api.get("/countries/all");
      if (data && data.success) {
        setCountries(data.countries);
      }
    } catch (err) {
      console.warn("Failed fetching admin countries. Using fallback database.");
      setCountries([
        {
          _id: "c-1",
          name: "Georgia",
          slug: "georgia",
          flagImage: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=200",
          description: "Georgia is one of the top destinations for MBBS. The medical degrees are globally recognized by WHO, NMC (MCI), and FAIMER, and programs are offered 100% in English.",
          benefits: ["100% English Medium Curriculum", "WHO and NMC Approved Universities"],
          averageCost: "3.5 - 5.5 Lakhs / Year",
          duration: "6 Years",
          fmgePassingRate: "28.4%",
          language: "English",
          requirements: ["50% in PCB in 12th", "NEET Qualification mandatory"],
          status: "Active",
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCountries();
  }, []);

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !desc || !cost || !duration || !fmge) return;

    const benefitsArray = benefits.split(",").map(b => b.trim()).filter(Boolean);
    const reqsArray = reqs.split(",").map(r => r.trim()).filter(Boolean);
    const payload = {
      name,
      description: desc,
      averageCost: cost,
      duration,
      fmgePassingRate: fmge,
      language: lang,
      benefits: benefitsArray,
      requirements: reqsArray,
      status,
      flagImage: flagUrl || "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=200",
    };

    try {
      await api.post("/countries", payload);
      setName("");
      setDesc("");
      setCost("");
      setDuration("");
      setFmge("");
      setBenefits("");
      setReqs("");
      setFlagUrl("");
      setShowAddForm(false);
      loadCountries();
    } catch (err) {
      console.error(err);
      // Local addition fallback
      const mockCountry: Country = {
        _id: "mock-id-" + Date.now(),
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description: desc,
        averageCost: cost,
        duration,
        fmgePassingRate: fmge,
        language: lang,
        benefits: benefitsArray,
        requirements: reqsArray,
        status: status as any,
        flagImage: payload.flagImage,
        createdAt: new Date().toISOString(),
      };
      setCountries(prev => [...prev, mockCountry]);
      setShowAddForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this country profile?")) return;
    try {
      await api.delete(`/countries/${id}`);
      loadCountries();
    } catch (err) {
      console.error(err);
      setCountries(prev => prev.filter(c => c._id !== id));
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
          <h1 className="text-xl md:text-2xl font-black text-text-dark">Manage Study Abroad Countries</h1>
          <p className="text-xs text-text-muted">Create and manage structural data for global destinations.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
        >
          <FaPlus /> Add Country
        </button>
      </div>

      {/* Add form popup */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-premium border p-6 md:p-8 max-w-xl w-full space-y-4 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-text-dark">Create Country Profile</h3>
            
            <form onSubmit={handleAddCountry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Country Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Georgia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Flag Image URL</label>
                  <input
                    type="text"
                    placeholder="e.g. https://...image.jpg"
                    value={flagUrl}
                    onChange={(e) => setFlagUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  placeholder="Summarize benefits, location, safety etc."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tuition Budget (Yr)</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.5 Lakhs / Yr"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Program Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Years"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">FMGE / NExT Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. 28.4%"
                    value={fmge}
                    onChange={(e) => setFmge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Instruction Language</label>
                  <input
                    type="text"
                    placeholder="e.g. English"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Benefits (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 100% English, Safe environment, No donations"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Requirements (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 50% in PCB in 12th, NEET Qualified"
                  value={reqs}
                  onChange={(e) => setReqs(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"
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
                  Save Country
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Country List table */}
      <div className="bg-white rounded-premium border border-slate-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase">
                <th className="py-4 px-6">Country</th>
                <th className="py-4 px-6">Cost</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">FMGE Pass Rate</th>
                <th className="py-4 px-6">Language</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-text-dark font-medium divide-y divide-slate-50">
              {countries.map((c) => (
                <tr key={c._id}>
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-primary-500 font-bold text-sm overflow-hidden border">
                      {c.flagImage ? (
                        <img src={c.flagImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FaGlobe />
                      )}
                    </div>
                    <span className="font-extrabold text-sm block">{c.name}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-primary-500">{c.averageCost}</td>
                  <td className="py-4 px-6">{c.duration}</td>
                  <td className="py-4 px-6 font-bold text-accent-500">{c.fmgePassingRate}</td>
                  <td className="py-4 px-6">{c.language}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      c.status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 border border-slate-100 text-slate-600 hover:text-red-500 rounded-lg"
                      title="Delete profile"
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
