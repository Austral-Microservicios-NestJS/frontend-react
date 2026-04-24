import { api } from "@/config/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface LeadRecordatorio {
  idRecordatorio: string;
  idLead: string;
  estadoLeadAlEnviar: string;
  diasEnEstado: number;
  tipoDestinatario: "CLIENTE" | "AGENTE";
  canal: "EMAIL" | "WHATSAPP" | "SMS";
  destinatarioContacto: string;
  destinatarioNombre?: string;
  idAgenteDestinatario?: string;
  asunto?: string;
  contenido: string;
  enviadoEn: string;
  exitoso: boolean;
  proveedor?: string;
  respuestaProveedor?: string;
  errorMensaje?: string;
  disparador: "CRON_AUTOMATICO" | "MANUAL_AGENTE" | "MANUAL_ADMIN";
  idUsuarioDisparador?: string;
}

export interface LeadEstancado {
  idLead: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  estado: string;
  tipoSeguro?: string;
  asignadoA?: string;
  diasEnEstado: number;
  motivo: string;
  fechaUltimoCambio?: string;
}

export interface InfoAgente {
  idUsuario: string;
  nombreUsuario: string;
  correo: string;
  rol: string;
  idSupervisor?: string;
  activo?: boolean;
  nombres?: string;
  apellidos?: string;
  nombreCompleto: string;
  telefono?: string;
  telefonoEmpresarial?: string;
}

export const recordatorioApi = {
  getHistorial: async (idLead: string): Promise<LeadRecordatorio[]> => {
    const { data } = await api.get<LeadRecordatorio[]>(`/leads/${idLead}/recordatorios`);
    return data || [];
  },

  enviarManual: async (idLead: string) => {
    const { data } = await api.post(`/leads/${idLead}/recordatorios/enviar`);
    return data;
  },

  listarEstancados: async (): Promise<LeadEstancado[]> => {
    const { data } = await api.get<LeadEstancado[]>(`/leads/estancados/listar`);
    return data || [];
  },

  getInfoAgente: async (idUsuario: string): Promise<InfoAgente | null> => {
    try {
      const { data } = await api.get<InfoAgente>(`/usuarios/${idUsuario}/info-agente`);
      return data || null;
    } catch {
      return null;
    }
  },

  useHistorial: (idLead: string) =>
    useQuery({
      queryKey: ["recordatorios", idLead],
      queryFn: () => recordatorioApi.getHistorial(idLead),
      enabled: !!idLead,
    }),

  useEstancados: () =>
    useQuery({
      queryKey: ["leads", "estancados"],
      queryFn: () => recordatorioApi.listarEstancados(),
    }),

  useInfoAgente: (idUsuario?: string) =>
    useQuery({
      queryKey: ["info-agente", idUsuario],
      queryFn: () => recordatorioApi.getInfoAgente(idUsuario!),
      enabled: !!idUsuario,
    }),

  useEnviarManual: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (idLead: string) => recordatorioApi.enviarManual(idLead),
      onSuccess: (_, idLead) => {
        qc.invalidateQueries({ queryKey: ["recordatorios", idLead] });
        qc.invalidateQueries({ queryKey: ["leads", "estancados"] });
      },
    });
  },
};
