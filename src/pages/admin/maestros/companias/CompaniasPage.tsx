import { useState } from "react";
import { Header, BotonRegistro, ModalConfirmacion } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarCompania } from "@/components/modulos/companias/modales/RegistrarCompania";
import { EditarCompania } from "@/components/modulos/companias/modales/EditarCompania";
import { CompaniasGrid } from "@/components/modulos/companias/grid/CompaniasGrid";
import { useCompanias } from "@/hooks/useCompanias";
import { companiaApi } from "@/services/compania.service";
import { useAuthStore } from "@/store/auth.store";
import { Roles } from "@/utils/roles";
import type { Compania, UpdateCompaniaDto } from "@/types/compania.interface";
import { toast } from "sonner";

export default function CompaniasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombreRol === Roles.ADMINISTRADOR;

  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingCompania, setEditingCompania] = useState<Compania | null>(null);
  const [companiaAEliminar, setCompaniaAEliminar] = useState<Compania | null>(
    null,
  );

  const { companias, addCompania, updateCompania, isLoading } = useCompanias();
  const deleteCompania = companiaApi.useDelete();

  const handleEdit = (compania: Compania) => {
    setEditingCompania(compania);
  };

  const handleUpdate = async (data: UpdateCompaniaDto) => {
    if (editingCompania) {
      await updateCompania(editingCompania.idCompania, data);
    }
  };

  const confirmarEliminarCompania = async () => {
    if (!companiaAEliminar) return;
    try {
      await deleteCompania.mutateAsync(companiaAEliminar.idCompania);
      toast.success("Compañía eliminada");
      setCompaniaAEliminar(null);
    } catch {
      toast.error("No se pudo eliminar la compañía");
    }
  };

  return (
    <>
      <Header
        title="Compañías"
        description="Gestiona las compañías de seguros"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Compañía"
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CompaniasGrid
            companias={companias}
            onEdit={handleEdit}
            onDelete={isAdmin ? setCompaniaAEliminar : undefined}
          />
        )}
      </>

      <RegistrarCompania
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        addCompania={addCompania}
      />

      {editingCompania && (
        <EditarCompania
          isOpen={!!editingCompania}
          onClose={() => setEditingCompania(null)}
          onSubmit={handleUpdate}
          compania={editingCompania}
        />
      )}

      <ModalConfirmacion
        isOpen={!!companiaAEliminar}
        onClose={() => setCompaniaAEliminar(null)}
        onConfirm={confirmarEliminarCompania}
        title="Eliminar compañía"
        message={
          companiaAEliminar
            ? `¿Eliminar definitivamente a ${
                companiaAEliminar.nombreComercial ||
                companiaAEliminar.razonSocial
              }? Las pólizas y productos que referencien a esta compañía pueden quedar huérfanos. Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar definitivamente"
        isLoading={deleteCompania.isPending}
      />
    </>
  );
}
