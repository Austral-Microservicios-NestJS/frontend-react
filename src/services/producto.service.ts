import { api } from "@/config/api-client";
import type {
  Producto,
  CreateProductoDto,
  UpdateProductoDto,
} from "@/types/producto.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const PRODUCTOS_KEY = ["productos"];

export const productoApi = {
  getAll: async () => {
    const response = await api.get<Producto[]>(`/productos`);
    return response.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Producto>(`/productos/${id}`);
    return response.data;
  },

  getByCompaniaAndRamo: async (idCompania: string, idRamo: string) => {
    const response = await api.get<Producto[]>(
      `/productos/by-compania-ramo?idCompania=${idCompania}&idRamo=${idRamo}`
    );
    return response.data || [];
  },

  getByRamo: async (idRamo: string) => {
    const response = await api.get<Producto[]>(`/productos/ramo/${idRamo}`);
    return response.data || [];
  },

  create: async (producto: CreateProductoDto) => {
    const response = await api.post<Producto>("/productos", producto);
    return response.data;
  },

  update: async (id: string, producto: UpdateProductoDto) => {
    const response = await api.patch<Producto>(`/productos/${id}`, producto);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/productos/${id}`);
  },

  // ===== Hooks de React Query =====

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [...PRODUCTOS_KEY, id],
      queryFn: () => productoApi.getById(id),
      enabled: !!id,
    });
  },

  useGetAll: () => {
    return useQuery({
      queryKey: PRODUCTOS_KEY,
      queryFn: () => productoApi.getAll(),
    });
  },

  useGetByCompaniaAndRamo: (idCompania: string, idRamo: string) => {
    return useQuery({
      queryKey: [...PRODUCTOS_KEY, "compania", idCompania, "ramo", idRamo],
      queryFn: () => productoApi.getByCompaniaAndRamo(idCompania, idRamo),
      enabled: !!idCompania && !!idRamo,
    });
  },

  useGetByRamo: (idRamo: string) => {
    return useQuery({
      queryKey: [...PRODUCTOS_KEY, "ramo", idRamo],
      queryFn: () => productoApi.getByRamo(idRamo),
      enabled: !!idRamo,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateProductoDto) => productoApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateProductoDto }) =>
        productoApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => productoApi.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: PRODUCTOS_KEY });
      },
    });
  },
};
