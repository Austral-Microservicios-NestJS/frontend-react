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
    return data;
  },

  // Obtener observación por ID
  getById: async (id: number): Promise<Observacion> => {
    const { data } = await api.get(`/observacion/${id}`);
    return data;
  },

  // Crear observación
  create: async (observacion: CreateObservacion): Promise<Observacion> => {
    const formData = new FormData();
    formData.append("asunto", observacion.asunto);
    formData.append("descripcion", observacion.descripcion);
    formData.append("categoria", observacion.categoria);
    if (observacion.prioridad) formData.append("prioridad", observacion.prioridad);
    formData.append("canal", observacion.canal);
    formData.append("estado", observacion.estado);
    formData.append("creadoPor", observacion.creadoPor);

    if (observacion.imagen) {
      formData.append("imagen", observacion.imagen);
    }

    const { data } = await api.post("/observacion", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
    // Si hay imagen, enviamos FormData
    if (observacionData.imagen) {
      const formData = new FormData();
      const { imagen, ...rest } = observacionData;

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formData.append("imagen", imagen);

      const { data } = await api.patch(`/observacion/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    }

    // Si no hay imagen, enviamos JSON normal
    const { data } = await api.patch(`/observacion/${id}`, observacionData);
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
