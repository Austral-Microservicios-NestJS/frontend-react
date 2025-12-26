import { toast } from "sonner";
import type { CreateRamoDto, UpdateRamoDto } from "@/types/ramo.interface";
import { ramoApi } from "@/services/ramo.service";

export const useRamos = () => {
  const {
    data: ramos = [],
    isLoading,
    isError,
    error,
    refetch: getRamos,
  } = ramoApi.useGetAll();

  const create = ramoApi.useCreate();
  const addRamo = async (data: CreateRamoDto) => {
    try {
      await create.mutateAsync(data);
      toast.success("Ramo registrado exitosamente");
    } catch (error) {
      toast.error("No se pudo registrar el ramo.");
    }
  };

  const update = ramoApi.useUpdate();
  const updateRamo = async (id: string, data: UpdateRamoDto) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Ramo actualizado exitosamente");
    } catch (error) {
      toast.error("No se pudo actualizar el ramo.");
    }
  };

  const deleteRamo = ramoApi.useDelete();
  const removeRamo = async (id: string) => {
    try {
      await deleteRamo.mutateAsync(id);
      toast.success("Ramo eliminado exitosamente");
    } catch (error) {
      toast.error("No se pudo eliminar el ramo.");
    }
  };

  return {
    addRamo,
    updateRamo,
    removeRamo,
    getRamos,
    ramos,
    isLoading,
    isError,
    error,
  };
};
