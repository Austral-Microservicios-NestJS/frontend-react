import { api } from "@/config/api-client";
import type {
  Ramo,
  CreateRamoDto,
  UpdateRamoDto,
} from "@/types/ramo.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const RAMOS_KEY = ["ramos"];

export const ramoApi = {
  getAll: async () => {
    const response = await api.get<{ data: Ramo[] }>(`/ramos`);
    return response.data.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Ramo>(`/ramos/${id}`);
    return response.data;
  },

  create: async (ramo: CreateRamoDto) => {
    const response = await api.post<Ramo>("/ramos", ramo);
    return response.data;
  },

  update: async (id: string, ramo: UpdateRamoDto) => {
    const response = await api.patch<Ramo>(`/ramos/${id}`, ramo);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/ramos/${id}`);
  },

  // ===== Hooks de React Query =====

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [...RAMOS_KEY, id],
      queryFn: () => ramoApi.getById(id),
      enabled: !!id,
    });
  },

  useGetAll: () => {
    return useQuery({
      queryKey: RAMOS_KEY,
      queryFn: () => ramoApi.getAll(),
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateRamoDto) => ramoApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: RAMOS_KEY });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateRamoDto }) =>
        ramoApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: RAMOS_KEY });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => ramoApi.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: RAMOS_KEY });
      },
    });
  },
};
