import { api } from "@/config/api-client";
import type {
  Usuario,
  CreateUsuario,
  UpdateUsuario,
} from "@/types/usuario.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const USUARIOS_KEY = ["usuarios"];

export const usuarioApi = {
  getAll: async () => {
    const response = await api.get<Usuario[]>(`/usuarios`);
    return response.data || [];
  },

  getById: async (id: string) => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  getSubordinados: async (idSupervisor: string) => {
    const response = await api.get<any[]>(`/asignaciones/subordinados/${idSupervisor}`);
    // Mapear asignaciones a usuarios con porcentajeComision incluido
    return (
      response.data.map((asignacion: any) => ({
        ...asignacion.subordinado,
        porcentajeComision:
          asignacion.comision ??
          asignacion.porcentajeComision ??
          asignacion.subordinado?.porcentajeComision,
        idAsignacion: asignacion.idAsignacion,
        supervisor: asignacion.supervisor,
        activo: asignacion.activo ?? asignacion.subordinado?.activo,
        fechaCreacion:
          asignacion.fechaCreacion ?? asignacion.subordinado?.fechaCreacion,
        fechaModificacion:
          asignacion.fechaModificacion ??
          asignacion.subordinado?.fechaModificacion,
      })) || []
    );
  },

  create: async (usuario: CreateUsuario) => {
    const response = await api.post<Usuario>("/usuarios", usuario);
    return response.data;
  },

  update: async (id: string, usuario: UpdateUsuario) => {
    const response = await api.patch<Usuario>(`/usuarios/${id}`, usuario);
    return response.data;
  },

  getBrokersBySupervisor: async (idSupervisor: string) => {
    const response = await api.get<any[]>(`/usuarios/brokers/supervisor/${idSupervisor}`);
    return response.data || [];
  },

  // ===== Hooks de React Query =====

  useGetById: (id: string) => {
    return useQuery({
      queryKey: [...USUARIOS_KEY, id],
      queryFn: () => usuarioApi.getById(id),
      enabled: !!id,
    });
  },

  useGetAll: () => {
    return useQuery({
      queryKey: USUARIOS_KEY,
      queryFn: () => usuarioApi.getAll(),
    });
  },

  useGetBrokersBySupervisor: (idSupervisor: string) => {
    return useQuery({
      queryKey: [...USUARIOS_KEY, "brokers", "supervisor", idSupervisor],
      queryFn: () => usuarioApi.getBrokersBySupervisor(idSupervisor),
      enabled: !!idSupervisor,
    });
  },

  useGetSubordinados: (idSupervisor: string) => {
    return useQuery({
      queryKey: [...USUARIOS_KEY, "subordinados", idSupervisor],
      queryFn: () => usuarioApi.getSubordinados(idSupervisor),
      enabled: !!idSupervisor,
    });
  },

  useCreate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateUsuario) => usuarioApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: USUARIOS_KEY });
      },
    });
  },

  useUpdate: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateUsuario }) =>
        usuarioApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: USUARIOS_KEY });
      },
    });
  },
};
