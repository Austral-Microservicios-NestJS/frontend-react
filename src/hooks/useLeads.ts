import { useMemo } from "react";
import { toast } from "sonner";
import { leadService } from "@/services/lead.service";
import type { CreateLead, UpdateLead, EstadoLead } from "@/types/lead.interface";
import { useAuthStore } from "@/store/auth.store";

export const useLeads = () => {
  const { } = useAuthStore();
  const { data: allLeads = [], isLoading, error } = leadService.useGetAll();
  const createMutation = leadService.useCreate();
  const updateMutation = leadService.useUpdate();
  const deleteMutation = leadService.useDelete();

  // Validar que allLeads sea un array
  const leads = useMemo(() => {
    if (!Array.isArray(allLeads)) {
      console.warn("allLeads no es un array:", allLeads);
      return [];
    }
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

  // Filtrar leads por término de búsqueda (búsqueda client-side instantánea)
  const filterLeads = (searchQuery: string, tipoSeguroFilter?: string) => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        !q ||
        lead.nombre?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.telefono?.toLowerCase().includes(q) ||
        lead.empresa?.toLowerCase().includes(q) ||
        (lead as any).numeroDocumento?.toLowerCase().includes(q);
      const matchesTipo =
        !tipoSeguroFilter || lead.tipoSeguro === tipoSeguroFilter;
      return matchesSearch && matchesTipo;
    });
  };

  const filterByEstado = (searchQuery: string, tipoSeguroFilter?: string) => {
    const filtered = filterLeads(searchQuery, tipoSeguroFilter);
    return {
      NUEVO: filtered.filter((l) => l.estado === "NUEVO"),
      CONTACTADO: filtered.filter((l) => l.estado === "CONTACTADO"),
      CERRADO: filtered.filter((l) => l.estado === "CERRADO"),
      PERDIDO: filtered.filter((l) => l.estado === "PERDIDO"),
    };
  };

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
    filterByEstado,
    isLoading,
    error,
    addLead,
    updateLead,
    deleteLead,
    cambiarEstadoLead,
  };
};
