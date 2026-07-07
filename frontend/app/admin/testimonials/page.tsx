"use client";

import React, { useEffect, useState } from "react";
import {
  FaQuoteLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaStar,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { TestimonialModel } from "@/types";

export default function AdminTestimonialsPage() {
  const [reviews, setReviews] = useState<TestimonialModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [status, setStatus] = useState("Active");

  // Edit Form State
  const [editingReview, setEditingReview] = useState<TestimonialModel | null>(null);
  const [editName, setEditName] = useState("");
  const [editUniversity, setEditUniversity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editReviewText, setEditReviewText] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  async function loadTestimonials() {
    try {
      setLoading(true);
      const data: any = await api.get("/testimonials/all");
      if (data && data.success) {
        setReviews(data.testimonials);
      }
    } catch (err) {
      console.warn("Failed retrieving testimonials. Utilizing fallback database.");
      setReviews([
        {
          _id: "test-1",
          name: "Rahul Sharma",
          university: "Tbilisi State Medical University",
          country: "Georgia",
          rating: 5,
          review: "The counseling and visa processing was completely transparent. I received continuous support.",
          status: "Active",
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Open Edit Modal
  const handleEditClick = (review: TestimonialModel) => {
    setEditingReview(review);
    setEditName(review.name);
    setEditUniversity(review.university);
    setEditCountry(review.country);
    setEditRating(review.rating);
    setEditReviewText(review.review);
    setEditStatus(review.status);
  };

  // Submit Add Testimonial
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !university || !country || !reviewText) return;

    const payload = {
      name,
      university,
      country,
      rating,
      review: reviewText,
      status,
    };

    try {
      await api.post("/testimonials", payload);
      resetAddForm();
      setShowAddForm(false);
      loadTestimonials();
    } catch (err) {
      console.error(err);
      // Local fallback addition
      const mockReview: TestimonialModel = {
        _id: "mock-review-" + Date.now(),
        name,
        university,
        country,
        rating,
        review: reviewText,
        status: status as any,
        createdAt: new Date().toISOString(),
      };
      setReviews(prev => [...prev, mockReview]);
      setShowAddForm(false);
      resetAddForm();
    }
  };

  // Submit Edit Testimonial
  const handleUpdateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    const payload = {
      name: editName,
      university: editUniversity,
      country: editCountry,
      rating: editRating,
      review: editReviewText,
      status: editStatus,
    };

    try {
      await api.put(`/testimonials/${editingReview._id}`, payload);
      setEditingReview(null);
      loadTestimonials();
    } catch (err) {
      console.error(err);
      // Local fallback update
      setReviews(prev =>
        prev.map(r =>
          r._id === editingReview._id
            ? { ...r, ...payload }
            : r
        )
      );
      setEditingReview(null);
    }
  };

  const resetAddForm = () => {
    setName("");
    setUniversity("");
    setCountry("");
    setRating(5);
    setReviewText("");
    setStatus("Active");
  };

  // Delete Testimonial
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.delete(`/testimonials/${id}`);
      loadTestimonials();
    } catch (err) {
      console.error(err);
      setReviews(prev => prev.filter(r => r._id !== id));
    }
  };

  // Client side filtration
  const filteredReviews = reviews.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalCount = reviews.length;
  const activeCount = reviews.filter(r => r.status === "Active").length;
  const totalRating = reviews.reduce((a, b) => a + b.rating, 0);
  const avgRating = totalCount > 0 ? (totalRating / totalCount).toFixed(1) : "5.0";

  return (
    <div className="space-y-8">
      
      {/* ═══ 1. Title & Action Bar ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0c2e60] tracking-wide uppercase">
            Manage Student Reviews
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Inspect rating values, approve testimonials, and add new reviewer stories.
          </p>
        </div>
        <button
          onClick={() => { resetAddForm(); setShowAddForm(true); }}
          className="flex items-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-blue-900/10 transition-all uppercase tracking-wider hover:-translate-y-0.5 active:scale-95 duration-200"
        >
          <FaPlus size={10} /> Add Testimonial
        </button>
      </div>

      {/* ═══ 2. Stats Ticker Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Reviews", count: totalCount, color: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-350" },
          { label: "Active Testimonials", count: activeCount, color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-350" },
          { label: "Average Star Rating", count: `${avgRating} ★`, color: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-350" },
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

      {/* ═══ 3. Search Bar ═══ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <FaSearch size={12} />
          </span>
          <input
            type="text"
            placeholder="Search by student or university name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
          />
        </div>
      </div>

      {/* ═══ 4. Testimonials Cards Grid ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-slate-400 font-semibold border rounded-2xl shadow-sm italic">
            <FaInfoCircle className="inline-block mr-1.5" /> No testimonials found matching your criteria.
          </div>
        ) : (
          filteredReviews.map((r) => (
            <motion.div
              key={r._id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <FaQuoteLeft className="text-[#0c2e60]/10 text-3xl" />
                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider inline-block ${
                    r.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {r.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium italic leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  "{r.review}"
                </p>
              </div>

              <div className="border-t pt-4 flex justify-between items-end">
                <div>
                  <h4 className="font-black text-sm text-[#0c2e60]">{r.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{r.university} ({r.country})</span>
                  <div className="flex gap-0.5 text-[#f9a825] mt-1.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <FaStar key={i} size={10} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(r)}
                    className="p-2 border border-slate-150 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                    title="Edit review"
                  >
                    <FaEdit size={11} />
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="p-2 border border-slate-150 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                    title="Remove testimonial"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ═══ 5. Add Testimonial Modal (Framer Motion transitions) ═══ */}
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
              className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Write Student Review
              </h3>
              
              <form onSubmit={handleAddTestimonial} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Student Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">University Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tbilisi State University"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Country</label>
                    <input
                      type="text"
                      placeholder="e.g. Georgia"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Rating Stars</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Review Statement</label>
                  <textarea
                    rows={4}
                    placeholder="Enter the detailed review text..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
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
                    Save Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ 6. Edit Testimonial Modal (Framer Motion transitions) ═══ */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingReview(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingReview(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Edit Student Review
              </h3>
              
              <form onSubmit={handleUpdateTestimonial} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">University Name</label>
                    <input
                      type="text"
                      required
                      value={editUniversity}
                      onChange={(e) => setEditUniversity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Rating Stars</label>
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Review Statement</label>
                  <textarea
                    rows={4}
                    required
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingReview(null)}
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
