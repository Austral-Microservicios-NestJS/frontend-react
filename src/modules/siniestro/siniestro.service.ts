import { api } from "@/config/api-client";
import type { Siniestro, CreateSiniestro, UpdateSiniestro } from "./siniestro.types";

export const siniestroService = {
  getByPoliza: async (idPoliza: string): Promise<Siniestro[]> => {
    const { data } = await api.get<Siniestro[]>(`/siniestro/poliza/${idPoliza}`);
    return Array.isArray(data) ? data : [];
  },

  getById: async (id: string): Promise<Siniestro> => {
    const { data } = await api.get<Siniestro>(`/siniestro/${id}`);
    return data;
  },

  create: async (siniestro: CreateSiniestro): Promise<Siniestro> => {
    const { data } = await api.post<Siniestro>("/siniestro", siniestro);
    return data;
  },

  update: async (id: string, siniestro: UpdateSiniestro): Promise<Siniestro> => {
    const { data } = await api.patch<Siniestro>(`/siniestro/${id}`, siniestro);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/siniestro/${id}`);
  },
};
