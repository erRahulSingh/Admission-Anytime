"use client";

import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaTimes,
  FaInfoCircle,
  FaBookOpen,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { BlogModel } from "@/types";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [author, setAuthor] = useState("MBBS Advisor Team");
  const [status, setStatus] = useState<"Draft" | "Published">("Published");

  // Edit Form State
  const [editingBlog, setEditingBlog] = useState<BlogModel | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFeaturedImage, setEditFeaturedImage] = useState("");
  const [editAuthor, setEditAuthor] = useState("MBBS Advisor Team");
  const [editStatus, setEditStatus] = useState<"Draft" | "Published">("Published");

  async function loadBlogs() {
    try {
      setLoading(true);
      const data: any = await api.get("/blogs/all");
      if (data && data.success) {
        setBlogs(data.blogs);
      }
    } catch (err: unknown) {
      console.warn("Failed retrieving blogs. Utilizing fallback database.");
      setBlogs([
        {
          _id: "blog-1",
          title: "NMC New Guidelines for MBBS Abroad",
          slug: "nmc-new-guidelines-for-mbbs-abroad",
          excerpt: "Detailed analysis of the latest guidelines issued by the National Medical Commission (NMC).",
          content: "The National Medical Commission (NMC) has set strict regulations for Indian students...",
          featuredImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
          author: "Chief Education Advisor",
          status: "Published",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "blog-2",
          title: "MBBS Admission Abroad in 2026",
          slug: "mbbs-admission-abroad-in-2026",
          excerpt: "Confused about choosing the best destination? Here are the top countries.",
          content: "Studying MBBS abroad is a dream for many medical aspirants in India...",
          featuredImage: "https://images.unsplash.com/photo-1584515901367-f134981d40e1?q=80&w=600&auto=format&fit=crop",
          author: "Counselor Neha Verma",
          status: "Draft",
          createdAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleEditClick = (blog: BlogModel) => {
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditExcerpt(blog.excerpt);
    setEditContent(blog.content);
    setEditFeaturedImage(blog.featuredImage || "");
    setEditAuthor(blog.author || "MBBS Advisor Team");
    setEditStatus(blog.status);
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) return;

    const payload = {
      title,
      excerpt,
      content,
      featuredImage,
      author,
      status,
    };

    try {
      await api.post("/blogs", payload);
      resetAddForm();
      setShowAddForm(false);
      loadBlogs();
    } catch (err: unknown) {
      console.error(err);
      const mockBlog: BlogModel = {
        _id: "mock-blog-" + Date.now(),
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        excerpt,
        content,
        featuredImage,
        author,
        status,
        createdAt: new Date().toISOString(),
      };
      setBlogs(prev => [mockBlog, ...prev]);
      setShowAddForm(false);
      resetAddForm();
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    const payload = {
      title: editTitle,
      excerpt: editExcerpt,
      content: editContent,
      featuredImage: editFeaturedImage,
      author: editAuthor,
      status: editStatus,
    };

    try {
      await api.put(`/blogs/${editingBlog._id}`, payload);
      setEditingBlog(null);
      loadBlogs();
    } catch (err: unknown) {
      console.error(err);
      setBlogs(prev =>
        prev.map(b =>
          b._id === editingBlog._id
            ? { ...b, ...payload, slug: editTitle.toLowerCase().replace(/\s+/g, "-") }
            : b
        )
      );
      setEditingBlog(null);
    }
  };

  const resetAddForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setFeaturedImage("");
    setAuthor("MBBS Advisor Team");
    setStatus("Published");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      loadBlogs();
    } catch (err: unknown) {
      console.error(err);
      setBlogs(prev => prev.filter(b => b._id !== id));
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = blogs.length;
  const publishedCount = blogs.filter(b => b.status === "Published").length;
  const draftCount = blogs.filter(b => b.status === "Draft").length;

  return (
    <div className="space-y-8">
      {/* Title & Header Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0c2e60] tracking-wide uppercase">
            Manage Blog Posts
          </h1>
          <p className="text-xs text-slate-400 font-semibold">
            Publish guide articles, write notifications, and edit informational resources for prospective students.
          </p>
        </div>
        <button
          onClick={() => { resetAddForm(); setShowAddForm(true); }}
          className="flex items-center gap-2 bg-[#0c2e60] hover:bg-[#0a2550] text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-blue-900/10 transition-all uppercase tracking-wider hover:-translate-y-0.5 active:scale-95 duration-200"
        >
          <FaPlus size={10} /> Add Blog Post
        </button>
      </div>

      {/* Stats Ticker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Articles", count: totalCount, color: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-350" },
          { label: "Published", count: publishedCount, color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-350" },
          { label: "Drafts", count: draftCount, color: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-350" },
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
            placeholder="Search by article title or author..."
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
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-[#0c2e60] text-[#f9a825] font-black uppercase tracking-wider">
                <th className="py-4 px-6 text-[10px]">Article Details</th>
                <th className="py-4 px-6 text-[10px]">Author</th>
                <th className="py-4 px-6 text-[10px]">Status</th>
                <th className="py-4 px-6 text-[10px]">Date Created</th>
                <th className="py-4 px-6 text-right text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-text-dark font-semibold divide-y divide-slate-100">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold italic">
                    <FaInfoCircle className="inline-block mr-1.5" /> No articles found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition-colors duration-200">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#0c2e60] text-sm flex-shrink-0">
                        <FaBookOpen />
                      </div>
                      <div>
                        <span className="font-black text-sm text-[#0c2e60] block leading-tight">{b.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 max-w-xs truncate">{b.excerpt}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-600">{b.author || "MBBS Advisor Team"}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block ${
                        b.status === "Published" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {new Date(b.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(b)}
                        className="p-2 border border-slate-100 hover:border-blue-200 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block cursor-pointer"
                        title="Edit post"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-2 border border-slate-100 hover:border-red-200 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95 inline-block cursor-pointer"
                        title="Delete post"
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

      {/* Add Blog Modal */}
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
                Add New Blog Post
              </h3>

              <form onSubmit={handleAddBlog} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Article Title</label>
                    <input
                      type="text"
                      placeholder="e.g. How to Choose Between MBBS in Russia and Georgia"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Author Name</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Featured Image URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Short Excerpt</label>
                    <textarea
                      placeholder="Brief 1-2 sentence description of the article..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Full Article Content</label>
                    <textarea
                      placeholder="Write your blog post content here (supports Markdown)..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
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
                    Publish Post
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Blog Modal */}
      <AnimatePresence>
        {editingBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingBlog(null)}
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
                onClick={() => setEditingBlog(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <h3 className="font-black text-base md:text-lg text-[#0c2e60] tracking-wide uppercase border-b pb-2">
                Edit Blog Post
              </h3>

              <form onSubmit={handleUpdateBlog} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Article Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Author Name</label>
                    <input
                      type="text"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Featured Image URL</label>
                    <input
                      type="text"
                      value={editFeaturedImage}
                      onChange={(e) => setEditFeaturedImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Short Excerpt</label>
                    <textarea
                      value={editExcerpt}
                      onChange={(e) => setEditExcerpt(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Full Article Content</label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={8}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#3b82f6] transition-all"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingBlog(null)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-500 font-bold rounded-xl text-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0c2e60] text-white font-extrabold rounded-xl text-xs hover:bg-[#0a2550] shadow-md hover:shadow-blue-900/10 active:scale-95 transition-all cursor-pointer"
                  >
                    Update Post
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
