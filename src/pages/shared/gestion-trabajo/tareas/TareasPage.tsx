import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { CheckSquare, Calendar, ListTodo, Activity } from "lucide-react";
import { RegistrarTarea } from "@/components/modulos/tareas/modales/RegistrarTarea";
import { useTareas } from "@/hooks/useTareas";
import { useAuthStore } from "@/store/auth.store";

export default function TareasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuthStore();
  const {
    tareas,
    tareasPorEstado,
    tareasPorPrioridad,
    isLoading,
    addTarea
  } = useTareas();

  if (isLoading) {
    return (
      <>
        <Header
          title="Tareas"
          description="Gestiona tus tareas y pendientes"
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        >
          <BotonRegistro
            label="Nueva Tarea"
            onClick={() => setIsModalOpen(true)}
          />
        </Header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
            <p className="mt-4 text-gray-600">Cargando tareas...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Tareas"
        description="Gestiona tus tareas y pendientes"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Nueva Tarea"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tareas"
            value={tareas.length}
            icon={ListTodo}
            color="bg-blue-500"
          />
          <StatsCard
            title="Alta Prioridad"
            value={tareasPorPrioridad.ALTA}
            icon={Activity}
            color="bg-red-500"
          />
          <StatsCard
            title="En Proceso"
            value={tareasPorEstado.EN_PROCESO.length}
            icon={CheckSquare}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Completadas"
            value={tareasPorEstado.COMPLETADA.length}
            icon={CheckSquare}
            color="bg-green-500"
          />
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TareaColumn title="Pendientes" tareas={tareasPorEstado.PENDIENTE} color="bg-slate-600" />
          <TareaColumn title="En Proceso" tareas={tareasPorEstado.EN_PROCESO} color="bg-yellow-600" />
          <TareaColumn title="Completadas" tareas={tareasPorEstado.COMPLETADA} color="bg-green-600" />
          <TareaColumn title="Canceladas" tareas={tareasPorEstado.CANCELADA} color="bg-red-600" />
        </div>
      </div>

      <RegistrarTarea
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTarea={addTarea}
        user={user!}
      />
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

// Tarea Column Component
function TareaColumn({ title, tareas, color }: any) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <div className={`${color} text-white px-4 py-3`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">{title}</h3>
          <span className="bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">
            {tareas.length}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-3 max-h-150 overflow-y-auto">
        {tareas.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <ListTodo className="w-8 h-8 mx-auto mb-2" />
            <p>No hay tareas</p>
          </div>
        ) : (
          tareas.map((tarea: any) => (
            <TareaCard key={tarea.idTarea} tarea={tarea} />
          ))
        )}
      </div>
    </div>
  );
}

// Tarea Card Component
function TareaCard({ tarea }: any) {
  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA": return "bg-red-100 text-red-700 border-red-200";
      case "MEDIA": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "BAJA": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{tarea.asunto}</h4>
        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getPriorityColor(tarea.prioridad)}`}>
          {tarea.prioridad}
        </span>
      </div>
      {tarea.descripcion && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{tarea.descripcion}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(tarea.fechaVencimiento).toLocaleDateString("es-PE", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded">{tarea.tipoTarea}</span>
      </div>
    </div>
  );
}
