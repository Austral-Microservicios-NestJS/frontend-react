import { api } from "@/config/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Notificacion {
  idNotificacion: string;
  idUsuario: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  urlDestino?: string;
  idRecurso?: string;
  leida: boolean;
  fechaLectura?: string;
  fechaCreacion: string;
}

export const notificacionApi = {
  listar: async (soloNoLeidas = false, limit = 50): Promise<Notificacion[]> => {
    const { data } = await api.get<Notificacion[]>(`/notificaciones/me`, {
      params: { soloNoLeidas, limit },
    });
    return data || [];
  },

  contarNoLeidas: async (): Promise<number> => {
    const { data } = await api.get<number>(`/notificaciones/me/no-leidas/count`);
    return Number(data) || 0;
  },

  marcarLeida: async (id: string): Promise<Notificacion> => {
    const { data } = await api.patch<Notificacion>(`/notificaciones/${id}/leer`);
    return data;
  },

  marcarTodasLeidas: async (): Promise<{ affected?: number }> => {
    const { data } = await api.patch(`/notificaciones/me/leer-todas`);
    return data;
  },

  // ───── Hooks ─────
  useListar: (soloNoLeidas = false) =>
    useQuery({
      queryKey: ["notificaciones", { soloNoLeidas }],
      queryFn: () => notificacionApi.listar(soloNoLeidas, 50),
      refetchInterval: 30_000, // refetch cada 30s para ver nuevas
    }),

  useContador: () =>
    useQuery({
      queryKey: ["notificaciones", "count"],
      queryFn: notificacionApi.contarNoLeidas,
      refetchInterval: 30_000,
    }),

  useMarcarLeida: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: notificacionApi.marcarLeida,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["notificaciones"] });
      },
    });
  },

  useMarcarTodasLeidas: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: notificacionApi.marcarTodasLeidas,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["notificaciones"] });
      },
    });
  },
};
