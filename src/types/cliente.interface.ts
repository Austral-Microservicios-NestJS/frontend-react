export enum TipoPersona {
  NATURAL = "NATURAL",
  JURIDICO = "JURIDICO",
}

export const tipoPersonaOptions = [
  { value: TipoPersona.NATURAL, label: "Natural" },
  { value: TipoPersona.JURIDICO, label: "Jurídico" },
] as const;


export enum TipoDocumento {
  DNI = "DNI",
  RUC = "RUC",
  CE = "CE",
  PASAPORTE = "PASAPORTE",
}

export const tipoDocumentoOptions = [
  { value: TipoDocumento.DNI, label: "DNI" },
  { value: TipoDocumento.CE, label: "CE" },
  { value: TipoDocumento.PASAPORTE, label: "Pasaporte" },
  { value: TipoDocumento.RUC, label: "RUC" },
] as const;


export enum TipoDocumentoArchivo {
  DNI_FRONTAL = "DNI_FRONTAL",
  DNI_POSTERIOR = "DNI_POSTERIOR",
  RUC_FICHA = "RUC_FICHA",
  CONSTANCIA_SITUACION = "CONSTANCIA_SITUACION",
  OTRO = "OTRO",
}

export const tipoDocumentoArchivoOptions = [
  { value: TipoDocumentoArchivo.DNI_FRONTAL, label: "DNI" },
  { value: TipoDocumentoArchivo.DNI_POSTERIOR, label: "DNI Posterior" },
  { value: TipoDocumentoArchivo.RUC_FICHA, label: "RUC" },
  { value: TipoDocumentoArchivo.CONSTANCIA_SITUACION, label: "Constancia de Situación" },
  { value: TipoDocumentoArchivo.OTRO, label: "Otro" },
] as const;


export interface ClienteContexto {
  idContexto: string;
  idCliente: string;
  tipoContexto: string;
  contenido: string;
  creadoPor: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface ClienteContacto {
  idContacto?: string;
  idCliente?: string;
  nombre: string;
  cargo?: string;
  telefono?: string;
  correo?: string;
}

export interface ClienteDocumento {
  idDocumento?: string;
  idCliente?: string;
  tipoDocumento: TipoDocumentoArchivo;
  urlArchivo: string;
  descripcion?: string;
}

export interface Cliente {
  idCliente: string;
  tipoPersona: TipoPersona;
  razonSocial?: string;
  nombres?: string;
  apellidos?: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: number;
  direccion: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  latitud?: number;
  longitud?: number;
  telefono1: string;
  telefono2?: string;
  whatsapp?: string;
  emailNotificaciones?: string;
  recibirNotificaciones: boolean;
  cumpleanos?: string; // Date string
  activo: boolean;
  disponible: boolean;
  asignadoA?: string;
  registradoPor: string;
  fechaCreacion: string;
  fechaModificacion: string;
  contactos?: ClienteContacto[];
  documentos?: ClienteDocumento[];
}

export interface CreateCliente
  extends Omit<
    Cliente,
    | "idCliente"
    | "fechaCreacion"
    | "fechaModificacion"
    | "activo"
    | "disponible"
    | "contactos"
    | "documentos"
  > {
  activo?: boolean;
  contactos: ClienteContacto[];
  documentos: ClienteDocumento[];
}

export interface UpdateCliente extends Partial<CreateCliente> { }
