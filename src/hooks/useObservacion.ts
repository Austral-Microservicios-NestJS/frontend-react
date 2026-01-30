import { toast } from "sonner";
import type {
  CreateObservacion,
  UpdateObservacion,
  EstadoObservacion,
} from "@/types/observacion.interface";
import { observacionService } from "@/services/observacion.service";
import { useAuthStore } from "@/store/auth.store";

export const useObservacion = () => {
  const { user } = useAuthStore();
  const userId = user?.idUsuario || "";

  // Obtener todas las observaciones
  const {
    data: observaciones = [],
    isLoading,
    error,
  } = observacionService.useGetAll();

  const createMutation = observacionService.useCreate();
  const updateMutation = observacionService.useUpdate();
  const deleteMutation = observacionService.useDelete();

  const addObservacion = async (
    observacionData: Omit<CreateObservacion, "creadoPor">,
  ) => {
    try {
      await createMutation.mutateAsync({
        ...observacionData,
        creadoPor: userId,
      });
      toast.success("Observación registrada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar la observación");
      throw error;
    }
  };

  const updateObservacion = async (
    id: number,
    observacionData: UpdateObservacion,
  ) => {
    try {
      await updateMutation.mutateAsync({ id, data: observacionData });
      toast.success("Observación actualizada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la observación");
      throw error;
    }
  };

  const deleteObservacion = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Observación eliminada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la observación");
      throw error;
    }
  };

  const cambiarEstado = async (id: number, nuevoEstado: EstadoObservacion) => {
    try {
      await updateMutation.mutateAsync({ id, data: { estado: nuevoEstado } });
      toast.success("Estado actualizado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
      throw error;
    }
  };

  return {
    observaciones,
    isLoading,
    error,
    addObservacion,
    updateObservacion,
    deleteObservacion,
    cambiarEstado,
  };
};
