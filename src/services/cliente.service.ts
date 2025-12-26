import { api } from "@/config/api-client";
import type { Cliente, CreateCliente, UpdateCliente } from "@/types/cliente.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CLIENTES_KEY = ["clientes"];

export const clienteApi = {
  getAll: async () => {
    const response = await api.get<Cliente[]>(`/clientes`);
    return response.data || [];
  },

  getAllByUsuario: async (idUsuario: string) => {
    const response = await api.get<{ data: Cliente[] }>(`/clientes/usuario/${idUsuario}`);
    return response.data.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  create: async (cliente: CreateCliente) => {
    const response = await api.post<Cliente>("/clientes", cliente);
    return response.data;
  },

  update: async (id: string, cliente: UpdateCliente) => {
    const response = await api.patch<Cliente>(`/clientes/${id}`, cliente);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/clientes/${id}`);
  },

  // ===== Hooks de React Query =====

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [...CLIENTES_KEY, id],
      queryFn: () => clienteApi.getById(id),
      enabled: !!id,
    });
  },

  useGetAll: () => {
    return useQuery({
      queryKey: CLIENTES_KEY,
      queryFn: () => clienteApi.getAll(),
    });
  },

  useGetAllByUsuario: (idUsuario: string) => {
    return useQuery({
      queryKey: [...CLIENTES_KEY, "usuario", idUsuario],
      queryFn: () => clienteApi.getAllByUsuario(idUsuario),
      enabled: !!idUsuario,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateCliente) => clienteApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CLIENTES_KEY });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateCliente }) =>
        clienteApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CLIENTES_KEY });
      },
    });
  },
};
