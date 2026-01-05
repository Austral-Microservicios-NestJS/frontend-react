import { api } from "@/config/api-client";
import type { Asignacion } from "@/types/asignacion.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const ASIGNACIONES_KEY = ["asignaciones"];

export const asignacionApi = {
  getSubordinados: async (idSupervisor: string) => {
    const response = await api.get<Asignacion[]>(
      `/asignaciones/subordinados/${idSupervisor}`
    );
    return response.data || [];
  },

  getSupervisor: async (idSubordinado: string) => {
    const response = await api.get<Asignacion>(
      `/asignaciones/supervisor/${idSubordinado}`
    );
    return response.data;
  },

  getByUsuario: async (idUsuario: string): Promise<Asignacion | null> => {
    try {
      const response = await api.get<Asignacion>(
        `/asignaciones/usuario/${idUsuario}`
      );
      return response.data;
    } catch {
      return null;
    }
  },

  updateComision: async (idUsuario: string, porcentajeComision: number) => {
    const response = await api.patch(`/asignaciones/comision/${idUsuario}`, {
      porcentajeComision,
    });
    return response.data;
  },

  // ===== Hooks de React Query =====

  useGetSubordinados: (idSupervisor: string) => {
    return useQuery({
      queryKey: [...ASIGNACIONES_KEY, "subordinados", idSupervisor],
      queryFn: () => asignacionApi.getSubordinados(idSupervisor),
      enabled: !!idSupervisor,
    });
  },

  useGetSupervisor: (idSubordinado: string) => {
    return useQuery({
      queryKey: [...ASIGNACIONES_KEY, "supervisor", idSubordinado],
      queryFn: () => asignacionApi.getSupervisor(idSubordinado),
      enabled: !!idSubordinado,
    });
  },

  useGetByUsuario: (idUsuario: string) => {
    return useQuery({
      queryKey: [...ASIGNACIONES_KEY, "usuario", idUsuario],
      queryFn: () => asignacionApi.getByUsuario(idUsuario),
      enabled: !!idUsuario,
    });
  },

  useUpdateComision: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        idUsuario,
        porcentajeComision,
      }: {
        idUsuario: string;
        porcentajeComision: number;
      }) => asignacionApi.updateComision(idUsuario, porcentajeComision),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ASIGNACIONES_KEY });
      },
    });
  },
};
