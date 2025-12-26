import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/components/sidebar/Sidebar";
import { useAuthStore } from "@/store/auth.store";
import { RegistrarCliente } from "@/components/modulos/clientes/modales/RegistrarCliente";
import { useClientes } from "@/hooks/useCliente";
import { TablaClientes } from "@/components/modulos/clientes/tablas/TablaClientes";

export default function ClientesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { clientes, addCliente } = useClientes();

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

      {/* Aquí iría el contenido principal de la página de clientes */}
      <TablaClientes clientes={clientes} />

      <RegistrarCliente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addCliente={addCliente}
        user={user!}
      />
    </>
  );
}
