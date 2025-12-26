import { polizaApi } from "@/services/poliza.service";
import type { CreatePolizaDto } from "@/types/poliza.interface";
import { toast } from "sonner";

export const usePolizas = (idCliente?: string) => {
  const {
    data: polizas = [],
    isLoading,
    isError,
    error,
    refetch: getPolizas,
  } = idCliente 
    ? polizaApi.useGetAllByCliente(idCliente)
    : polizaApi.useGetAll();

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
