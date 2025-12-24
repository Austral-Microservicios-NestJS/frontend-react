export interface Compania {
    idCompania: string;
    ruc: string;
    razonSocial: string;
    nombreComercial: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    web?: string;
    logoUrl?: string;
    activo?: boolean;
    disponible?: boolean;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
}

export interface CreateCompaniaDto {
    ruc: string;
    razonSocial: string;
    nombreComercial: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    web?: string;
    logoUrl?: string;
}

export interface UpdateCompaniaDto extends Partial<Compania> { }

