import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List
} from "lucide-react";
import { RegistrarTarea } from "@/components/modulos/tareas/modales/RegistrarTarea";
import { useTareas } from "@/hooks/useTareas";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TareasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

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
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <Header
        title="Gestión de Tareas"
        description="Organiza y prioriza tus actividades diarias"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <BotonRegistro
            label="Nueva Tarea"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </Header>

      <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tareas"
            value={tareas.length}
            icon={LayoutGrid}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatsCard
            title="Alta Prioridad"
            value={tareasPorPrioridad.ALTA}
            icon={AlertCircle}
            color="text-red-600"
            bg="bg-red-50"
          />
          <StatsCard
            title="En Proceso"
            value={tareasPorEstado.EN_PROCESO.length}
            icon={Clock}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <StatsCard
            title="Completadas"
            value={tareasPorEstado.COMPLETADA.length}
            icon={CheckCircle2}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
        </div>

        {/* Filters & Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Buscar tareas..." 
              className="pl-9 bg-white border-gray-200 focus:border-blue-500 transition-colors h-9 text-sm rounded-md"
            />
          </div>
          <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-white hover:text-gray-900 h-9 rounded-md">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-full min-w-[1000px]">
            <TareaColumn 
              title="Pendientes" 
              count={tareasPorEstado.PENDIENTE.length}
              tareas={tareasPorEstado.PENDIENTE} 
              statusColor="bg-gray-400"
            />
            <TareaColumn 
              title="En Proceso" 
              count={tareasPorEstado.EN_PROCESO.length}
              tareas={tareasPorEstado.EN_PROCESO} 
              statusColor="bg-amber-500"
            />
            <TareaColumn 
              title="Completadas" 
              count={tareasPorEstado.COMPLETADA.length}
              tareas={tareasPorEstado.COMPLETADA} 
              statusColor="bg-emerald-500"
            />
            <TareaColumn 
              title="Canceladas" 
              count={tareasPorEstado.CANCELADA.length}
              tareas={tareasPorEstado.CANCELADA} 
              statusColor="bg-red-500"
            />
          </div>
        </div>
      </div>

      <RegistrarTarea
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTarea={addTarea}
        user={user!}
      />
    </div>
  );
}

// Minimalist Stats Card
function StatsCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-md ${bg}`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    </div>
  );
}

// Clean Column Component
function TareaColumn({ title, count, tareas, statusColor }: any) {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200">
      <div className="px-3 py-2.5 border-b border-gray-200 bg-white rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
          {count}
        </span>
      </div>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
        {tareas.length === 0 ? (
          <div className="h-24 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-md m-1">
            <p className="text-xs font-medium">Sin tareas</p>
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

// Modern Task Card
function TareaCard({ tarea }: any) {
  const getPriorityStyles = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA": return "bg-red-50 text-red-700 border-red-100";
      case "MEDIA": return "bg-amber-50 text-amber-700 border-amber-100";
      case "BAJA": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="group bg-white rounded-md p-3 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getPriorityStyles(tarea.prioridad)}`}>
          {tarea.prioridad}
        </span>
        <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <h4 className="font-medium text-gray-800 text-sm mb-1.5 leading-tight group-hover:text-blue-600 transition-colors">
        {tarea.asunto}
      </h4>
      
      {tarea.descripcion && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {tarea.descripcion}
        </p>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(tarea.fechaVencimiento).toLocaleDateString("es-PE", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
        
        <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-600">
          {tarea.creadaPor?.substring(0, 2).toUpperCase() || "U"}
        </div>
      </div>
    </div>
  );
}
