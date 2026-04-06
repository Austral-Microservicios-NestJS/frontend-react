import { api } from "@/config/api-client";
import type { Cliente } from "@/types/cliente.interface";
import type { Poliza } from "@/types/poliza.interface";
import type { Lead } from "@/types/lead.interface";

export interface SearchResults {
  clientes: Cliente[];
  polizas: Poliza[];
  leads: Lead[];
}

export const searchService = {
  search: async (q: string, limit = 5): Promise<SearchResults> => {
    const response = await api.get<SearchResults>("/search", { params: { q, limit } });
    return response.data;
  },
};
