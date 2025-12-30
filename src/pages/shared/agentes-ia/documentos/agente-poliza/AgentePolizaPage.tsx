import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";

export default function AgentePolizaPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <Header
        title="Agente de Polizas"
        description="Sube una poliza y deja que la IA extraiga los datos"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Aquí iría el contenido principal de la página */}
    </>
  );
}
