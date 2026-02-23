// ==================== ENUMS ====================

export enum GestionTipo {
    LLAMADA = 'Llamada',
    REUNION = 'Reunión',
    SEGUIMIENTO = 'Seguimiento',
    RENOVACION = 'Renovación',
    SINIESTRO = 'Siniestro',
    OTRO = 'Otro',
}

export enum GestionEstado {
    PENDIENTE = 'Pendiente',
    COMPLETADO = 'Completado',
    VENCIDO = 'Vencido',
    CANCELADO = 'Cancelado',
}

export enum GestionPrioridad {
    ALTA = 'Alta',
    MEDIA = 'Media',
    BAJA = 'Baja',
}

export enum GestionCanal {
    PRESENCIAL = 'Presencial',
    TELEFONICO = 'Telefónico',
    VIRTUAL = 'Virtual',
}

// ==================== OPTIONS (para selects/filtros) ====================

export const gestionTipoOptions = [
    { value: GestionTipo.LLAMADA, label: 'Llamada' },
    { value: GestionTipo.REUNION, label: 'Reunión' },
    { value: GestionTipo.SEGUIMIENTO, label: 'Seguimiento' },
    { value: GestionTipo.RENOVACION, label: 'Renovación' },
    { value: GestionTipo.SINIESTRO, label: 'Siniestro' },
    { value: GestionTipo.OTRO, label: 'Otro' },
] as const;

export const gestionEstadoOptions = [
    { value: GestionEstado.PENDIENTE, label: 'Pendiente' },
    { value: GestionEstado.COMPLETADO, label: 'Completado' },
    { value: GestionEstado.VENCIDO, label: 'Vencido' },
    { value: GestionEstado.CANCELADO, label: 'Cancelado' },
] as const;

export const gestionPrioridadOptions = [
    { value: GestionPrioridad.ALTA, label: 'Alta' },
    { value: GestionPrioridad.MEDIA, label: 'Media' },
    { value: GestionPrioridad.BAJA, label: 'Baja' },
] as const;

export const gestionCanalOptions = [
    { value: GestionCanal.PRESENCIAL, label: 'Presencial' },
    { value: GestionCanal.TELEFONICO, label: 'Telefónico' },
    { value: GestionCanal.VIRTUAL, label: 'Virtual' },
] as const;

// ==================== ENTIDADES RELACIONADAS ====================

export interface GestionArchivo {
    idGestionArchivo: string;
    idGestion: string;
    nombreArchivo: string;
    tipoMime: string;
    peso: number;
    urlStorage: string;
    fechaCreacion: string;
}

export interface GestionComentario {
    idGestionComentario: string;
    idGestion: string;
    idAsesor: string;
    comentario: string;
    fechaCreacion: string;
    fechaActualizacion: string;
}

export interface GestionRecordatorio {
    idGestionRecordatorio: string;
    idGestion: string;
    fechaHoraAlerta: string;
    mensaje: string;
    leido: boolean;
    fechaCreacion: string;
}

// ==================== ENTIDAD PRINCIPAL ====================

export interface Gestion {
    idGestion: string;
    tipo: GestionTipo;
    estado: GestionEstado;
    prioridad: GestionPrioridad;
    fechaProgramada?: string;
    fechaVencimiento?: string;
    descripcion?: string;
    canal: GestionCanal;
    meetLink?: string;
    idCliente: string;
    idPoliza?: string;
    idSiniestro?: string;
    idAsesor: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    archivos: GestionArchivo[];
    comentarios: GestionComentario[];
    recordatorios: GestionRecordatorio[];
}

// ==================== PAGINATED RESPONSE ====================

export interface GestionPaginatedResponse {
    data: Gestion[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

// ==================== DTOs ====================

export interface CreateGestion {
    tipo?: GestionTipo;
    estado?: GestionEstado;
    prioridad?: GestionPrioridad;
    fechaProgramada?: string;
    fechaVencimiento?: string;
    descripcion?: string;
    canal?: GestionCanal;
    meetLink?: string;
    idCliente: string;
    idPoliza?: string;
    idSiniestro?: string;
    idAsesor: string;
}

export interface UpdateGestion extends Partial<CreateGestion> { }

export interface GestionParams {
    page?: number;
    limit?: number;
}
