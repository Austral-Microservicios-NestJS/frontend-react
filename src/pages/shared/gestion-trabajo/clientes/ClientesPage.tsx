import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/components/sidebar/Sidebar";
import { useAuthStore } from "@/store/auth.store";

export default function ClientesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <>
      <Header
        title="Clientes"
        description="Gestiona tus clientes"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Cliente"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      {/* Aquí iría el contenido principal de la página de actividades */}
      {/* <ActividadesGrid actividades={actividades} /> */}

      {/* <RegistrarActividad
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addActividad={addActividad}
        user={user!}
      /> */}
    </>
  );
}
