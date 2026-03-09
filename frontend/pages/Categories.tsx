import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import { Category } from "../types";
import { Edit2, Trash2, Check, X, Plus, Search, Folder } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const Categories: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.categories.list();
      setCategories(data);
    } catch (err) {
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await api.categories.create({ name: name.trim() });
      setName("");
      showToast("Category created successfully", "success");
      await fetchCategories();
    } catch (err: any) {
      showToast(err.message || "Failed to create category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category? This might affect products linked to it.")) return;

    try {
      await api.categories.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Category deleted", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to delete category", "error");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;

    try {
      await api.categories.update(id, { name: editName.trim() });
      setEditingId(null);
      setEditName("");
      showToast("Category updated", "success");
      await fetchCategories();
    } catch (err: any) {
      showToast(err.message || "Failed to update category", "error");
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Form - Sidebar style on desktop, Top on mobile */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black">
                <Plus size={20} />
              </div>
              <h2 className="text-lg font-black">New Category</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Category Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Stationery, Packaging"
                  className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 transition-all"
                />
              </div>

              <button
                disabled={submitting || !name.trim()}
                className="w-full py-4 rounded-2xl font-black text-sm bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg"
              >
                {submitting ? "Creating..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between px-2">
            <div className="relative flex-1 max-w-sm group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={16} />
              <input
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 transition-all"
              />
            </div>
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
              {filteredCategories.length} Total
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-3xl animate-pulse bg-neutral-200 dark:bg-neutral-900" />
                ))
              ) : filteredCategories.length === 0 ? (
                <div className="col-span-full py-20 text-center text-neutral-400 italic bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800">
                  No categories found.
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <motion.div
                    layout
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                        <Folder size={20} />
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingId === category.id ? (
                          <>
                            <button onClick={() => handleUpdate(category.id)} className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 transition-colors">
                              <Check size={16} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-400">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingId(category.id); setEditName(category.name); }} className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(category.id)} className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-400 hover:text-rose-600 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {editingId === category.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(category.id)}
                        className="w-full rounded-xl px-3 py-2 text-sm bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
                      />
                    ) : (
                      <div>
                        <h3 className="font-black text-neutral-900 dark:text-white truncate">{category.name}</h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Category ID: #{category.id}</p>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
