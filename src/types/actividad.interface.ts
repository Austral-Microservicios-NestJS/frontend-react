export interface Actividad {
  idActividad: string;
  creadaPor: string;
  titulo: string;
  descripcion?: string;
  tipoActividad: TipoActividad;
  fechaActividad: Date;
  disponible: boolean;
  fechaCreacion: Date;
  fechaModificacion?: Date;
}

export interface CreateActividad {
  titulo: string;
  descripcion?: string;
  tipoActividad: TipoActividad;
  fechaActividad: Date;
  creadaPor: string;
}

export interface UpdateActividad extends Partial<CreateActividad> {
  disponible?: boolean;
}

export const TipoActividad = {
  REUNION: "REUNION",
  LLAMADA: "LLAMADA",
  EMAIL: "EMAIL",
  OTRO: "OTRO",
};

export type TipoActividad = keyof typeof TipoActividad;

export const tipoActividadOptions = [
  { value: TipoActividad.REUNION, label: "Reunión" },
  { value: TipoActividad.LLAMADA, label: "Llamada" },
  { value: TipoActividad.EMAIL, label: "Email" },
  { value: TipoActividad.OTRO, label: "Otro" },
] as const;
