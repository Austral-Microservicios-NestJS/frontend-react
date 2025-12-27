import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/config/api-client";
import type { Lead, CreateLead, UpdateLead } from "@/types/lead.interface";

const QUERY_KEY = "leads";

// ==================== API FUNCTIONS ====================

export const leadService = {
  getAll: async (): Promise<Lead[]> => {
    try {
      const response = await api.get<{ data: Lead[] }>("/leads");
      // El backend devuelve { data: [...] }
      const leads = response.data.data;
      // Asegurar que siempre devolvemos un array
      return Array.isArray(leads) ? leads : [];
    } catch (error) {
      console.error("Error al obtener leads:", error);
      // Devolver array vacío si hay error
      return [];
    }
  },

  getById: async (id: string): Promise<Lead> => {
    const { data } = await api.get<Lead>(`/leads/${id}`);
    return data;
  },

  create: async (lead: CreateLead): Promise<Lead> => {
    const { data } = await api.post<Lead>("/leads", lead);
    return data;
  },

  update: async (id: string, lead: UpdateLead): Promise<Lead> => {
    const { data } = await api.patch<Lead>(`/leads/${id}`, lead);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  // ==================== REACT QUERY HOOKS ====================

  useGetAll: () => {
    return useQuery({
      queryKey: [QUERY_KEY],
      queryFn: leadService.getAll,
      retry: false, // No reintentar si falla
      refetchOnWindowFocus: false, // No refetch al hacer foco
    });
  },

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => leadService.getById(id),
      enabled: !!id,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: leadService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateLead }) =>
        leadService.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: leadService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },
};
