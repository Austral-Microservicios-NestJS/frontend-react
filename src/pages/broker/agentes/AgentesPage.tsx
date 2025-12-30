import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarUsuario } from "@/components/modulos/usuarios/modales/RegistrarUsuario";
import { TablaUsuarios } from "@/components/modulos/usuarios/tablas/TablaUsuarios";
import { useAuthStore } from "@/store/auth.store";
import { useRoles } from "@/hooks/useRol";
import { useAgentes } from "@/hooks/useAgentes";

export default function AgentesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { roles } = useRoles();
  const { addAgente, agentes } = useAgentes();

  return (
    <>
      <Header
        title="Mis Agentes"
        description="Gestiona los agentes que has creado"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Agente"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <TablaUsuarios usuarios={agentes} />

      <RegistrarUsuario
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addUsuario={addAgente}
        roles={roles}
        user={user!}
      />
    </>
  );
}
