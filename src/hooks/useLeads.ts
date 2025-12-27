import { useMemo } from "react";
import { toast } from "sonner";
import { leadService } from "@/services/lead.service";
import type { CreateLead, UpdateLead, EstadoLead } from "@/types/lead.interface";
import { useAuthStore } from "@/store/auth.store";

export const useLeads = () => {
  const { user } = useAuthStore();
  const { data: allLeads = [], isLoading, error } = leadService.useGetAll();
  const createMutation = leadService.useCreate();
  const updateMutation = leadService.useUpdate();
  const deleteMutation = leadService.useDelete();

  // Filtrar leads por usuario actual
  const leads = useMemo(() => {
    // Validar que allLeads sea un array
    if (!Array.isArray(allLeads)) {
      console.warn("allLeads no es un array:", allLeads);
      return [];
    }

    // NOTA: El backend actual NO incluye idUsuario en los leads
    // Por ahora mostramos todos los leads
    // TODO: Cuando el backend agregue idUsuario, descomentar el filtro:
    // if (!user?.idUsuario) return [];
    // return allLeads.filter((lead) => lead.idUsuario === user.idUsuario);

    return allLeads;
  }, [allLeads]);

  // Organizar leads por estado para el Kanban (solo 4 estados)
  const leadsByEstado = useMemo(() => {
    return {
      NUEVO: leads.filter((lead) => lead.estado === "NUEVO"),
      CONTACTADO: leads.filter((lead) => lead.estado === "CONTACTADO"),
      CERRADO: leads.filter((lead) => lead.estado === "CERRADO"),
      PERDIDO: leads.filter((lead) => lead.estado === "PERDIDO"),
    };
  }, [leads]);

  const addLead = async (leadData: CreateLead) => {
    try {
      await createMutation.mutateAsync(leadData);
      toast.success("Lead registrado exitosamente");
    } catch (error) {
      console.error("Error al crear lead:", error);
      toast.error("Error al registrar el lead");
      throw error;
    }
  };

  const updateLead = async (id: string, leadData: UpdateLead) => {
    try {
      await updateMutation.mutateAsync({ id, data: leadData });
      toast.success("Lead actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar lead:", error);
      toast.error("Error al actualizar el lead");
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Lead eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar lead:", error);
      toast.error("Error al eliminar el lead");
      throw error;
    }
  };

  const cambiarEstadoLead = async (id: string, nuevoEstado: EstadoLead) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { estado: nuevoEstado }
      });
      toast.success("Estado actualizado exitosamente");
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar el estado");
      throw error;
    }
  };

  return {
    leads,
    leadsByEstado,
    isLoading,
    error,
    addLead,
    updateLead,
    deleteLead,
    cambiarEstadoLead,
  };
};
