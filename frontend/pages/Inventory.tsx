import React, { useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../api";
import { Product, Category } from "../types";
import { Plus, Trash2, Pencil, Search, AlertTriangle, Package } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { cn } from "../lib/utils";

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
    unit_price: "",
    purchase_price: "",
    min_stock: "5"
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
    setForm({ name: "", variant: "", category: "", unit_price: "", purchase_price: "", min_stock: "5" });
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ name: "", variant: "", category: "", unit_price: "0", purchase_price: "0", min_stock: "5" });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      variant: product.variant || "",
      category: String(product.category),
      unit_price: String(product.unit_price),
      purchase_price: String(product.purchase_price || "0"),
      min_stock: String(product.min_stock)
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
      unit_price: Number(form.unit_price) || 0,
      purchase_price: Number(form.purchase_price) || 0,
      latest_purchase_price: Number(form.purchase_price) || 0,
      min_stock: Number(form.min_stock) || 0
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
    <div className="space-y-5 pb-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
      <PageHeader
        description="Manage your products, stock levels, and pricing."
        className="mb-4"
        action={
          <Button
            onClick={openCreate}
            icon={<Plus size={16} />}
            className="h-9 px-4 text-xs shadow-xl"
          >
            Add Product
          </Button>
        }
      />

      <div className="max-w-md">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={16} />}
          className="h-10 text-xs shadow-sm"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title={search ? "No matches" : "Inventory empty"}
          description={search ? `No products for "${search}"` : "Start by adding products."}
          action={!search && (
            <Button onClick={openCreate} size="sm" icon={<Plus size={16} />}>
              Add Product
            </Button>
          )}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 shadow-sm">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                <tr>
                  <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-neutral-400">Product Info</th>
                  <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-neutral-400">Category</th>
                  <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-neutral-400 text-center">Unit Price</th>
                  <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-neutral-400 text-center">Stock</th>
                  <th className="px-4 py-3 font-black uppercase tracking-wider text-[9px] text-neutral-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock_quantity <= p.min_stock;
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.01] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                            <Package size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-neutral-900 dark:text-white truncate text-sm">{p.name}</div>
                            <div className="text-[9px] font-black uppercase text-neutral-400 tracking-tight">{p.variant || "Standard"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[8px] px-1.5 py-0.5 border-neutral-200 dark:border-neutral-700 font-bold uppercase tracking-tight text-neutral-500">
                          {categories.find((c) => c.id === p.category)?.name || "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="font-black text-neutral-900 dark:text-white text-sm">₹{Number(p.unit_price).toLocaleString('en-IN')}</div>
                        <div className="text-[8px] font-bold text-neutral-400 uppercase tracking-tight mt-0.5">Cost: ₹{Number(p.latest_purchase_price || p.purchase_price).toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={cn(
                            "text-xs font-black",
                            isLowStock ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"
                          )}>
                            {p.stock_quantity} <span className="text-[8px] opacity-60">QTY</span>
                          </span>
                          {isLowStock && <AlertTriangle size={12} className="text-rose-500 animate-pulse" />}
                        </div>
                        <div className="text-[8px] font-bold text-neutral-400 uppercase tracking-tighter mt-0.5">Min: {p.min_stock}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(p)} icon={<Pencil size={14} />} className="h-8 w-8 p-0 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white" />
                          <Button variant="ghost" size="sm" onClick={() => handleDeactivate(p.id)} className="h-8 w-8 p-0 rounded-lg text-neutral-400 hover:text-rose-500" icon={<Trash2 size={14} />} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((p) => {
              const isLowStock = p.stock_quantity <= p.min_stock;
              return (
                <Card key={p.id} className="p-4 shadow-sm space-y-3 rounded-2xl bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                        <Package size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-neutral-900 dark:text-white leading-tight truncate text-sm">{p.name}</h3>
                        <div className="text-[9px] font-black uppercase text-neutral-400 tracking-tight">{p.variant || 'Standard'}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-neutral-900 dark:text-white">₹{Number(p.unit_price).toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "text-xs font-black",
                        isLowStock ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        {p.stock_quantity} <span className="text-[8px] opacity-60">QTY</span>
                      </div>
                      <Badge variant="outline" className="text-[8px] px-1.5 py-0 border-neutral-200 dark:border-neutral-700 font-bold uppercase tracking-tight text-neutral-500">
                        {categories.find((c) => c.id === p.category)?.name || "—"}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(p)} icon={<Pencil size={14} />} className="h-8 w-8 p-0 rounded-lg bg-neutral-50 dark:bg-neutral-800/50" />
                        <Button variant="ghost" size="sm" onClick={() => handleDeactivate(p.id)} className="h-8 w-8 p-0 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500" icon={<Trash2 size={14} />} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingProduct ? "Edit Product" : "New Product"}
        asForm
        onSubmit={handleSubmit}
        footer={
          <>
            <Button variant="ghost" onClick={closeModal} type="button" className="text-xs">Cancel</Button>
            <Button type="submit" className="px-6 h-10 text-xs shadow-lg">
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Input
            label="Product Name"
            placeholder="E.g. Bubble Wrap"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-11 text-sm"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Variant (Optional)"
              placeholder="E.g. 2 inch"
              value={form.variant}
              onChange={(e) => setForm({ ...form, variant: e.target.value })}
              className="h-11 text-sm"
            />
            <Select
              label="Category"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Select..."
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              className="h-11 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Stock Alert"
              type="number"
              placeholder="5"
              required
              value={form.min_stock}
              onChange={(e) => setForm({ ...form, min_stock: e.target.value })}
              icon={<AlertTriangle size={14} className="text-neutral-400" />}
              className="h-11 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Input
              label="Purchase Price (Cost)"
              type="number"
              placeholder="0.00"
              value={form.purchase_price}
              onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
              icon={<span className="font-bold text-neutral-400 text-xs">₹</span>}
              className="h-11 text-sm"
            />
            <Input
              label="Selling Price (MRP)"
              type="number"
              placeholder="0.00"
              value={form.unit_price}
              onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
              icon={<span className="font-bold text-neutral-400 text-xs">₹</span>}
              className="h-11 text-sm"
            />
          </div>
          <p className="text-[10px] text-neutral-400 italic leading-snug">
            * Purchase cost calculates inventory value. Selling price can be adjusted at billing.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
