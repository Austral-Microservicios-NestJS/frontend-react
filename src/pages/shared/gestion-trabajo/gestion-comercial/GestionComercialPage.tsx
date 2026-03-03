import { useState } from "react";
import { Header, BotonRegistro, ModalConfirmacion } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/auth.store";
import {
  useGetGestionesByAsesor,
  useCreateGestion,
  useUpdateGestion,
  useDeleteGestion,
} from "@/modules/gestion-comercial/gestion-comercial.queries";
import { GestionesGrid } from "@/modules/gestion-comercial/components/GestionesGrid";
import { RegistrarGestion } from "@/modules/gestion-comercial/components/RegistrarGestion";
import { EditarGestion } from "@/modules/gestion-comercial/components/EditarGestion";
import type {
  Gestion,
  CreateGestion,
  UpdateGestion,
} from "@/modules/gestion-comercial/gestion-comercial.types";

export default function GestionComercialPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();

  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingGestion, setEditingGestion] = useState<Gestion | null>(null);
  const [deletingGestion, setDeletingGestion] = useState<Gestion | null>(null);

  const { data, isLoading } = useGetGestionesByAsesor(user?.idUsuario ?? "");
  const { mutateAsync: createGestion } = useCreateGestion();
  const { mutateAsync: updateGestion } = useUpdateGestion();
  const { mutateAsync: deleteGestion } = useDeleteGestion();

  const gestiones = data?.data ?? [];

  const handleCreate = async (formData: CreateGestion) => {
    await createGestion(formData);
    setIsRegistrarOpen(false);
  };

  const handleUpdate = async (formData: UpdateGestion) => {
    if (!editingGestion) return;
    await updateGestion({ id: editingGestion.idGestion, data: formData });
    setEditingGestion(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingGestion) return;
    await deleteGestion(deletingGestion.idGestion);
    setDeletingGestion(null);
  };

  return (
    <>
      <Header
        title="Gestión Comercial"
        description="Centro de gestión comercial 360° — seguimiento, reuniones y actividades"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Nueva Gestión"
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <GestionesGrid
            gestiones={gestiones}
            onEdit={setEditingGestion}
            onDelete={setDeletingGestion}
          />
        )}
      </div>

      {/* Modal: Registrar */}
      {user && (
        <RegistrarGestion
          isOpen={isRegistrarOpen}
          onClose={() => setIsRegistrarOpen(false)}
          onSubmit={handleCreate}
          user={user}
        />
      )}

      {/* Modal: Editar */}
      {editingGestion && (
        <EditarGestion
          isOpen={!!editingGestion}
          onClose={() => setEditingGestion(null)}
          onSubmit={handleUpdate}
          gestion={editingGestion}
        />
      )}

      {/* Modal: Confirmar eliminación */}
      <ModalConfirmacion
        isOpen={!!deletingGestion}
        onClose={() => setDeletingGestion(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Gestión"
        message={`¿Estás seguro de eliminar esta gestión de tipo "${deletingGestion?.tipo}"?`}
        confirmText="Eliminar"
      />
    </>
  );
}
