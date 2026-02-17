import React from "react";

interface BillFormProps {
  customerName: string;
  setCustomerName: (val: string) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  customerAddress: string;
  setCustomerAddress: (val: string) => void;
  paymentMethod: "cash" | "online" | "pending";
  setPaymentMethod: (val: "cash" | "online" | "pending") => void;
  total: number;
  loading: boolean;
  cartEmpty: boolean;
  onSubmit: () => void;
}

export const BillForm: React.FC<BillFormProps> = ({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
  paymentMethod,
  setPaymentMethod,
  total,
  loading,
  cartEmpty,
  onSubmit,
}) => {
  return (
    <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-10 shrink-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 outline-none text-sm border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 transition-colors"
          />
          <input
            placeholder="Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 outline-none text-sm border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="flex-1 rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 outline-none text-sm border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 transition-colors"
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <textarea
            placeholder="Address (Optional)"
            rows={1}
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 outline-none text-sm resize-none border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="text-xs text-neutral-500 font-medium">Total Payable</div>
          <div className="text-3xl font-black tracking-tight">₹{total.toFixed(2)}</div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || cartEmpty}
          className="px-8 py-3 rounded-xl font-bold text-sm shadow-lg bg-black text-white dark:bg-white dark:text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
        >
          {loading ? "Processing..." : "Complete Bill"}
        </button>
      </div>
    </div>
  );
};