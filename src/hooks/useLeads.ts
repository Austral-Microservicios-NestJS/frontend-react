import { useMemo, useState } from "react";
import { toast } from "sonner";
import { leadService } from "@/services/lead.service";
import type { Lead, CreateLead, UpdateLead, EstadoLead } from "@/types/lead.interface";
import { useAuthStore } from "@/store/auth.store";
import { Roles } from "@/utils/roles";

const DIAS_OCULTAR_FINALIZADOS = 7; // Leads CERRADO/PERDIDO se ocultan del kanban después de 7 días

export const useLeads = () => {
  const { user } = useAuthStore();
  const { data: allLeads = [], isLoading, error } = leadService.useGetAll();
  const createMutation = leadService.useCreate();
  const updateMutation = leadService.useUpdate();
  const deleteMutation = leadService.useDelete();
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const rol = user?.rol?.nombreRol;
  const isLimitedRole =
    rol === Roles.PROMOTOR_VENTA ||
    rol === Roles.PUNTO_VENTA ||
    rol === Roles.REFERENCIADOR;

  // Filtrar por rol y ocultar CERRADO/PERDIDO antiguos
  const leads = useMemo(() => {
    if (!Array.isArray(allLeads)) return [];
    let filtered = allLeads;
    if (isLimitedRole) {
      filtered = filtered.filter((lead) => lead.asignadoA === user?.nombreUsuario);
    }
    if (!mostrarArchivados) {
      const ahora = new Date();
      const limite = DIAS_OCULTAR_FINALIZADOS * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((lead) => {
        if (lead.estado !== "CERRADO" && lead.estado !== "PERDIDO") return true;
        const fechaCambio = new Date(lead.fechaUltimoCambioEstado || lead.fechaCreacion);
        return ahora.getTime() - fechaCambio.getTime() < limite;
      });
    }
    return filtered;
  }, [allLeads, isLimitedRole, user?.nombreUsuario, mostrarArchivados]);

  const leadsByEstado = useMemo(() => {
    return {
      NUEVO:      leads.filter((lead) => lead.estado === "NUEVO"),
      CONTACTADO: leads.filter((lead) => lead.estado === "CONTACTADO"),
      COTIZADO:   leads.filter((lead) => lead.estado === "COTIZADO"),
      EMITIDO:    leads.filter((lead) => lead.estado === "EMITIDO"),
      CERRADO:    leads.filter((lead) => lead.estado === "CERRADO"),
      PERDIDO:    leads.filter((lead) => lead.estado === "PERDIDO"),
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
      NUEVO:      filtered.filter((l) => l.estado === "NUEVO"),
      CONTACTADO: filtered.filter((l) => l.estado === "CONTACTADO"),
      COTIZADO:   filtered.filter((l) => l.estado === "COTIZADO"),
      EMITIDO:    filtered.filter((l) => l.estado === "EMITIDO"),
      CERRADO:    filtered.filter((l) => l.estado === "CERRADO"),
      PERDIDO:    filtered.filter((l) => l.estado === "PERDIDO"),
    };
  };

  const addLead = async (leadData: CreateLead): Promise<Lead> => {
    try {
      const newLead = await createMutation.mutateAsync(leadData);
      toast.success("Lead registrado exitosamente");
      return newLead;
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
      await leadService.cambiarEstado(id, nuevoEstado, user?.nombreUsuario);
      updateMutation.reset();
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
    mostrarArchivados,
    setMostrarArchivados,
  };
};
