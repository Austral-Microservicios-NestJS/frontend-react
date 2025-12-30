import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";

export default function SiniestrosPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <Header
        title="Siniestros"
        description="Vista general de siniestros relacionados a las pólizas"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
    </>
  );
}
