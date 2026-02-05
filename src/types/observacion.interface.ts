// ==================== ENUMS ====================

export enum CategoriaObservacion {
  BUG = "BUG",
  MEJORA = "MEJORA",
  SUGERENCIA = "SUGERENCIA",
  PREGUNTA = "PREGUNTA",
  OTRO = "OTRO",
}

export enum PrioridadObservacion {
  BAJA = "BAJA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
  CRITICA = "CRITICA",
}

export enum CanalObservacion {
  SISTEMA = "SISTEMA",
  WHATSAPP = "WHATSAPP",
}

export enum EstadoObservacion {
  PENDIENTE = "PENDIENTE",
  EN_REVISION = "EN_REVISION",
  RESUELTO = "RESUELTO",
  CERRADO = "CERRADO",
}

// ==================== INTERFACES ====================

export interface Observacion {
  idObservacion: number;
  asunto: string;
  descripcion: string;
  categoria: CategoriaObservacion;
  prioridad: PrioridadObservacion;
  canal: CanalObservacion;
  imagenEvidencia?: string | null; // URL de la imagen en storage
  estado: EstadoObservacion;
  fechaResolucion?: string | null;
  creadoPor: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateObservacion {
  asunto: string;
  descripcion: string;
  categoria: CategoriaObservacion;
  prioridad?: PrioridadObservacion;
  canal: CanalObservacion;
  imagenEvidencia?: string;
  estado: EstadoObservacion;
  creadoPor: string;
  imagen?: File;
}

export interface UpdateObservacion {
  asunto?: string;
  descripcion?: string;
  categoria?: CategoriaObservacion;
  prioridad?: PrioridadObservacion;
  canal?: CanalObservacion;
  imagenEvidencia?: string;
  estado?: EstadoObservacion;
  fechaResolucion?: string | null;
  imagen?: File;
}

// ==================== OPTIONS FOR SELECTS ====================

export const categoriaObservacionOptions = [
  { value: CategoriaObservacion.BUG, label: "Bug" },
  { value: CategoriaObservacion.MEJORA, label: "Mejora" },
  { value: CategoriaObservacion.SUGERENCIA, label: "Sugerencia" },
  { value: CategoriaObservacion.PREGUNTA, label: "Pregunta" },
  { value: CategoriaObservacion.OTRO, label: "Otro" },
] as const;

export const prioridadObservacionOptions = [
  { value: PrioridadObservacion.BAJA, label: "Baja" },
  { value: PrioridadObservacion.MEDIA, label: "Media" },
  { value: PrioridadObservacion.ALTA, label: "Alta" },
  { value: PrioridadObservacion.CRITICA, label: "Crítica" },
] as const;

export const canalObservacionOptions = [
  { value: CanalObservacion.SISTEMA, label: "Sistema" },
  { value: CanalObservacion.WHATSAPP, label: "WhatsApp" },
] as const;

export const estadoObservacionOptions = [
  { value: EstadoObservacion.PENDIENTE, label: "Pendiente" },
  { value: EstadoObservacion.EN_REVISION, label: "En Revisión" },
  { value: EstadoObservacion.RESUELTO, label: "Resuelto" },
  { value: EstadoObservacion.CERRADO, label: "Cerrado" },
] as const;
