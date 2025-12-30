import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { CompaniasGridEx } from "@/components/modulos/companias/grid/CompaniasGridEx";
import { useCompanias } from "@/hooks/useCompanias";

export default function CompaniasExtraPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { companias, isLoading } = useCompanias();

  return (
    <>
      <Header
        title="Compañías de seguros"
        description="Visualiza las compañías de seguros registradas en el sistema"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      ></Header>

      <>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CompaniasGridEx companias={companias} />
        )}
      </>
    </>
  );
}
