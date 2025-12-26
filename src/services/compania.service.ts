import { api } from "@/config/api-client";
import type {
  Compania,
  CreateCompaniaDto,
  UpdateCompaniaDto,
} from "@/types/compania.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const COMPANIAS_KEY = ["companias"];

export const companiaApi = {
  getAll: async () => {
    const response = await api.get<{ data: Compania[] }>(`/companias`);
    return response.data.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Compania>(`/companias/${id}`);
    return response.data;
  },

  create: async (compania: CreateCompaniaDto) => {
    const response = await api.post<Compania>("/companias", compania);
    return response.data;
  },

  update: async (id: string, compania: UpdateCompaniaDto) => {
    const response = await api.patch<Compania>(`/companias/${id}`, compania);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/companias/${id}`);
  },

  // ===== Hooks de React Query =====

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [...COMPANIAS_KEY, id],
      queryFn: () => companiaApi.getById(id),
      enabled: !!id,
    });
  },

  useGetAll: () => {
    return useQuery({
      queryKey: COMPANIAS_KEY,
      queryFn: () => companiaApi.getAll(),
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateCompaniaDto) => companiaApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: COMPANIAS_KEY });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateCompaniaDto }) =>
        companiaApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: COMPANIAS_KEY });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => companiaApi.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: COMPANIAS_KEY });
      },
    });
  },
};
