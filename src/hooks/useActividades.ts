import { useMemo } from "react";
import { toast } from "sonner";
import type { CreateActividad, UpdateActividad, TipoActividad } from "@/types/actividad.interface";
import { actividadService } from "@/services/actividad.service";
import { useAuthStore } from "@/store/auth.store";

export const useActividades = (params?: { page?: number; limit?: number }) => {
  const { user } = useAuthStore();
  const idUsuario = user?.idUsuario || "";

  // Obtener actividades del usuario actual
  const { data, isLoading, error } = actividadService.useGetByUsuario(idUsuario, params);
  const actividades = data?.data || [];
  const meta = data?.meta;

  const createMutation = actividadService.useCreate();
  const updateMutation = actividadService.useUpdate();
  const deleteMutation = actividadService.useDelete();

  // Organizar actividades por tipo
  const actividadesPorTipo = useMemo(() => {
    const grouped: Record<TipoActividad, typeof actividades> = {
      REUNION: [],
      LLAMADA: [],
      EMAIL: [],
      VISITA: [],
      PRESENTACION: [],
      CAPACITACION: [],
      OTRO: [],
    };

    actividades.forEach((actividad) => {
      if (grouped[actividad.tipoActividad]) {
        grouped[actividad.tipoActividad].push(actividad);
      }
    });

    return grouped;
  }, [actividades]);

  // Actividades próximas (ordenadas por fecha)
  const actividadesProximas = useMemo(() => {
    const ahora = new Date();
    return actividades
      .filter((a) => new Date(a.fechaActividad) >= ahora)
      .sort((a, b) => new Date(a.fechaActividad).getTime() - new Date(b.fechaActividad).getTime())
      .slice(0, 5);
  }, [actividades]);

  const addActividad = async (actividadData: CreateActividad) => {
    try {
      await createMutation.mutateAsync(actividadData);
      toast.success("Actividad creada exitosamente");
    } catch (error) {
      toast.error("Error al crear la actividad");
      throw error;
    }
  };

  const updateActividad = async (id: string, actividadData: UpdateActividad) => {
    try {
      await updateMutation.mutateAsync({ id, data: actividadData });
      toast.success("Actividad actualizada exitosamente");
    } catch (error) {
      toast.error("Error al actualizar la actividad");
      throw error;
    }
  };

  const deleteActividad = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Actividad eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la actividad");
      throw error;
    }
  };

  return {
    actividades,
    actividadesPorTipo,
    actividadesProximas,
    meta,
    isLoading,
    error,
    addActividad,
    updateActividad,
    deleteActividad,
  };
};
