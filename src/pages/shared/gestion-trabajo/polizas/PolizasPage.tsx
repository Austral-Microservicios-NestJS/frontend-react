import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { TablaPolizas } from "@/components/modulos/polizas/tablas/TablaPolizas";
import { usePolizas } from "@/hooks/usePolizas";

export default function PolizasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { polizas } = usePolizas();

  return (
    <>
      <Header
        title="Gestión de Pólizas"
        description="Administra las pólizas de seguros"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="mt-6">
        <TablaPolizas polizas={polizas} />
      </div>
    </>
  );
}
