import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";

export default function ComisionesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <Header
        title="Comisiones"
        description="Vista general de comisiones"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
    </>
  );
}
