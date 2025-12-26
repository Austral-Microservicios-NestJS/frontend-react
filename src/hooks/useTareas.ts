import { toast } from "sonner";
import type { CreateTarea } from "@/types/tarea.interface";
import { tareaApi } from "@/services/tarea.service";
import { useAuthStore } from "@/store/auth.store";

export const useTareas = () => {
  const { user } = useAuthStore();
  const idUsuario = user?.idUsuario || "";

  const {
    data: tareas = [],
    isLoading,
    isError,
    error,
    refetch: getTareas,
  } = tareaApi.useGetAllByUsuario(idUsuario);

  const create = tareaApi.useCreate();
  const addTarea = async (data: CreateTarea) => {
    try {
      await create.mutateAsync(data);
      toast.success("Tarea registrada exitosamente");
    } catch (error) {
      toast.error("No se pudo registrar la tarea.");
    }
  };

  const update = tareaApi.useUpdate();
  const updateTarea = async (id: string, data: Partial<CreateTarea>) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Tarea actualizada exitosamente");
    } catch (error) {
      toast.error("No se pudo actualizar la tarea.");
    }
  };

  const deleteTarea = tareaApi.useDelete();
  const removeTarea = async (id: string) => {
    try {
      await deleteTarea.mutateAsync(id);
      toast.success("Tarea eliminada exitosamente");
    } catch (error) {
      toast.error("No se pudo eliminar la tarea.");
    }
  };

  return {
    addTarea,
    updateTarea,
    removeTarea,
    getTareas,
    tareas,
    isLoading,
    isError,
    error,
  };
};
