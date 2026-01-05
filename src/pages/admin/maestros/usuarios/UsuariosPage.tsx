import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarUsuario } from "@/components/modulos/usuarios/modales/RegistrarUsuario";
import { EditarUsuario } from "@/components/modulos/usuarios/modales/EditarUsuario";
import { useAuthStore } from "@/store/auth.store";
import { useRoles } from "@/hooks/useRol";
import { useUsuarios } from "@/hooks/useUsuarios";
import { TablaUsuarios } from "@/components/modulos/usuarios/tablas/TablaUsuarios";
import type { Usuario, UpdateUsuario } from "@/types/usuario.interface";
import { asignacionApi } from "@/services/asignacion.service";
import { toast } from "sonner";

export default function UsuariosPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const { user } = useAuthStore();
  const { roles } = useRoles();
  const { addUsuario, updateUsuario, usuarios } = useUsuarios();

  const updateComision = asignacionApi.useUpdateComision();

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
  };

  // Obtener comision directamente del usuario (ya viene del backend)
  const comisionActual = (editingUsuario as any)?.porcentajeComision || 0;

  const handleUpdate = async (
    data: UpdateUsuario,
    porcentajeComision?: number
  ) => {
    if (editingUsuario) {
      await updateUsuario(editingUsuario.idUsuario, data);

      // Actualizar comisión si cambió
      if (
        porcentajeComision !== undefined &&
        porcentajeComision !== comisionActual
      ) {
        try {
          await updateComision.mutateAsync({
            idUsuario: editingUsuario.idUsuario,
            porcentajeComision,
          });
        } catch {
          toast.error("No se pudo actualizar la comisión");
        }
      }
    }
  };

  return (
    <>
      <Header
        title="Usuarios"
        description="Gestiona los usuarios que pueden acceder al sistema"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Usuario"
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <TablaUsuarios usuarios={usuarios} onEdit={handleEdit} />

      <RegistrarUsuario
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        addUsuario={addUsuario}
        roles={roles}
        user={user!}
      />

      {editingUsuario && (
        <EditarUsuario
          isOpen={!!editingUsuario}
          onClose={() => setEditingUsuario(null)}
          onSubmit={handleUpdate}
          usuario={editingUsuario}
          roles={roles}
          porcentajeComisionActual={comisionActual}
        />
      )}
    </>
  );
}
