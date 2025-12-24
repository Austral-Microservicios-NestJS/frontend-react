import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/components/sidebar/Sidebar";

export default function UsuariosPage() {

    const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false)

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

    </>
  );
}