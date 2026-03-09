import React, { useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../api";
import { Product, Category } from "../types";
import { Plus, Trash2, Pencil, Search, AlertTriangle, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";

const Inventory: React.FC = () => {
  const { showToast } = useToast();
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
    unit_price: ""
  });

  const fetchData = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([
        api.products.list(),
        api.categories.list(),
      ]);
      setProducts(p.filter((p) => p.is_active));
      setCategories(c);
    } catch (err: any) {
      showToast("Failed to fetch inventory data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const categoryName = categories.find((c) => c.id === p.category)?.name || "";
      return (
        p.name.toLowerCase().includes(q) ||
        (p.variant || "").toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q)
      );
    });
  }, [search, products, categories]);

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm({ name: "", variant: "", category: "", unit_price: "" });
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ name: "", variant: "", category: "", unit_price: "" });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      variant: product.variant || "",
      category: String(product.category),
      unit_price: String(product.unit_price)
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      showToast("Please select a category", "info");
      return;
    }

    const payload = {
      name: form.name.trim(),
      variant: form.variant.trim() || null,
      category: Number(form.category),
      unit_price: Number(form.unit_price) || 0
    };

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, payload);
        showToast("Product updated", "success");
      } else {
        await api.products.create(payload);
        showToast("Product created", "success");
      }
      closeModal();
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Action failed", "error");
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm("Are you sure? This will hide the product from billing.")) return;
    try {
      await api.products.update(id, { is_active: false });
      showToast("Product deactivated", "info");
      fetchData();
    } catch {
      showToast("Operation failed", "error");
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500 font-medium">Manage your products and stock levels.</p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-sm font-bold shadow-xl transition-transform active:scale-95"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
        <input
          placeholder="Search name, category, variant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 transition-all"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="p-5 font-black uppercase tracking-widest text-[10px] text-neutral-400">Product Info</th>
              <th className="p-5 font-black uppercase tracking-widest text-[10px] text-neutral-400">Category</th>
              <th className="p-5 font-black uppercase tracking-widest text-[10px] text-neutral-400 text-center">Unit Price</th>
              <th className="p-5 font-black uppercase tracking-widest text-[10px] text-neutral-400 text-center">Stock</th>
              <th className="p-5 font-black uppercase tracking-widest text-[10px] text-neutral-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-neutral-400 italic">Loading inventory...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-neutral-400 italic">No products found matching your search.</td></tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">{p.name}</div>
                        <div className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">{p.variant || "Standard"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-bold text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                      {categories.find((c) => c.id === p.category)?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="p-5 text-center font-bold">₹{Number(p.unit_price).toLocaleString()}</td>
                  <td className="p-5 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-xs border border-transparent">
                      <span className={p.stock_quantity <= 5 ? "text-rose-500" : "text-emerald-500"}>
                        {p.stock_quantity} <span className="text-[10px] opacity-60">UNITS</span>
                      </span>
                      {p.stock_quantity <= 5 && <AlertTriangle size={14} className="text-rose-500 animate-pulse" />}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-black dark:hover:text-white transition-all">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDeactivate(p.id)} className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-neutral-400 hover:text-rose-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white leading-tight">{p.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{p.variant || 'Standard'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black">₹{Number(p.unit_price).toLocaleString()}</div>
                <div className={`text-sm font-black flex items-center gap-1 justify-end ${p.stock_quantity <= 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {p.stock_quantity} <span className="text-[10px] opacity-60">UNITS</span>
                  {p.stock_quantity <= 5 && <AlertTriangle size={14} />}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
               <span className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[10px] font-black uppercase text-neutral-500">
                  {categories.find((c) => c.id === p.category)?.name || "—"}
               </span>
               <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-400">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDeactivate(p.id)} className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500">
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.form onSubmit={handleSubmit} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl"
            >
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-black/20">
                <h2 className="text-lg font-black">{editingProduct ? "Edit Product" : "New Product"}</h2>
                <button type="button" onClick={closeModal} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors"><XIcon size={20} /></button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Product Name</label>
                  <input placeholder="E.g. Packing Tape" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-2xl p-4 text-sm bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Variant (Optional)</label>
                    <input placeholder="E.g. 2 inch" value={form.variant} onChange={(e) => setForm({ ...form, variant: e.target.value })}
                      className="w-full rounded-2xl p-4 text-sm bg-neutral-100 dark:bg-black border border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Selling Price</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
                       <input type="number" placeholder="0.00" required value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                        className="w-full rounded-2xl p-4 pl-8 text-sm bg-neutral-100 dark:bg-black border border-transparent outline-none transition-all"
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Category</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-2xl p-4 text-sm bg-neutral-100 dark:bg-black border border-transparent outline-none appearance-none transition-all"
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
              </div>

              <div className="p-6 bg-neutral-50/50 dark:bg-black/20 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-sm font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors">Cancel</button>
                <button className="rounded-xl bg-black text-white dark:bg-white dark:text-black px-8 py-3 text-sm font-black shadow-lg transition-transform active:scale-95">Save Changes</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const XIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default Inventory;
