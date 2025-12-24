import { api } from "@/config/api-client";
import type {
  Actividad,
  CreateActividad,
  UpdateActividad,
} from "@/types/actividad.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ACTIVIDADES_KEY = ["actividades"];

export const actividadApi = {
  getAll: async () => {
    const response = await api.get<{ data: Actividad[] }>(`/actividades`);
    return response.data.data || [];
  },

  getAllByUsuario: async (idUsuario: string) => {
    const response = await api.get<{ data: Actividad[] }>(`/actividades/usuario/${idUsuario}`);
    return response.data.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Actividad>(`/actividades/${id}`);
    return response.data;
  },

  create: async (actividad: CreateActividad) => {
    const response = await api.post<Actividad>("/actividades", actividad);
    return response.data;
  },

  update: async (id: string, actividad: UpdateActividad) => {
    const response = await api.patch<Actividad>(`/actividades/${id}`, actividad);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/actividades/${id}`);
  },

  // ===== Hooks de React Query =====

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [...ACTIVIDADES_KEY, id],
      queryFn: () => actividadApi.getById(id),
      enabled: !!id,
    });
  },

  useGetAll: () => {
    return useQuery({
      queryKey: ACTIVIDADES_KEY,
      queryFn: () => actividadApi.getAll(),
    });
  },

  useGetAllByUsuario: (idUsuario: string) => {
    return useQuery({
      queryKey: [...ACTIVIDADES_KEY, "usuario", idUsuario],
      queryFn: () => actividadApi.getAllByUsuario(idUsuario),
      enabled: !!idUsuario,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateActividad) => actividadApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ACTIVIDADES_KEY });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateActividad }) =>
        actividadApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ACTIVIDADES_KEY });
      },
    });
  },
};
