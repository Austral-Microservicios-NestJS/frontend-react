export interface Tarea {
  idTarea: string;
  creadaPor: string;
  asunto: string;
  descripcion: string;
  tipoTarea: TipoTarea;
  fechaVencimiento: string;
  prioridad: Prioridad;
  estado: Estado;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CreateTarea {
  asunto: string;
  descripcion?: string;
  tipoTarea: TipoTarea;
  fechaVencimiento: string;
  prioridad: Prioridad;
  estado: Estado;
  creadaPor: string;
}

export interface UpdateTarea extends Partial<CreateTarea> {
  disponible?: boolean;
}

export const TipoTarea = {
  RECLAMO: "RECLAMO",
  POLIZA: "POLIZA",
  PAGO: "PAGO",
  INSPECCION: "INSPECCION",
  OTRO: "OTRO",
};

export type TipoTarea = keyof typeof TipoTarea;

export const Prioridad = {
  BAJA: "BAJA",
  MEDIA: "MEDIA",
  ALTA: "ALTA",
};

export type Prioridad = keyof typeof Prioridad;

export const Estado = {
  PENDIENTE: "PENDIENTE",
  EN_PROGRESO: "EN_PROGRESO",
  COMPLETADA: "COMPLETADA",
};

export type Estado = keyof typeof Estado;

export const tipoTareaOptions = [
  { value: TipoTarea.RECLAMO, label: "Reclamo" },
  { value: TipoTarea.POLIZA, label: "Póliza" },
  { value: TipoTarea.PAGO, label: "Pago" },
  { value: TipoTarea.INSPECCION, label: "Inspección" },
  { value: TipoTarea.OTRO, label: "Otro" },
] as const;

export const prioridadOptions = [
  { value: Prioridad.BAJA, label: "Baja" },
  { value: Prioridad.MEDIA, label: "Media" },
  { value: Prioridad.ALTA, label: "Alta" },
] as const;

export const estadoOptions = [
  { value: Estado.PENDIENTE, label: "Pendiente" },
  { value: Estado.EN_PROGRESO, label: "En Progreso" },
  { value: Estado.COMPLETADA, label: "Completada" },
] as const;
