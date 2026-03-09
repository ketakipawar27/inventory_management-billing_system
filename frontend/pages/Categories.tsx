import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import { Category } from "../types";
import { Edit2, Trash2, Check, X, Plus, Search, Folder } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";

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
        {/* Create Form */}
        <div className="lg:col-span-4 sticky top-24">
          <Card className="p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black">
                <Plus size={20} />
              </div>
              <h2 className="text-lg font-black tracking-tight">New Category</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <Input
                label="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Stationery, Packaging"
              />

              <Button
                type="submit"
                className="w-full py-4 shadow-lg"
                isLoading={submitting}
                disabled={!name.trim()}
              >
                Add Category
              </Button>
            </form>
          </Card>
        </div>

        {/* List Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between px-2">
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16} />}
              className="max-w-sm"
            />
            <Badge variant="outline" className="px-3 py-1.5 h-fit">
              {filteredCategories.length} Total
            </Badge>
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
                  >
                    <Card hoverable className="p-5 group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                          <Folder size={20} />
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {editingId === category.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdate(category.id)}
                                className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                icon={<Check size={16} />}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingId(null)}
                                icon={<X size={16} />}
                              />
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setEditingId(category.id); setEditName(category.name); }}
                                icon={<Edit2 size={16} />}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(category.id)}
                                className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                icon={<Trash2 size={16} />}
                              />
                            </>
                          )}
                        </div>
                      </div>

                      {editingId === category.id ? (
                        <Input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate(category.id)}
                          size="sm"
                        />
                      ) : (
                        <div>
                          <h3 className="font-black text-neutral-900 dark:text-white truncate tracking-tight">{category.name}</h3>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Category ID: #{category.id}</p>
                        </div>
                      )}
                    </Card>
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
