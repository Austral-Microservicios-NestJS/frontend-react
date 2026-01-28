import { useMemo } from "react";
import { toast } from "sonner";
import type { CreateCliente, UpdateCliente } from "@/types/cliente.interface";
import { clienteService } from "@/services/cliente.service";
import { useAuthStore } from "@/store/auth.store";

export const useClientes = () => {
  const { user } = useAuthStore();
  const idUsuario = user?.idUsuario || "";

  // Obtener clientes del usuario actual (pasar rol para filtrado en backend)
  const {
    data: clientes = [],
    isLoading,
    error,
  } = clienteService.useGetByUsuario(idUsuario, user?.rol?.nombreRol);

  const createMutation = clienteService.useCreate();
  const updateMutation = clienteService.useUpdate();
  const deleteMutation = clienteService.useDelete();

  // Organizar clientes por tipo de persona
  const clientesPorTipo = useMemo(() => {
    return {
      NATURAL: clientes.filter((c) => c.tipoPersona === "NATURAL"),
      JURIDICO: clientes.filter((c) => c.tipoPersona === "JURIDICO"),
    };
  }, [clientes]);

  // Clientes activos
  const clientesActivos = useMemo(() => {
    return clientes.filter((c) => c.activo);
  }, [clientes]);

  // Contar clientes por tipo de documento
  const clientesPorDocumento = useMemo(() => {
    return {
      DNI: clientes.filter((c) => c.tipoDocumento === "DNI").length,
      RUC: clientes.filter((c) => c.tipoDocumento === "RUC").length,
      CE: clientes.filter((c) => c.tipoDocumento === "CE").length,
      PASAPORTE: clientes.filter((c) => c.tipoDocumento === "PASAPORTE").length,
    };
  }, [clientes]);

  const addCliente = async (clienteData: CreateCliente) => {
    try {
      await createMutation.mutateAsync(clienteData);
      toast.success("Cliente creado exitosamente");
    } catch (error) {
      toast.error("Error al crear el cliente");
      throw error;
    }
  };

  const updateCliente = async (id: string, clienteData: UpdateCliente) => {
    try {
      await updateMutation.mutateAsync({ id, data: clienteData });
      toast.success("Cliente actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar el cliente");
      throw error;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Cliente eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar el cliente");
      throw error;
    }
  };

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, data: { activo } });
      toast.success(
        `Cliente ${activo ? "activado" : "desactivado"} exitosamente`,
      );
    } catch (error) {
      toast.error("Error al cambiar el estado del cliente");
      throw error;
    }
  };

  return {
    clientes,
    clientesPorTipo,
    clientesActivos,
    clientesPorDocumento,
    isLoading,
    error,
    addCliente,
    updateCliente,
    deleteCliente,
    toggleActivo,
  };
};
