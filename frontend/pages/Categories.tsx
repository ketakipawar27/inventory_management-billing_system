import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Category } from "../types";
import { Tag, Edit2, Trash2, Check, X } from "lucide-react";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await api.categories.list();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await api.categories.create({ name: name.trim() });
      setName("");
      await fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;

    try {
      await api.categories.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;

    try {
      await api.categories.update(id, { name: editName.trim() });
      setEditingId(null);
      setEditName("");
      await fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to update category");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Create */}
      <div className="lg:col-span-1">
        <div
          className="
            p-8 rounded-3xl space-y-6
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
          "
        >
          <h2 className="text-xl font-bold">New Category</h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Boxes, Tapes"
              className="
                w-full rounded-xl px-4 py-3 text-sm outline-none
                bg-neutral-100 dark:bg-black
                border border-neutral-200 dark:border-neutral-800
                focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700
              "
            />

            <button
              disabled={submitting}
              className="
                w-full py-3 rounded-xl font-bold
                bg-black text-white
                dark:bg-white dark:text-black
                hover:opacity-90 disabled:opacity-50
              "
            >
              {submitting ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">All Categories</h2>
          <span className="text-xs text-neutral-500 font-bold">
            {categories.length} TOTAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl animate-pulse bg-neutral-200 dark:bg-neutral-900"
              />
            ))
          ) : categories.length === 0 ? (
            <div className="text-neutral-500 text-sm">
              No categories yet.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="
                  p-6 rounded-2xl
                  bg-neutral-100 dark:bg-neutral-900
                  border border-neutral-200 dark:border-neutral-800
                  hover:shadow-sm transition
                "
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="
                      p-2 rounded-xl
                      bg-white dark:bg-black
                      border border-neutral-200 dark:border-neutral-800
                    "
                  >
                    <Tag size={16} />
                  </div>

                  <div className="flex gap-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="text-emerald-500"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-neutral-500"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(category.id);
                            setEditName(category.name);
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingId === category.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="
                      w-full rounded-lg px-3 py-2 text-sm
                      bg-white dark:bg-black
                      border border-neutral-200 dark:border-neutral-800
                    "
                  />
                ) : (
                  <h3 className="font-bold">{category.name}</h3>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
