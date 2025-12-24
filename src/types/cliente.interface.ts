export enum TipoPersona {
  NATURAL = "NATURAL",
  JURIDICO = "JURIDICO",
}

export enum TipoDocumento {
  DNI = "DNI",
  RUC = "RUC",
  CE = "CE",
  PASAPORTE = "PASAPORTE",
}

export enum TipoDocumentoArchivo {
  DNI_FRONTAL = "DNI_FRONTAL",
  DNI_POSTERIOR = "DNI_POSTERIOR",
  RUC_FICHA = "RUC_FICHA",
  CONSTANCIA_SITUACION = "CONSTANCIA_SITUACION",
  OTRO = "OTRO",
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
