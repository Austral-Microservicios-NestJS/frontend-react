import { api } from "@/config/api-client";
import type { Actividad, CreateActividad, UpdateActividad } from "@/types/actividad.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "actividades";

// ==================== API FUNCTIONS ====================

export const actividadService = {
  // Listar todas las actividades con paginación
  getAll: async (params?: { page?: number; limit?: number }): Promise<{ data: Actividad[]; meta: any }> => {
    try {
      const response = await api.get("/actividades", { params });
      return response.data;
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      return { data: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }
  },

  // Obtener actividad por ID
  getById: async (id: string): Promise<Actividad> => {
    const { data } = await api.get(`/actividades/id/${id}`);
    return data;
  },

  // Listar actividades por usuario
  getByUsuario: async (idUsuario: string, params?: { page?: number; limit?: number }): Promise<{ data: Actividad[]; meta: any }> => {
    try {
      const response = await api.get(`/actividades/usuario/${idUsuario}`, { params });
      return response.data;
    } catch (error) {
      console.error("Error al obtener actividades del usuario:", error);
      return { data: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }
  },

  // Crear actividad
  create: async (actividad: CreateActividad): Promise<Actividad> => {
    const { data } = await api.post("/actividades", actividad);
    return data;
  },

  // Actualizar actividad
  update: async ({ id, data: actividadData }: { id: string; data: UpdateActividad }): Promise<Actividad> => {
    const { data } = await api.patch(`/actividades/${id}`, actividadData);
    return data;
  },

  // Eliminar actividad
  delete: async (id: string): Promise<void> => {
    await api.delete(`/actividades/${id}`);
  },

  // ==================== REACT QUERY HOOKS ====================

  useGetAll: (params?: { page?: number; limit?: number }) => {
    return useQuery({
      queryKey: [QUERY_KEY, "all", params],
      queryFn: () => actividadService.getAll(params),
      retry: false,
      refetchOnWindowFocus: false,
    });
  },

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => actividadService.getById(id),
      enabled: !!id,
    });
  },

  useGetByUsuario: (idUsuario: string, params?: { page?: number; limit?: number }) => {
    return useQuery({
      queryKey: [QUERY_KEY, "usuario", idUsuario, params],
      queryFn: () => actividadService.getByUsuario(idUsuario, params),
      enabled: !!idUsuario,
      retry: false,
      refetchOnWindowFocus: false,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: actividadService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: actividadService.update,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: actividadService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },
};
