import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/services/lead.service";
import type { Lead, CreateLead, UpdateLead, EstadoLead } from "@/types/lead.interface";
import { useAuthStore } from "@/store/auth.store";

const DIAS_OCULTAR_FINALIZADOS = 3; // Leads CERRADO/PERDIDO se ocultan del kanban después de 3 días

export const useLeads = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: allLeads = [], isLoading, error } = leadService.useGetAll();
  const createMutation = leadService.useCreate();
  const updateMutation = leadService.useUpdate();
  const deleteMutation = leadService.useDelete();
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  // El filtro por rol ya se aplica server-side (leads-ms filtra WHERE asignado_a = userId).
  // No duplicar aquí para no comparar UUID vs nombreUsuario.
  const leads = useMemo(() => {
    if (!Array.isArray(allLeads)) return [];
    let filtered = allLeads;
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
  }, [allLeads, mostrarArchivados]);

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

  const cambiarEstadoLead = (id: string, nuevoEstado: EstadoLead) => {
    // Actualización optimista: mover lead en cache inmediatamente
    queryClient.setQueryData(["leads"], (old: any) => {
      if (!Array.isArray(old)) return old;
      return old.map((l: any) =>
        l.idLead === id ? { ...l, estado: nuevoEstado, fechaUltimoCambioEstado: new Date().toISOString() } : l
      );
    });
    // API en background
    leadService.cambiarEstado(id, nuevoEstado, user?.nombreUsuario).catch(() => {
      toast.error("Error al cambiar el estado");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    });
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
