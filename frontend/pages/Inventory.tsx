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
      // On creation/edit, we update BOTH avg and latest price to the manually entered value
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
    <div className="space-y-6 pb-20 lg:pb-0 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
      <PageHeader
        description="Manage your products, stock levels, and pricing."
        action={
          <Button
            onClick={openCreate}
            icon={<Plus size={18} />}
            className="shadow-xl"
          >
            Add Product
          </Button>
        }
      />

      <Input
        placeholder="Search name, category, variant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search size={18} />}
        className="max-w-md shadow-sm"
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 rounded-[2rem] bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title={search ? "No products found" : "Your inventory is empty"}
          description={search ? `We couldn't find anything matching "${search}"` : "Start by adding your first product to the system."}
          action={!search && (
            <Button onClick={openCreate} icon={<Plus size={18} />}>
              Add First Product
            </Button>
          )}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-neutral-400">Product Info</th>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-neutral-400">Category</th>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-neutral-400 text-center">Unit Price</th>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-neutral-400 text-center">Stock</th>
                  <th className="p-6 font-black uppercase tracking-widest text-[10px] text-neutral-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock_quantity <= p.min_stock;
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                            <Package size={24} />
                          </div>
                          <div>
                            <div className="font-black text-neutral-900 dark:text-white tracking-tight text-base">{p.name}</div>
                            <div className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mt-0.5">{p.variant || "Standard"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <Badge variant="outline" className="border-neutral-200 dark:border-neutral-700">
                          {categories.find((c) => c.id === p.category)?.name || "Uncategorized"}
                        </Badge>
                      </td>
                      <td className="p-6 text-center">
                        <div className="font-black text-neutral-900 dark:text-white text-base">₹{Number(p.unit_price).toLocaleString('en-IN')}</div>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase mt-1 tracking-wider">Cost: ₹{Number(p.latest_purchase_price || p.purchase_price).toLocaleString('en-IN')}</div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Badge variant={isLowStock ? "error" : "success"} className="px-3 py-1">
                            {p.stock_quantity} UNITS
                          </Badge>
                          {isLowStock && <AlertTriangle size={14} className="text-rose-500 animate-pulse" />}
                        </div>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase mt-1">Min: {p.min_stock}</div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(p)} icon={<Pencil size={18} />} className="text-neutral-400 hover:text-black dark:hover:text-white" />
                          <Button variant="ghost" size="sm" onClick={() => handleDeactivate(p.id)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10" icon={<Trash2 size={18} />} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((p) => {
              const isLowStock = p.stock_quantity <= p.min_stock;
              return (
                <Card key={p.id} className="p-6 shadow-sm space-y-5 rounded-[2rem]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                        <Package size={28} />
                      </div>
                      <div>
                        <h3 className="font-black text-neutral-900 dark:text-white leading-tight tracking-tight text-lg">{p.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">{p.variant || 'Standard'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black">₹{Number(p.unit_price).toLocaleString('en-IN')}</div>
                      <Badge variant={isLowStock ? "error" : "success"} className="text-[9px] px-2 py-0.5 mt-2">
                        {p.stock_quantity} UNITS
                      </Badge>
                      <div className="text-[8px] font-black text-neutral-400 uppercase mt-1">Min: {p.min_stock}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-neutral-100 dark:border-neutral-800">
                    <Badge variant="outline" className="text-[9px] border-neutral-200 dark:border-neutral-700">
                        {categories.find((c) => c.id === p.category)?.name || "—"}
                    </Badge>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => openEdit(p)} icon={<Pencil size={16} />} className="rounded-xl" />
                        <Button variant="ghost" size="sm" onClick={() => handleDeactivate(p.id)} className="text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-xl" icon={<Trash2 size={16} />} />
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
            <Button variant="ghost" onClick={closeModal} type="button">Cancel</Button>
            <Button type="submit" className="px-8 shadow-lg">
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <Input
            label="Product Name"
            placeholder="E.g. Packing Tape"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Variant (Optional)"
              placeholder="E.g. 2 inch"
              value={form.variant}
              onChange={(e) => setForm({ ...form, variant: e.target.value })}
            />
            <Select
              label="Category"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Select category..."
              options={categories.map(c => ({ value: c.id, label: c.name }))}
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
              icon={<AlertTriangle size={16} className="text-neutral-400" />}
            />
            <div />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Input
              label="Purchase Price (Cost)"
              type="number"
              placeholder="0.00"
              value={form.purchase_price}
              onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
              icon={<span className="font-bold text-neutral-400">₹</span>}
            />
            <Input
              label="Default Selling Price (MRP)"
              type="number"
              placeholder="0.00"
              value={form.unit_price}
              onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
              icon={<span className="font-bold text-neutral-400">₹</span>}
            />
          </div>
          <p className="text-[10px] text-neutral-400 italic mt-2 leading-relaxed">
            * Purchase cost is used for calculating total inventory value.<br />
            * Selling price is flexible and can be negotiated during billing.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
