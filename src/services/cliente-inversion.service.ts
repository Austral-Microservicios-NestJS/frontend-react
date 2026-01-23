import { api } from "@/config/api-client";
import type {
    ClienteInversion,
    CreateClienteInversion,
    UpdateClienteInversion,
} from "@/types/cliente-inversion.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "cliente-inversiones";

// ==================== API FUNCTIONS ====================

export const clienteInversionService = {
    // Listar inversiones por cliente
    getByCliente: async (idCliente: string): Promise<ClienteInversion[]> => {
        try {
            const { data } = await api.get(`/cliente-inversion/cliente/${idCliente}`);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error al obtener inversiones del cliente:", error);
            return [];
        }
    },

    // Obtener inversión por ID
    getById: async (id: string): Promise<ClienteInversion> => {
        const { data } = await api.get(`/cliente-inversion/${id}`);
        return data;
    },

    // Crear inversión
    create: async (
        inversion: CreateClienteInversion
    ): Promise<ClienteInversion> => {
        const { data } = await api.post("/cliente-inversion", inversion);
        return data;
    },

    // Actualizar inversión
    update: async ({
        id,
        data: inversionData,
    }: {
        id: string;
        data: UpdateClienteInversion;
    }): Promise<ClienteInversion> => {
        const { data } = await api.patch(`/cliente-inversion/${id}`, inversionData);
        return data;
    },

    // Eliminar inversión
    delete: async (id: string): Promise<void> => {
        await api.delete(`/cliente-inversion/${id}`);
    },

    // ==================== REACT QUERY HOOKS ====================

    useGetByCliente: (idCliente: string) => {
        return useQuery({
            queryKey: [QUERY_KEY, "cliente", idCliente],
            queryFn: () => clienteInversionService.getByCliente(idCliente),
            enabled: !!idCliente,
            retry: false,
            refetchOnWindowFocus: false,
        });
    },

    useGetById: (id: string) => {
        return useQuery({
            queryKey: [QUERY_KEY, id],
            queryFn: () => clienteInversionService.getById(id),
            enabled: !!id,
        });
    },

    useCreate: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: clienteInversionService.create,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            },
        });
    },

    useUpdate: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: clienteInversionService.update,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            },
        });
    },

    useDelete: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: clienteInversionService.delete,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            },
        });
    },
};
