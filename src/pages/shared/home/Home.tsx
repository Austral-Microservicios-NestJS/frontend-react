import { Header } from "@/components/shared/Header";
import { RecentClients } from "@/components/modulos/home/RecentClients";
import { BirthdayWidget } from "@/components/modulos/home/BirthdayWidget";
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { InsuranceNews } from "@/components/modulos/home/InsuranceNews";
import { useAuthStore } from "@/store/auth.store";
import { useSidebar } from "@/hooks/useSidebar";

const Home = () => {
  const { user } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const displayName = user?.nombreUsuario || "Usuario";

  return (
    <>
      <Header
        title={`¡Hola, ${displayName}!`}
        description="Resumen de tu actividad y novedades."
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content - Left Column (2 cols wide on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <RecentClients />
            </div>
            <div>
              <InsuranceNews />
            </div>
          </div>

          {/* Section for Quick Actions or Analytics could go here in future */}
        </div>

        {/* Sidebar - Right Column (1 col wide) */}
        <div className="space-y-6">
          <BirthdayWidget />
          <TasksWidget />
        </div>
      </div>
    </>
  );
};

export default Home;
