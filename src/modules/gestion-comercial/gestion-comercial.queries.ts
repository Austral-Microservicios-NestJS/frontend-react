import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gestionService } from './gestion-comercial.service';
import { gestionKeys } from './gestion-comercial.keys';
import type { CreateGestion, UpdateGestion, GestionParams } from './gestion-comercial.types';

export const useGetGestiones = (params?: GestionParams) => {
    return useQuery({
        queryKey: [...gestionKeys.all, params],
        queryFn: () => gestionService.getAll(params),
        refetchOnWindowFocus: false,
    });
};

export const useGetGestionesByAsesor = (idAsesor: string, params?: GestionParams) => {
    return useQuery({
        queryKey: [...gestionKeys.byAsesor(idAsesor), params],
        queryFn: () => gestionService.getByAsesor(idAsesor, params),
        enabled: !!idAsesor,
        refetchOnWindowFocus: false,
    });
};

export const useGetGestionesByCliente = (idCliente: string, params?: GestionParams) => {
    return useQuery({
        queryKey: [...gestionKeys.byCliente(idCliente), params],
        queryFn: () => gestionService.getByCliente(idCliente, params),
        enabled: !!idCliente,
        refetchOnWindowFocus: false,
    });
};

export const useGetGestion = (id: string) => {
    return useQuery({
        queryKey: gestionKeys.detail(id),
        queryFn: () => gestionService.getById(id),
        enabled: !!id,
        refetchOnWindowFocus: false,
    });
};

export const useCreateGestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (gestion: CreateGestion) => gestionService.create(gestion),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: gestionKeys.byCliente(data.idCliente) });
            queryClient.invalidateQueries({ queryKey: gestionKeys.byAsesor(data.idAsesor) });
            queryClient.invalidateQueries({ queryKey: gestionKeys.all });
        },
    });
};

export const useUpdateGestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateGestion }) =>
            gestionService.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: gestionKeys.byCliente(data.idCliente) });
            queryClient.invalidateQueries({ queryKey: gestionKeys.byAsesor(data.idAsesor) });
            queryClient.invalidateQueries({ queryKey: gestionKeys.detail(data.idGestion) });
        },
    });
};

export const useDeleteGestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => gestionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: gestionKeys.all });
        },
    });
};
