import { api } from "@/config/api-client";
import type {
  Observacion,
  CreateObservacion,
  UpdateObservacion,
} from "@/types/observacion.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "observaciones";

// ==================== API FUNCTIONS ====================

export const observacionService = {
  // Listar todas las observaciones
  getAll: async (): Promise<Observacion[]> => {
    const { data } = await api.get("/observacion");
    // El backend devuelve { data: [...], meta: {...} }
    return data.data || [];
  },

  // Obtener observación por ID
  getById: async (id: number): Promise<Observacion> => {
    const { data } = await api.get(`/observacion/${id}`);
    return data;
  },

  // Crear observación
  create: async (observacion: CreateObservacion): Promise<Observacion> => {
    // Ahora siempre enviamos JSON con la URL de la imagen (si existe)
    const { data } = await api.post("/observacion", observacion, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  // Actualizar observación
  update: async ({
    id,
    data: observacionData,
  }: {
    id: number;
    data: UpdateObservacion;
  }): Promise<Observacion> => {
    // Ahora siempre enviamos JSON con la URL de la imagen (si existe)
    const { data } = await api.patch(`/observacion/${id}`, observacionData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  // Eliminar observación
  delete: async (id: number): Promise<void> => {
    await api.delete(`/observacion/${id}`);
  },

  // ==================== REACT QUERY HOOKS ====================

  useGetAll: () => {
    return useQuery({
      queryKey: [QUERY_KEY, "all"],
      queryFn: observacionService.getAll,
      retry: false,
      refetchOnWindowFocus: false,
    });
  },

  useGetById: (id: number) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => observacionService.getById(id),
      enabled: !!id,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: observacionService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: observacionService.update,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: observacionService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },
};
