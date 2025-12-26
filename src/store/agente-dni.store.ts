import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DniRecord } from "@/types/agente-dni.interface";

interface DniStore {
  records: DniRecord[];
  addRecord: (record: Omit<DniRecord, "id" | "fechaCreacion">) => void;
  updateRecord: (id: string, data: Partial<DniRecord>) => void;
  removeRecord: (id: string) => void;
  getUserRecords: (userId: string) => DniRecord[];
  clearRecords: () => void;
}

export const useDniStore = create<DniStore>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (record) => {
        const newRecord: DniRecord = {
          ...record,
          id: crypto.randomUUID(),
          fechaCreacion: new Date().toISOString(),
        };

        set((state) => ({
          records: [...state.records, newRecord],
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
        return get().records.filter((record) => record.idUsuario === userId);
      },

      clearRecords: () => {
        set({ records: [] });
      },
    }),
    {
      name: "agente-dni-storage",
    }
  )
);
