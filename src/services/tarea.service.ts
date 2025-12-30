import { api } from "@/config/api-client";
import type { Tarea, CreateTarea, UpdateTarea, TareaFilters } from "@/types/tarea.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "tareas";

// ==================== API FUNCTIONS ====================

export const tareaService = {
  // Listar todas las tareas con paginación
  getAll: async (params?: { page?: number; limit?: number }): Promise<{ data: Tarea[]; meta: any }> => {
    try {
      const response = await api.get("/tareas", { params });
      return response.data;
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      return { data: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }
  },

  // Obtener tarea por ID
  getById: async (id: string): Promise<Tarea> => {
    const { data } = await api.get(`/tareas/id/${id}`);
    return data;
  },

  // Listar tareas por usuario con filtros opcionales
  getByUsuario: async (idUsuario: string, filters?: TareaFilters): Promise<{ data: Tarea[]; meta: any }> => {
    try {
      const response = await api.get(`/tareas/usuario/${idUsuario}`, { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error al obtener tareas del usuario:", error);
      return { data: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }
  },

  // Crear tarea
  create: async (tarea: CreateTarea): Promise<Tarea> => {
    const { data } = await api.post("/tareas", tarea);
    return data;
  },

  // Actualizar tarea
  update: async ({ id, data: tareaData }: { id: string; data: UpdateTarea }): Promise<Tarea> => {
    const { data } = await api.patch(`/tareas/${id}`, tareaData);
    return data;
  },

  // Eliminar tarea
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tareas/${id}`);
  },

  // ==================== REACT QUERY HOOKS ====================

  useGetAll: (params?: { page?: number; limit?: number }) => {
    return useQuery({
      queryKey: [QUERY_KEY, "all", params],
      queryFn: () => tareaService.getAll(params),
      retry: false,
      refetchOnWindowFocus: false,
    });
  },

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => tareaService.getById(id),
      enabled: !!id,
    });
  },

  useGetByUsuario: (idUsuario: string, filters?: TareaFilters) => {
    return useQuery({
      queryKey: [QUERY_KEY, "usuario", idUsuario, filters],
      queryFn: () => tareaService.getByUsuario(idUsuario, filters),
      enabled: !!idUsuario,
      retry: false,
      refetchOnWindowFocus: false,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: tareaService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: tareaService.update,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: tareaService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },
};
