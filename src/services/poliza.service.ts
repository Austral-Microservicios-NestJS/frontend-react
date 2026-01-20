import { api } from "@/config/api-client";
import type {
  Poliza,
  CreatePolizaDto,
  UpdatePolizaDto,
} from "@/types/poliza.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const POLIZAS_KEY = ["polizas"];

export const polizaApi = {
  getAll: async () => {
    const response = await api.get<Poliza[]>(`/polizas`);
    return response.data || [];
  },

  getAllByCliente: async (idCliente: string) => {
    const response = await api.get<Poliza[]>(`/polizas/cliente/${idCliente}`);
    return response.data || [];
  },

  getAllByUsuario: async (userId: string) => {
    const response = await api.get<Poliza[]>(`/polizas/usuario/${userId}`);
    return response.data || [];
  },

  getAllByUsuarios: async (userIds: string[]) => {
    const response = await api.post<Poliza[]>(`/polizas/usuarios`, {
      userIds,
    });
    return response.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Poliza>(`/polizas/id/${id}`);
    return response.data;
  },

  create: async (poliza: CreatePolizaDto) => {
    const response = await api.post<Poliza>("/polizas", poliza);
    return response.data;
  },

  update: async (id: string, poliza: UpdatePolizaDto) => {
    const response = await api.patch<Poliza>(`/polizas/${id}`, poliza);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/polizas/${id}`);
  },

  // ===== Hooks de React Query =====

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [...POLIZAS_KEY, id],
      queryFn: () => polizaApi.getById(id),
      enabled: !!id,
    });
  },

  useGetAll: () => {
    return useQuery({
      queryKey: POLIZAS_KEY,
      queryFn: () => polizaApi.getAll(),
    });
  },

  useGetAllByCliente: (idCliente: string) => {
    return useQuery({
      queryKey: [...POLIZAS_KEY, "cliente", idCliente],
      queryFn: () => polizaApi.getAllByCliente(idCliente),
      enabled: !!idCliente,
    });
  },

  useGetAllByUsuario: (userId: string) => {
    return useQuery({
      queryKey: [...POLIZAS_KEY, "usuario", userId],
      queryFn: () => polizaApi.getAllByUsuario(userId),
      enabled: !!userId,
    });
  },

  useGetAllByUsuarios: (userIds: string[]) => {
    return useQuery({
      queryKey: [...POLIZAS_KEY, "usuarios", userIds],
      queryFn: () => polizaApi.getAllByUsuarios(userIds),
      enabled: userIds.length > 0,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreatePolizaDto) => polizaApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: POLIZAS_KEY });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdatePolizaDto }) =>
        polizaApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: POLIZAS_KEY });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => polizaApi.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: POLIZAS_KEY });
      },
    });
  },
};
