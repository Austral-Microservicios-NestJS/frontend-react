import { api } from "@/config/api-client";
import type { Tarea, CreateTarea } from "@/types/tarea.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const TAREAS_KEY = ["tareas"];

export const tareaApi = {
  getAll: async () => {
    const response = await api.get<Tarea[]>(`/tareas`);
    return response.data || [];
  },

  getAllByUsuario: async (idUsuario: string) => {
    const response = await api.get<{ data: Tarea[] }>(`/tareas/usuario/${idUsuario}`);
    return response.data.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Tarea>(`/tareas/${id}`);
    return response.data;
  },

  create: async (tarea: CreateTarea) => {
    const response = await api.post<Tarea>("/tareas", tarea);
    return response.data;
  },

  update: async (id: string, tarea: Partial<CreateTarea>) => {
    const response = await api.patch<Tarea>(`/tareas/${id}`, tarea);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/tareas/${id}`);
  },

  // ===== Hooks de React Query =====

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [...TAREAS_KEY, id],
      queryFn: () => tareaApi.getById(id),
      enabled: !!id,
    });
  },

  useGetAll: () => {
    return useQuery({
      queryKey: TAREAS_KEY,
      queryFn: () => tareaApi.getAll(),
    });
  },

  useGetAllByUsuario: (idUsuario: string) => {
    return useQuery({
      queryKey: [...TAREAS_KEY, "usuario", idUsuario],
      queryFn: () => tareaApi.getAllByUsuario(idUsuario),
      enabled: !!idUsuario,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateTarea) => tareaApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: TAREAS_KEY });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<CreateTarea> }) =>
        tareaApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: TAREAS_KEY });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => tareaApi.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: TAREAS_KEY });
      },
    });
  },
};
