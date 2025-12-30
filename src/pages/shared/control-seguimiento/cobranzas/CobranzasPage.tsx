import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";

export default function CobranzasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <Header
        title="Cobranzas"
        description="Vista general de cobranzas"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
    </>
  );
}
