import { api } from "@/config/api-client";
import type { Asignacion } from "@/types/asignacion.interface";
import { useQuery } from "@tanstack/react-query";

export const ASIGNACIONES_KEY = ["asignaciones"];

export const asignacionApi = {
  getSubordinados: async (idSupervisor: string) => {
    const response = await api.get<Asignacion[]>(`/asignaciones/subordinados/${idSupervisor}`);
    return response.data || [];
  },

  getSupervisor: async (idSubordinado: string) => {
    const response = await api.get<Asignacion>(`/asignaciones/supervisor/${idSubordinado}`);
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
};
