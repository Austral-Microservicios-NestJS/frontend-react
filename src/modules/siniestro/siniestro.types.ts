import type { Poliza } from "@/types/poliza.interface";

export enum EstadoSiniestro {
  REPORTADO = "REPORTADO",
  EN_PROCESO = "EN_PROCESO",
  APROBADO = "APROBADO",
  RECHAZADO = "RECHAZADO",
  PAGADO = "PAGADO",
  CERRADO = "CERRADO",
}

export enum TipoSiniestro {
  ACCIDENTE = "ACCIDENTE",
  ROBO = "ROBO",
  DANIO_MATERIAL = "DANIO_MATERIAL",
  INCENDIO = "INCENDIO",
  INUNDACION = "INUNDACION",
  RESPONSABILIDAD_CIVIL = "RESPONSABILIDAD_CIVIL",
  SALUD = "SALUD",
  FALLECIMIENTO = "FALLECIMIENTO",
  INVALIDEZ = "INVALIDEZ",
  OTRO = "OTRO",
}

export const estadoSiniestroOptions = [
  { value: EstadoSiniestro.REPORTADO, label: "Reportado" },
  { value: EstadoSiniestro.EN_PROCESO, label: "En Proceso" },
  { value: EstadoSiniestro.APROBADO, label: "Aprobado" },
  { value: EstadoSiniestro.RECHAZADO, label: "Rechazado" },
  { value: EstadoSiniestro.PAGADO, label: "Pagado" },
  { value: EstadoSiniestro.CERRADO, label: "Cerrado" },
] as const;

export const tipoSiniestroOptions = [
  { value: TipoSiniestro.ACCIDENTE, label: "Accidente" },
  { value: TipoSiniestro.ROBO, label: "Robo" },
  { value: TipoSiniestro.DANIO_MATERIAL, label: "Daño Material" },
  { value: TipoSiniestro.INCENDIO, label: "Incendio" },
  { value: TipoSiniestro.INUNDACION, label: "Inundación" },
  { value: TipoSiniestro.RESPONSABILIDAD_CIVIL, label: "Responsabilidad Civil" },
  { value: TipoSiniestro.SALUD, label: "Salud" },
  { value: TipoSiniestro.FALLECIMIENTO, label: "Fallecimiento" },
  { value: TipoSiniestro.INVALIDEZ, label: "Invalidez" },
  { value: TipoSiniestro.OTRO, label: "Otro" },
] as const;

export interface Siniestro {
  idSiniestro: string;
  numeroSiniestro: string;
  numeroSiniestroCompania?: string;
  idPoliza: string;
  poliza?: Poliza;
  tipoSiniestro: TipoSiniestro;
  estado: EstadoSiniestro;
  fechaOcurrencia: string;
  fechaReporte: string;
  fechaResolucion?: string;
  descripcion: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  montoReclamado?: number;
  montoAprobado?: number;
  montoDeducible?: number;
  moneda: string;
  ajustador?: string;
  observaciones?: string;
  registradoPor: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CreateSiniestro {
  idPoliza: string;
  tipoSiniestro: TipoSiniestro;
  estado?: EstadoSiniestro;
  fechaOcurrencia: string;
  fechaReporte: string;
  fechaResolucion?: string;
  descripcion: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  montoReclamado?: number;
  montoAprobado?: number;
  montoDeducible?: number;
  moneda?: string;
  numeroSiniestroCompania?: string;
  ajustador?: string;
  observaciones?: string;
  registradoPor: string;
}

export interface UpdateSiniestro extends Partial<CreateSiniestro> {}
