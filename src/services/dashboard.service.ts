import { api } from "@/config/api-client";
import { useQuery } from "@tanstack/react-query";

// Tipos para los insights de IA
export type ClienteAfectado = {
  idCliente: string;
  nombre: string;
  tipo?: string;
};

export type NoticiaRelacionada = {
  titulo: string;
  fuente: string;
  url: string;
};

export type Insight = {
  id?: string;
  tipo: "alerta" | "oportunidad" | "recomendacion" | "sugerencia";
  prioridad: "alta" | "media" | "baja";
  icono?: string;
  titulo: string;
  descripcion: string;
  clienteAfectado?: ClienteAfectado;
  noticiaRelacionada?: NoticiaRelacionada;
  accion?: string;
  urgencia?: string;
};

export type InsightsResponse = {
  generadoEn: string;
  resumen: string;
  insights: Insight[];
  estadisticas: {
    noticiasAnalizadas: number;
    clientesEvaluados: number;
    insightsGenerados: number;
  };
};

export type InsightsParams = {
  incluirNoticias?: boolean;
  incluirContextos?: boolean;
  limite?: number;
  userId?: string;
  userRole?: string;
};

const QUERY_KEY = "dashboard";

export const dashboardService = {
  // Invalidar cache de insights en el backend
  invalidateCache: async (params?: { userId?: string }): Promise<void> => {
    const payload = params?.userId ? { userId: params.userId } : undefined;
    await api.post("/dashboard/invalidate-cache", payload);
  },

  // Obtener insights de IA (noticias + contextos analizados)
  getInsights: async (params: InsightsParams = {}): Promise<InsightsResponse> => {
    const payload: Record<string, any> = {
      incluirNoticias: params.incluirNoticias ?? true,
      incluirContextos: params.incluirContextos ?? true,
      limite: params.limite ?? 5,
    };
    if (params.userId && params.userRole) {
      payload.userId = params.userId;
      payload.userRole = params.userRole;
    }
    const { data } = await api.post("/dashboard/insights", payload);
    return data;
  },

  // Actualizar insights con invalidación de cache
  refreshInsights: async (params: InsightsParams = {}): Promise<InsightsResponse> => {
    // 1. Invalidar cache
    await dashboardService.invalidateCache({ userId: params.userId });
    // 2. Esperar 2 segundos para que el backend procese
    await new Promise((r) => setTimeout(r, 2000));
    // 3. Obtener insights frescos
    return dashboardService.getInsights(params);
  },

  // Hook de React Query para insights
  useGetInsights: (params: InsightsParams = {}) => {
    return useQuery({
      queryKey: [QUERY_KEY, "insights", params],
      queryFn: () => dashboardService.getInsights(params),
      staleTime: 5 * 60 * 1000, // 5 minutos - no refrescar tan seguido
      retry: 1,
      refetchOnWindowFocus: false,
    });
  },
};
