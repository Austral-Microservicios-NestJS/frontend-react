import type { Rol } from "./usuario.interface";

export interface Asignacion {
  idAsignacion: string;
  supervisor: {
    idUsuario: string;
    nombreUsuario: string;
    correo: string;
    rol?: Rol;
    persona?: {
      nombres?: string;
      apellidos?: string;
    };
  };
  subordinado: {
    idUsuario: string;
    nombreUsuario: string;
    correo: string;
    rol?: Rol;
    persona?: {
      nombres?: string;
      apellidos?: string;
    };
  };
  porcentajeComision: number;
  activo: boolean;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
}

export interface CreateAsignacionDto {
  idSupervisor: string;
  idSubordinado: string;
  porcentajeComision: number;
}
