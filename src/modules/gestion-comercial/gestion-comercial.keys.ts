export const gestionKeys = {
    all: ['gestiones'] as const,
    byAsesor: (idAsesor: string) => ['gestiones', 'asesor', idAsesor] as const,
    byCliente: (idCliente: string) => ['gestiones', 'cliente', idCliente] as const,
    detail: (id: string) => ['gestiones', id] as const,
};
