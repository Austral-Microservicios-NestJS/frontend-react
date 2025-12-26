export interface Usuario {
  idUsuario: string;
  rol: Rol;
  nombreUsuario: string;
  correo: string;
  contrasena: string;
  ultimoAcceso?: Date;
  cuentaBloqueada?: boolean;
  activo?: boolean;
  disponible?: boolean;
  fechaCreacion: Date;
  fechaModificacion?: Date;
  persona?: Persona;
}

interface Persona {
  idPersona: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string;
  direccion?: string;
  fechaCreacion: Date;
  fechaModificacion?: Date;
  idUsuario?: string;
}

export interface Rol {
  idRol: string;
  nombreRol: string;
  descripcion?: string;
}

export interface CreateUsuario {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono?: string;
  direccion?: string;
  correo: string;
  porcentajeComision?: number;
  idRol: string;
}

export interface UpdateUsuario extends Partial<CreateUsuario> {}

export enum TipoDocumento {
  DNI = "DNI",
  CE = "CE",
  PASAPORTE = "PASAPORTE",
  RUC = "RUC",
}

export const tipoDocumentoOptions = [
  { value: TipoDocumento.DNI, label: "DNI" },
  { value: TipoDocumento.CE, label: "CE" },
  { value: TipoDocumento.PASAPORTE, label: "Pasaporte" },
  { value: TipoDocumento.RUC, label: "RUC" },
] as const;
