import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";

export default function PolizasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header
        title="Polizas"
        description="Gestiona tus polizas"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Aquí iría el contenido principal de la página de clientes */}
      {/* <TablaClientes clientes={clientes} />

      <RegistrarCliente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addCliente={addCliente}
        user={user!}
      /> */}
    </>
  );
}
