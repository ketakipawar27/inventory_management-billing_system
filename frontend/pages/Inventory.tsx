import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Product, Category } from "../types";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    variant: "",
    category: "",
  });

  /* ---------------- DATA ---------------- */

  const fetchData = async () => {
    try {
      const [p, c] = await Promise.all([
        api.products.list(),
        api.categories.list(),
      ]);
      setProducts(p.filter((p) => p.is_active));
      setCategories(c);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const category =
        categories.find((c) => c.id === p.category)?.name || "";
      return (
        p.name.toLowerCase().includes(q) ||
        (p.variant || "").toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        String(p.stock_quantity).includes(q)
      );
    });
  }, [search, products, categories]);

  /* ---------------- MODAL HELPERS ---------------- */

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm({ name: "", variant: "", category: "" });
  };

  /* ---------------- ACTIONS ---------------- */

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ name: "", variant: "", category: "" });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      variant: product.variant || "",
      category: String(product.category),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category) {
      alert("Please select a category");
      return;
    }

    const payload = {
      name: form.name.trim(),
      variant: form.variant.trim() || null,
      category: Number(form.category),
    };

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, payload);
      } else {
        await api.products.create(payload);
      }

      closeModal();
      fetchData();
    } catch (err: any) {
      if (err.message?.includes("unique")) {
        alert(
          "This product already exists.\n\n" +
          "Please edit the existing product or restock it from Purchases."
        );
      } else {
        alert(err.message || "Failed to save product");
      }
    }

  };

  const handleDeactivate = async (id: number) => {
    if (!confirm("Deactivate this product?")) return;

    try {
      await api.products.update(id, { is_active: false });
      fetchData();
    } catch {
      alert("Failed to deactivate product");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 text-sm font-semibold"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          placeholder="Search product, category or stock…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none
            bg-neutral-100 dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
            focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700
          "
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 md:block">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-900/70">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-neutral-500">
                  Loading inventory…
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-neutral-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                >
                  <td className="p-4 font-medium">
                    {p.name}
                    {p.variant && (
                      <span className="ml-1 text-xs text-neutral-500">
                        ({p.variant})
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {categories.find((c) => c.id === p.category)?.name || "—"}
                  </td>
                  <td className="p-4 font-semibold text-emerald-500">
                    {p.stock_quantity}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="mr-3 text-neutral-500 hover:text-black dark:hover:text-white"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeactivate(p.id)}
                      className="text-rose-500 hover:text-rose-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{p.name}</p>
                {p.variant && (
                  <p className="text-xs text-neutral-500">{p.variant}</p>
                )}
                <p className="mt-1 text-sm text-neutral-400">
                  {categories.find((c) => c.id === p.category)?.name}
                </p>
              </div>
              <p className="text-lg font-bold text-emerald-500">
                {p.stock_quantity}
              </p>
            </div>

            <div className="mt-3 flex justify-end gap-4">
              <button onClick={() => openEdit(p)}>
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDeactivate(p.id)}
                className="text-rose-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="
                w-full max-w-lg space-y-4 rounded-3xl p-6
                bg-white dark:bg-neutral-900
                border border-neutral-200 dark:border-neutral-800
                text-neutral-900 dark:text-white
              "
            >
              <h2 className="text-lg font-semibold">
                {editingProduct ? "Edit Product" : "New Product"}
              </h2>

              <input
                placeholder="Product name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full rounded-xl p-3 text-sm bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800"
              />

              <input
                placeholder="Variant (optional)"
                value={form.variant}
                onChange={(e) =>
                  setForm({ ...form, variant: e.target.value })
                }
                className="w-full rounded-xl p-3 text-sm bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800"
              />

              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full rounded-xl p-3 text-sm bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-neutral-500"
                >
                  Cancel
                </button>
                <button className="rounded-xl bg-black text-white dark:bg-white dark:text-black px-6 py-2 font-semibold">
                  Save
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
