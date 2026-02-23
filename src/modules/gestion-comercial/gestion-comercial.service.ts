import { api } from '@/config/api-client';
import type {
    Gestion,
    GestionPaginatedResponse,
    CreateGestion,
    UpdateGestion,
    GestionParams,
} from './gestion-comercial.types';

export const gestionService = {
    getAll: async (params?: GestionParams): Promise<GestionPaginatedResponse> => {
        const { data } = await api.get<GestionPaginatedResponse>('/gestion', { params });
        return data;
    },

    getByAsesor: async (idAsesor: string, params?: GestionParams): Promise<GestionPaginatedResponse> => {
        const { data } = await api.get<GestionPaginatedResponse>(`/gestion/asesor/${idAsesor}`, { params });
        return data;
    },

    getByCliente: async (idCliente: string, params?: GestionParams): Promise<GestionPaginatedResponse> => {
        const { data } = await api.get<GestionPaginatedResponse>(`/gestion/cliente/${idCliente}`, { params });
        return data;
    },

    getById: async (id: string): Promise<Gestion> => {
        const { data } = await api.get<Gestion>(`/gestion/${id}`);
        return data;
    },

    create: async (gestion: CreateGestion): Promise<Gestion> => {
        const { data } = await api.post<Gestion>('/gestion', gestion);
        return data;
    },

    update: async (id: string, gestion: UpdateGestion): Promise<Gestion> => {
        const { data } = await api.patch<Gestion>(`/gestion/${id}`, gestion);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/gestion/${id}`);
    },
};
