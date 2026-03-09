import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import { Category } from "../types";
import { Edit2, Trash2, Check, X, Plus, Search, Folder } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";

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
    <div className="space-y-6 pb-20 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
      {/* 1. Page Header - Consistency with Inventory & Dashboard */}
      <PageHeader
        description="Manage and organize your product groups"
        className="mb-4"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* 2. New Category Form Card (Left Column) - Compact Refinement */}
        <div className="lg:col-span-4 lg:sticky lg:top-0">
          <Card className="p-5 shadow-sm border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black">
                <Plus size={14} strokeWidth={3} />
              </div>
              <h2 className="font-black text-[11px] tracking-wider uppercase">New Category</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <Input
                label="CATEGORY NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Electronics"
                className="h-10 text-xs bg-neutral-100/50 dark:bg-black border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 rounded-xl px-3"
              />

              <Button
                type="submit"
                className="w-full h-10 shadow-sm font-black text-[10px] uppercase tracking-widest rounded-xl"
                isLoading={submitting}
                disabled={!name.trim()}
              >
                Add Category
              </Button>
            </form>
          </Card>
        </div>

        {/* 3. List & Search Section (Right Column) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Balanced Search Field */}
          <div className="max-w-md">
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16} className="text-neutral-400" />}
              className="h-10 text-xs shadow-sm bg-neutral-100/50 dark:bg-black border-transparent rounded-xl px-3"
            />
          </div>

          <div className="space-y-4">
            {/* Stronger Header Hierarchy */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                Category List
              </h2>
              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700/50">
                {filteredCategories.length} Total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-2xl animate-pulse bg-neutral-100 dark:bg-neutral-900" />
                  ))
                ) : filteredCategories.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-neutral-400 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                    No categories found.
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <motion.div
                      layout
                      key={category.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Card className="p-3 group relative overflow-hidden border-neutral-200/60 dark:border-neutral-800/60 shadow-sm rounded-xl bg-white dark:bg-neutral-900">
                        <div className="flex items-center gap-3">
                          {/* Compact & Balanced Icon */}
                          <div className="shrink-0 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-all">
                            <Folder size={16} />
                          </div>

                          <div className="flex-1 min-w-0">
                            {editingId === category.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  autoFocus
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(category.id)}
                                  className="h-8 py-0.5 text-xs border-neutral-200 rounded-lg px-2"
                                />
                                <div className="flex gap-1 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdate(category.id)}
                                    className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50"
                                    icon={<Check size={14} />}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingId(null)}
                                    className="h-8 w-8 p-0"
                                    icon={<X size={14} />}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <h3 className="font-bold text-neutral-900 dark:text-white truncate text-[13px] tracking-tight leading-none">
                                    {category.name}
                                  </h3>
                                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-tight mt-1">
                                    ID: #{category.id}
                                  </p>
                                </div>

                                {/* Actions with tighter grouping */}
                                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setEditingId(category.id); setEditName(category.name); }}
                                    className="h-7 w-7 p-0 text-neutral-400 hover:text-black dark:hover:text-white rounded-md"
                                    icon={<Edit2 size={12} />}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(category.id)}
                                    className="h-7 w-7 p-0 text-neutral-400 hover:text-rose-500 rounded-md"
                                    icon={<Trash2 size={12} />}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
