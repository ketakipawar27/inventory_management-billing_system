import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <Input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-3.5"
          />
          <Input
            placeholder="Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="p-3.5"
          />
        </div>
        <div className="space-y-3">
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="p-3.5"
            options={[
              { value: "cash", label: "Cash" },
              { value: "online", label: "Online" },
              { value: "pending", label: "Pending" },
            ]}
          />
          <textarea
            placeholder="Address (Optional)"
            rows={1}
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full rounded-2xl px-4 py-3.5 bg-neutral-100 dark:bg-black border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 outline-none text-sm resize-none transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Total Payable</div>
          <div className="text-3xl font-black tracking-tighter">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>

        <Button
          onClick={onSubmit}
          isLoading={loading}
          disabled={cartEmpty || !customerName}
          className="px-10 py-4 shadow-xl"
        >
          Complete Bill
        </Button>
      </div>
    </div>
  );
};
