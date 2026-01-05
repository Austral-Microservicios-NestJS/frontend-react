import { useMemo } from "react";
import { toast } from "sonner";
import type { CreateTarea, UpdateTarea, TareaFilters, EstadoTarea } from "@/types/tarea.interface";
import { tareaService } from "@/services/tarea.service";
import { useAuthStore } from "@/store/auth.store";

export const useTareas = (filters?: TareaFilters) => {
  const { user } = useAuthStore();
  const idUsuario = user?.idUsuario || "";

  // Obtener tareas del usuario actual con filtros opcionales
  const { data, isLoading, error } = tareaService.useGetByUsuario(idUsuario, filters);
  const tareas = data?.data || [];
  const meta = data?.meta;

  const createMutation = tareaService.useCreate();
  const updateMutation = tareaService.useUpdate();
  const deleteMutation = tareaService.useDelete();

  // Organizar tareas por estado
  const tareasPorEstado = useMemo(() => {
    return {
      PENDIENTE: tareas.filter((t) => t.estado === "PENDIENTE"),
      EN_PROCESO: tareas.filter((t) => t.estado === "EN_PROCESO"),
      COMPLETADA: tareas.filter((t) => t.estado === "COMPLETADA"),
      CANCELADA: tareas.filter((t) => t.estado === "CANCELADA"),
    };
  }, [tareas]);

  // Contar tareas por prioridad
  const tareasPorPrioridad = useMemo(() => {
    return {
      ALTA: tareas.filter((t) => t.prioridad === "ALTA").length,
      MEDIA: tareas.filter((t) => t.prioridad === "MEDIA").length,
      BAJA: tareas.filter((t) => t.prioridad === "BAJA").length,
    };
  }, [tareas]);

  const addTarea = async (tareaData: CreateTarea) => {
    try {
      await createMutation.mutateAsync(tareaData);
      toast.success("Tarea creada exitosamente");
    } catch (error) {
      toast.error("Error al crear la tarea");
      throw error;
    }
  };

  const updateTarea = async (id: string, tareaData: UpdateTarea) => {
    try {
      await updateMutation.mutateAsync({ id, data: tareaData });
      toast.success("Tarea actualizada exitosamente");
    } catch (error) {
      toast.error("Error al actualizar la tarea");
      throw error;
    }
  };

  const deleteTarea = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Tarea eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la tarea");
      throw error;
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: EstadoTarea) => {
    try {
      await updateMutation.mutateAsync({ id, data: { estado: nuevoEstado } });
      toast.success("Estado actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar el estado");
      throw error;
    }
  };

  return {
    tareas,
    tareasPorEstado,
    tareasPorPrioridad,
    meta,
    isLoading,
    error,
    addTarea,
    updateTarea,
    deleteTarea,
    cambiarEstado,
  };
};
