import { toast } from "sonner";
import type { CreateCompaniaDto, UpdateCompaniaDto } from "@/types/compania.interface";
import { companiaApi } from "@/services/compania.service";

export const useCompanias = () => {
  const {
    data: companias = [],
    isLoading,
    isError,
    error,
    refetch: getCompanias,
  } = companiaApi.useGetAll();

  const create = companiaApi.useCreate();
  const addCompania = async (data: CreateCompaniaDto) => {
    try {
      await create.mutateAsync(data);
      toast.success("Compañía registrada exitosamente");
    } catch (error) {
      toast.error("No se pudo registrar la compañía.");
    }
  };

  const update = companiaApi.useUpdate();
  const updateCompania = async (id: string, data: UpdateCompaniaDto) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Compañía actualizada exitosamente");
    } catch (error) {
      toast.error("No se pudo actualizar la compañía.");
    }
  };

  const deleteCompania = companiaApi.useDelete();
  const removeCompania = async (id: string) => {
    try {
      await deleteCompania.mutateAsync(id);
      toast.success("Compañía eliminada exitosamente");
    } catch (error) {
      toast.error("No se pudo eliminar la compañía.");
    }
  };

  return {
    addCompania,
    updateCompania,
    removeCompania,
    getCompanias,
    companias,
    isLoading,
    isError,
    error,
  };
};
