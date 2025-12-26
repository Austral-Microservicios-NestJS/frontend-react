export interface DniData {
  numeroDni: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: string;
  fechaEmision: string;
  fechaCaducidad: string;
}

export interface DniRecord extends DniData {
  id: string;
  idUsuario: string;
  imagePreview?: string;
  fechaCreacion: string;
}

export interface DniApiResponse {
  numero_dni: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  nombres: string | null;
  fecha_nacimiento: string | null;
  fecha_emision: string | null;
  fecha_caducidad: string | null;
  sexo: string | null;
  estado_civil: string | null;
}

export enum EstadoCivil {
  SOLTERO = "SOLTERO",
  CASADO = "CASADO",
  DIVORCIADO = "DIVORCIADO",
  VIUDO = "VIUDO",
}

export const estadoCivilOptions = [
  { value: EstadoCivil.SOLTERO, label: "Soltero(a)" },
  { value: EstadoCivil.CASADO, label: "Casado(a)" },
  { value: EstadoCivil.DIVORCIADO, label: "Divorciado(a)" },
  { value: EstadoCivil.VIUDO, label: "Viudo(a)" },
] as const;
