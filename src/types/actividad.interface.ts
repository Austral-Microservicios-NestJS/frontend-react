// ==================== ENUMS ====================

export enum TipoActividad {
  REUNION = "REUNION",
  LLAMADA = "LLAMADA",
  EMAIL = "EMAIL",
  VISITA = "VISITA",
  PRESENTACION = "PRESENTACION",
  CAPACITACION = "CAPACITACION",
  OTRO = "OTRO",
}

// ==================== INTERFACES ====================

export interface Actividad {
  idActividad: string;
  creadaPor: string;
  titulo: string;
  descripcion?: string;
  tipoActividad: TipoActividad;
  fechaActividad: string;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CreateActividad {
  creadaPor: string;
  titulo: string;
  descripcion?: string;
  tipoActividad: TipoActividad;
  fechaActividad: string;
}

export interface UpdateActividad {
  titulo?: string;
  descripcion?: string;
  tipoActividad?: TipoActividad;
  fechaActividad?: string;
}

// ==================== OPTIONS FOR SELECTS ====================

export const tipoActividadOptions = [
  { value: TipoActividad.REUNION, label: "Reunión" },
  { value: TipoActividad.LLAMADA, label: "Llamada" },
  { value: TipoActividad.EMAIL, label: "Email" },
  { value: TipoActividad.VISITA, label: "Visita" },
  { value: TipoActividad.PRESENTACION, label: "Presentación" },
  { value: TipoActividad.CAPACITACION, label: "Capacitación" },
  { value: TipoActividad.OTRO, label: "Otro" },
] as const;
