import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InvoiceRecord } from "@/types/agente-factura.interface";

interface InvoiceStoreState {
  records: InvoiceRecord[];
  addRecord: (
    userId: string,
    data: Omit<InvoiceRecord, "id" | "userId" | "createdAt">
  ) => void;
  updateRecord: (
    id: string,
    data: Partial<Omit<InvoiceRecord, "id" | "userId" | "createdAt">>
  ) => void;
  removeRecord: (id: string) => void;
  getUserRecords: (userId: string) => InvoiceRecord[];
}

export const useInvoiceStore = create<InvoiceStoreState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (userId, data) => {
        const newRecord: InvoiceRecord = {
          id: crypto.randomUUID(),
          userId,
          ...data,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          records: [newRecord, ...state.records],
        }));
      },

      updateRecord: (id, data) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id ? { ...record, ...data } : record
          ),
        }));
      },

      removeRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }));
      },

      getUserRecords: (userId) => {
        return get().records.filter((record) => record.userId === userId);
      },
    }),
    {
      name: "invoice-storage",
    }
  )
);
