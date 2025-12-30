export interface Ramo {
  idRamo: string;
  codigo: string;
  nombre: string;
  abreviatura?: string;
  grupo?: string;
  descripcion?: string;
  activo?: boolean;
  disponible?: boolean;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
}

export interface CreateRamoDto {
  codigo: string;
  nombre: string;
  abreviatura?: string;
  grupo?: string;
  descripcion?: string;
  activo?: boolean;
}

export type UpdateRamoDto = Partial<CreateRamoDto>;
