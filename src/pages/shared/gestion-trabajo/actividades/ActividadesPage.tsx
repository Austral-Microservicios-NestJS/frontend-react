import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { Calendar, Activity, CheckSquare } from "lucide-react";
import { useActividades } from "@/hooks/useActividades";
import { useAuthStore } from "@/store/auth.store";

export default function ActividadesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuthStore();
  const {
    actividades,
    actividadesProximas,
    isLoading
  } = useActividades();

  if (isLoading) {
    return (
      <>
        <Header
          title="Actividades"
          description="Gestiona tus actividades y eventos"
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        >
          <BotonRegistro
            label="Nueva Actividad"
            onClick={() => setIsModalOpen(true)}
          />
        </Header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
            <p className="mt-4 text-gray-600">Cargando actividades...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Actividades"
        description="Gestiona tus actividades y eventos"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Nueva Actividad"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Actividades"
            value={actividades.length}
            icon={Calendar}
            color="bg-purple-500"
          />
          <StatsCard
            title="Próximas"
            value={actividadesProximas.length}
            icon={Activity}
            color="bg-indigo-500"
          />
          <StatsCard
            title="Esta Semana"
            value={actividades.filter((a) => {
              const fecha = new Date(a.fechaActividad);
              const hoy = new Date();
              const diff = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
              return diff >= 0 && diff <= 7;
            }).length}
            icon={CheckSquare}
            color="bg-blue-500"
          />
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Todas las Actividades</h3>
          {actividades.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">No hay actividades registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actividades.map((actividad) => (
                <ActividadCard key={actividad.idActividad} actividad={actividad} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Actividad Card Component
function ActividadCard({ actividad }: any) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-1">{actividad.titulo}</h4>
          {actividad.descripcion && (
            <p className="text-xs text-gray-600 line-clamp-2">{actividad.descripcion}</p>
          )}
        </div>
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded ml-3 shrink-0">
          {actividad.tipoActividad}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
        <Calendar className="w-3 h-3" />
        <span>
          {new Date(actividad.fechaActividad).toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
