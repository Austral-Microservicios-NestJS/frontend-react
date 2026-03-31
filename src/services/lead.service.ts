import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/config/api-client";
import type { Lead, CreateLead, UpdateLead } from "@/types/lead.interface";

// Interfaz para la respuesta de consulta de placa AI
export interface ConsultaPlacaResponse {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  estado: string;
  nroSerie?: string;
  nroVin?: string;
  nroMotor?: string;
  anio?: string;
  clase?: string;
  uso?: string;
  sede?: string;
  departamentoSede?: string;
  anotaciones?: string | null;
  soat?: {
    estado?: string;
    numeroPoliza?: string;
    inicio?: string;
    fin?: string;
    compania?: string;
    codigoSbsAseguradora?: string;
    claseVehiculo?: string;
    usoVehiculo?: string;
    tipo?: string;
  };
  propietarios?: Array<{
    tipoDocumento?: number;
    nroDocumento?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    nombres?: string;
    razonSocial?: string;
    direccion?: string;
    nacimiento?: string;
    ubigeo?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    sexo?: string;
  }>;
}

const QUERY_KEY = "leads";

// ==================== API FUNCTIONS ====================

export const leadService = {
  getAll: async (): Promise<Lead[]> => {
    try {
      const response = await api.get<{ data: Lead[] }>("/leads?limit=100");
      // El backend devuelve { data: [...] }
      const leads = response.data.data;
      // Asegurar que siempre devolvemos un array
      return Array.isArray(leads) ? leads : [];
    } catch (error) {
      console.error("Error al obtener leads:", error);
      // Devolver array vacío si hay error
      return [];
    }
  },

  getById: async (id: string): Promise<Lead> => {
    const { data } = await api.get<Lead>(`/leads/${id}`);
    return data;
  },

  create: async (lead: CreateLead): Promise<Lead> => {
    const { data } = await api.post<Lead>("/leads", lead);
    return data;
  },

  update: async (id: string, lead: UpdateLead): Promise<Lead> => {
    const { data } = await api.patch<Lead>(`/leads/${id}`, lead);
    return data;
  },

  cambiarEstado: async (id: string, estado: string, usuarioResponsable?: string, comentario?: string): Promise<Lead> => {
    const { data } = await api.patch<Lead>(`/leads/${id}/estado`, { estado, usuarioResponsable, comentario });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  // ==================== DETALLE ENDPOINTS ====================

  updateDetalleAuto: async (id: string, data: Record<string, any>): Promise<void> => {
    await api.post(`/leads/${id}/detalle-auto`, data);
  },
  updateDetalleSoat: async (id: string, data: Record<string, any>): Promise<void> => {
    await api.post(`/leads/${id}/detalle-soat`, data);
  },
  updateDetalleSalud: async (id: string, data: Record<string, any>): Promise<void> => {
    await api.post(`/leads/${id}/detalle-salud`, data);
  },
  updateDetalleSCTR: async (id: string, data: Record<string, any>): Promise<void> => {
    await api.post(`/leads/${id}/detalle-sctr`, data);
  },
  updateDetalleVida: async (id: string, data: Record<string, any>): Promise<void> => {
    await api.post(`/leads/${id}/detalle-vida`, data);
  },
  updateDetalleVidaLey: async (id: string, data: Record<string, any>): Promise<void> => {
    await api.post(`/leads/${id}/detalle-vida-ley`, data);
  },
  updateDetalleFola: async (id: string, data: Record<string, any>): Promise<void> => {
    await api.post(`/leads/${id}/detalle-fola`, data);
  },

  // Búsqueda server-side por texto (nombre, email, teléfono, empresa, documento)
  search: async (query: string): Promise<Lead[]> => {
    try {
      const response = await api.get<{ data: Lead[] }>(
        `/leads/buscar?q=${encodeURIComponent(query)}&limit=100`,
      );
      const leads = response.data.data;
      return Array.isArray(leads) ? leads : [];
    } catch (error) {
      console.error("Error al buscar leads:", error);
      return [];
    }
  },

  // Consulta AI de placa vehicular
  consultarPlacaAI: async (placa: string): Promise<ConsultaPlacaResponse> => {
    const { data } = await api.get<ConsultaPlacaResponse>(`/vehiculos/placa/${placa}`);
    return data;
  },

  // Consulta completa vehicular (vehículo + papeletas + revisiones + siniestros)
  consultaVehicularCompleta: async (placa: string): Promise<any> => {
    const { data } = await api.get<any>(`/vehiculos/consulta-completa/${placa}`);
    return data;
  },

  // ==================== REACT QUERY HOOKS ====================

  useGetAll: () => {
    return useQuery({
      queryKey: [QUERY_KEY],
      queryFn: leadService.getAll,
      retry: false,
      refetchOnWindowFocus: true,
      refetchInterval: 30000, // Auto-refresh cada 30s para mostrar leads del chatbot
    });
  },

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => leadService.getById(id),
      enabled: !!id,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: leadService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateLead }) =>
        leadService.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: leadService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  // Hook para consulta AI de placa
  useConsultarPlacaAI: (placa: string | undefined) => {
    return useQuery({
      queryKey: ["consulta-placa", placa],
      queryFn: () => leadService.consultarPlacaAI(placa!),
      enabled: !!placa && placa.length >= 6,
      retry: 1,
      staleTime: 1000 * 60 * 10,
    });
  },

  // Hook para consulta completa vehicular
  useConsultaVehicularCompleta: (placa: string | undefined) => {
    return useQuery({
      queryKey: ["consulta-vehicular-completa", placa],
      queryFn: () => leadService.consultaVehicularCompleta(placa!),
      enabled: !!placa && placa.length >= 6,
      retry: 1,
      staleTime: 1000 * 60 * 10,
    });
  },
};
