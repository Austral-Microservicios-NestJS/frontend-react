import { api } from "@/config/api-client";
import type { Cliente, CreateCliente, UpdateCliente, ClienteContexto } from "@/types/cliente.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "clientes";

// ==================== API FUNCTIONS ====================

export const clienteService = {
  // Listar todos los clientes con paginación
  getAll: async (params?: { page?: number; limit?: number }): Promise<{ data: Cliente[]; meta: any }> => {
    try {
      const response = await api.get("/clientes", { params });
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      return { data: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }
  },

  // Obtener cliente por ID
  getById: async (id: string): Promise<Cliente> => {
    const { data } = await api.get(`/clientes/id/${id}`);
    return data;
  },

  // Listar clientes por usuario (opcionalmente pasando rol como query param)
  getByUsuario: async (idUsuario: string, rol?: string): Promise<Cliente[]> => {
    try {
      const params: Record<string, string> = {};
      if (rol) params.rol = rol;
      const { data } = await api.get(`/clientes/usuario/${idUsuario}`, { params });
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error("Error al obtener clientes del usuario:", error);
      return [];
    }
  },

  // Crear cliente
  create: async (cliente: CreateCliente): Promise<Cliente> => {
    const { data } = await api.post("/clientes", cliente);
    return data;
  },

  // Actualizar cliente
  update: async ({ id, data: clienteData }: { id: string; data: UpdateCliente }): Promise<Cliente> => {
    const { data } = await api.patch(`/clientes/${id}`, clienteData);
    return data;
  },

  // Eliminar cliente
  delete: async (id: string): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },

  // Agregar contexto para IA
  agregarContexto: async (params: {
    idCliente: string;
    tipoContexto: string;
    contenido: string;
    creadoPor: string;
  }): Promise<any> => {
    const { data } = await api.post("/clientes/contexto", params);
    return data;
  },

  // Obtener contextos de un cliente
  getContextos: async (idCliente: string): Promise<ClienteContexto[]> => {
    try {
      const { data } = await api.get(`/clientes/${idCliente}/contextos`);
      // El backend retorna un array directo, no un objeto con 'value'
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener contextos del cliente:", error);
      return [];
    }
  },

  // ==================== REACT QUERY HOOKS ====================

  useGetAll: (params?: { page?: number; limit?: number }) => {
    return useQuery({
      queryKey: [QUERY_KEY, "all", params],
      queryFn: () => clienteService.getAll(params),
      retry: false,
      refetchOnWindowFocus: false,
    });
  },

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, id],
      queryFn: () => clienteService.getById(id),
      enabled: !!id,
    });
  },

  useGetByUsuario: (idUsuario: string, rol?: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, "usuario", idUsuario, rol || null],
      queryFn: () => clienteService.getByUsuario(idUsuario, rol),
      enabled: !!idUsuario,
      retry: false,
      refetchOnWindowFocus: false,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: clienteService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: clienteService.update,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useDelete: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: clienteService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useAgregarContexto: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: clienteService.agregarContexto,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      },
    });
  },

  useGetContextos: (idCliente: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, "contextos", idCliente],
      queryFn: () => clienteService.getContextos(idCliente),
      enabled: !!idCliente,
      retry: false,
      refetchOnWindowFocus: false,
    });
  },
};
