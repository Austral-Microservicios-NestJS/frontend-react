import { polizaApi } from "@/services/poliza.service";
import type { CreatePolizaDto } from "@/types/poliza.interface";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth.store";
import { useAgentes } from "@/hooks/useAgentes";

export const usePolizas = (idCliente?: string) => {
  const { user } = useAuthStore();
  const { agentes } = useAgentes();
  const userRole = user?.rol?.nombreRol || "";
  const userId = user?.idUsuario || "";

  // Logic to determine which query to run
  const getQuery = () => {
    // 1. If searching by specific client, always prioritize that
    if (idCliente) return polizaApi.useGetAllByCliente(idCliente);

    // 2. Role based logic
    if (userRole === "ADMINISTRADOR") {
      return polizaApi.useGetAll();
    }

    if (userRole === "BROKER") {
      // Get IDs of all agents + the broker themselves? Or just agents?
      // Requirement says: "tengo agentes a mi disposicion y puedo ver las polizas de todos sus clientes"
      // Assuming this means ALL policies assigned to my agents.
      const agentIds = agentes.map((a) => a.idUsuario);
      // Also include the broker? Maybe. But let's stick to agents.
      // If agents list is empty, this might return empty or error.
      // We should pass agentIds. If empty, maybe handle gracefully.
      return polizaApi.useGetAllByUsuarios(agentIds);
    }

    if (userRole === "AGENTE") {
      return polizaApi.useGetAllByUsuario(userId);
    }

    // Default fallback (maybe empty or standard getAll if permissions allow)
    return polizaApi.useGetAll();
  };

  const {
    data: polizas = [],
    isLoading,
    isError,
    error,
    refetch: getPolizas,
  } = getQuery();

  const create = polizaApi.useCreate();
  const update = polizaApi.useUpdate();
  const deletePoliza = polizaApi.useDelete();

  const addPoliza = async (data: CreatePolizaDto) => {
    try {
      await create.mutateAsync(data);
      toast.success("Póliza registrada exitosamente");
    } catch (error) {
      console.error("Error al registrar póliza:", error);
      toast.error("No se pudo registrar la póliza");
      throw error;
    }
  };

  const updatePoliza = async (id: string, data: Partial<CreatePolizaDto>) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Póliza actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar póliza:", error);
      toast.error("No se pudo actualizar la póliza");
      throw error;
    }
  };

  const removePoliza = async (id: string) => {
    try {
      await deletePoliza.mutateAsync(id);
      toast.success("Póliza eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar póliza:", error);
      toast.error("No se pudo eliminar la póliza");
      throw error;
    }
  };

  return {
    polizas,
    isLoading,
    isError,
    error,
    addPoliza,
    updatePoliza,
    removePoliza,
    getPolizas,
  };
};
