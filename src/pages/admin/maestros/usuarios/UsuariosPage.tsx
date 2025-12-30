import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarUsuario } from "@/components/modulos/usuarios/modales/RegistrarUsuario";
import { useAuthStore } from "@/store/auth.store";
import { useRoles } from "@/hooks/useRol";
import { useUsuarios } from "@/hooks/useUsuarios";
import { TablaUsuarios } from "@/components/modulos/usuarios/tablas/TablaUsuarios";

export default function UsuariosPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { roles } = useRoles();
  const { addUsuario, usuarios } = useUsuarios();

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
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      {/* Aquí iría el contenido principal de la página de usuarios */}
      <TablaUsuarios usuarios={usuarios} />

      <RegistrarUsuario
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addUsuario={addUsuario}
        roles={roles}
        user={user!}
      />
    </>
  );
}
