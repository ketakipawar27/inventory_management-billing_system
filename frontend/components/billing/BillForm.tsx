import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

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
    <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-[0_-5px_15px_rgba(0,0,0,0.03)] z-10 shrink-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="space-y-4">
          <Input
            label="Customer Name"
            placeholder="E.g. Ketaki Pawar"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="h-10 text-sm bg-neutral-100/50 dark:bg-black/20 border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 rounded-xl"
          />
          <Input
            label="Phone Number"
            placeholder="(Optional)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="h-10 text-sm bg-neutral-100/50 dark:bg-black/20 border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 rounded-xl"
          />
        </div>
        <div className="space-y-4">
          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="h-10 text-sm bg-neutral-100/50 dark:bg-black/20 border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 rounded-xl"
            options={[
              { value: "cash", label: "Cash Payment" },
              { value: "online", label: "Online Payment" },
              { value: "pending", label: "Mark as Pending" },
            ]}
          />
          <textarea
            placeholder="Shipping Address (Optional)"
            rows={1}
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 bg-neutral-100/50 dark:bg-black/20 border border-transparent focus:border-neutral-200 dark:focus:border-neutral-800 outline-none text-sm resize-none transition-all placeholder:text-neutral-400 min-h-[40px]"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
        <div className="w-full sm:w-auto text-center sm:text-left">
          <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">Total Payable</div>
          <div className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white">
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <Button
          onClick={onSubmit}
          isLoading={loading}
          disabled={cartEmpty || !customerName}
          className="w-full sm:w-auto px-8 py-4 shadow-xl text-sm font-bold uppercase tracking-wider rounded-xl"
          size="lg"
        >
          Complete Bill
        </Button>
      </div>
    </div>
  );
};
