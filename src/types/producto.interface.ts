export interface Producto {
    idProducto: string;
    idCompania: string;
    idRamo: string;
    codigo: string;
    nombre: string;
    descripcion?: string;
    esObligatorio: boolean;
    activo: boolean;
    disponible: boolean;
    fechaCreacion?: Date;
    fechaModificacion?: Date;
}

export interface CreateProductoDto {
    idCompania: string;
    idRamo: string;
    codigo: string;
    nombre: string;
    descripcion?: string;
    esObligatorio?: boolean;
    activo?: boolean;
}

export type UpdateProductoDto = Partial<CreateProductoDto>;
