// ==================== ENUMS ====================

export enum TipoTarea {
  LLAMADA = "LLAMADA",
  REUNION = "REUNION",
  EMAIL = "EMAIL",
  SEGUIMIENTO = "SEGUIMIENTO",
  REVISION = "REVISION",
  DOCUMENTO = "DOCUMENTO",
  OTRO = "OTRO",
}

export enum PrioridadTarea {
  ALTA = "ALTA",
  MEDIA = "MEDIA",
  BAJA = "BAJA",
}

export enum EstadoTarea {
  PENDIENTE = "PENDIENTE",
  EN_PROCESO = "EN_PROCESO",
  COMPLETADA = "COMPLETADA",
  CANCELADA = "CANCELADA",
}

// ==================== INTERFACES ====================

export interface Tarea {
  idTarea: string;
  creadaPor: string;
  asunto: string;
  descripcion?: string;
  tipoTarea: TipoTarea;
  fechaVencimiento: string;
  prioridad: PrioridadTarea;
  estado: EstadoTarea;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CreateTarea {
  creadaPor: string;
  asunto: string;
  descripcion?: string;
  tipoTarea: TipoTarea;
  fechaVencimiento: string;
  prioridad: PrioridadTarea;
  estado: EstadoTarea;
}

export interface UpdateTarea {
  asunto?: string;
  descripcion?: string;
  tipoTarea?: TipoTarea;
  fechaVencimiento?: string;
  prioridad?: PrioridadTarea;
  estado?: EstadoTarea;
}

export interface TareaFilters {
  page?: number;
  limit?: number;
  estado?: EstadoTarea;
  prioridad?: PrioridadTarea;
  fechaDesde?: string;
  fechaHasta?: string;
}

// ==================== OPTIONS FOR SELECTS ====================

export const tipoTareaOptions = [
  { value: TipoTarea.LLAMADA, label: "Llamada" },
  { value: TipoTarea.REUNION, label: "Reunión" },
  { value: TipoTarea.EMAIL, label: "Email" },
  { value: TipoTarea.SEGUIMIENTO, label: "Seguimiento" },
  { value: TipoTarea.REVISION, label: "Revisión" },
  { value: TipoTarea.DOCUMENTO, label: "Documento" },
  { value: TipoTarea.OTRO, label: "Otro" },
] as const;

export const prioridadTareaOptions = [
  { value: PrioridadTarea.ALTA, label: "Alta" },
  { value: PrioridadTarea.MEDIA, label: "Media" },
  { value: PrioridadTarea.BAJA, label: "Baja" },
] as const;

export const estadoTareaOptions = [
  { value: EstadoTarea.PENDIENTE, label: "Pendiente" },
  { value: EstadoTarea.EN_PROCESO, label: "En Proceso" },
  { value: EstadoTarea.COMPLETADA, label: "Completada" },
  { value: EstadoTarea.CANCELADA, label: "Cancelada" },
] as const;
