
export interface Tarea {
    idTarea: string;
    creadaPor: string;
    asunto: string;
    descripcion: string;
    tipoTarea: string; // "SEGUIMIENTO_LEAD", "ELABORAR_PROPUESTA", etc.
    fechaVencimiento: string; // ISO String
    prioridad: string; // "ALTA", "MEDIA", "BAJA"
    estado: string; // "PENDIENTE", "EN_PROGRESO", "COMPLETADA"
    disponible: boolean;
    fechaCreacion: string;
    fechaModificacion: string;
}

export interface CreateTarea {
    asunto: string;
    descripcion?: string;
    tipoTarea: string;
    fechaVencimiento: string; // ISO String
    prioridad: string;
    estado: string;
    creadaPor: string;
}

export enum TipoTarea {
    // Definir tipos de tarea para una aseguradora
    RECLAMO = 'RECLAMO',
    POLIZA = 'POLIZA',
    PAGO = 'PAGO',
    INSPECCION = 'INSPECCION',
    OTRO = 'OTRO',
}

export enum Prioridad {
    BAJA = 'BAJA',
    MEDIA = 'MEDIA',
    ALTA = 'ALTA',
}

export enum Estado {
    PENDIENTE = 'PENDIENTE',
    EN_PROGRESO = 'EN_PROGRESO',
    COMPLETADA = 'COMPLETADA',
}

// Opciones para el formulario con labels amigables
export const tipoTareaOptions = [
    { value: TipoTarea.RECLAMO, label: "Reclamo" },
    { value: TipoTarea.POLIZA, label: "Póliza" },
    { value: TipoTarea.PAGO, label: "Pago" },
    { value: TipoTarea.INSPECCION, label: "Inspección" },
    { value: TipoTarea.OTRO, label: "Otro" },
] as const;

export const prioridadOptions = [
    { value: Prioridad.BAJA, label: "Baja" },
    { value: Prioridad.MEDIA, label: "Media" },
    { value: Prioridad.ALTA, label: "Alta" },
] as const;

export const estadoOptions = [
    { value: Estado.PENDIENTE, label: "Pendiente" },
    { value: Estado.EN_PROGRESO, label: "En Progreso" },
    { value: Estado.COMPLETADA, label: "Completada" },
] as const;