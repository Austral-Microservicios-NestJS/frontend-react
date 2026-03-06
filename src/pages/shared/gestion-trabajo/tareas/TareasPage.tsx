import { useState } from "react";
import { Header, BotonRegistro, ModalConfirmacion } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarTarea } from "@/components/modulos/tareas/modales/RegistrarTarea";
import { EditarTarea } from "@/components/modulos/tareas/modales/EditarTarea";
import { TareasGrid } from "@/components/modulos/tareas/grid/TareasGrid";
import { useTareas } from "@/hooks/useTareas";
import { RegistrarActividad } from "@/components/modulos/actividades/modales/RegistrarActividad";
import { EditarActividad } from "@/components/modulos/actividades/modales/EditarActividad";
import { ActividadesGrid } from "@/components/modulos/actividades/grid/ActividadesGrid";
import { useActividades } from "@/hooks/useActividades";
import {
  useGetGestionesByAsesor,
  useCreateGestion,
  useUpdateGestion,
  useDeleteGestion,
} from "@/modules/gestion-comercial/gestion-comercial.queries";
import { GestionesGrid } from "@/modules/gestion-comercial/components/GestionesGrid";
import { RegistrarGestion } from "@/modules/gestion-comercial/components/RegistrarGestion";
import { EditarGestion } from "@/modules/gestion-comercial/components/EditarGestion";
import { useAuthStore } from "@/store/auth.store";
import type { Tarea, UpdateTarea } from "@/types/tarea.interface";
import type { Actividad, UpdateActividad } from "@/types/actividad.interface";
import type {
  Gestion,
  CreateGestion,
  UpdateGestion,
} from "@/modules/gestion-comercial/gestion-comercial.types";

type Tab = "tareas" | "actividades" | "gestion-comercial";

export default function TareasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("tareas");

  // ── Tareas state ──────────────────────────────────────────────
  const [isRegistrarTareaOpen, setIsRegistrarTareaOpen] = useState(false);
  const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);
  const [deletingTarea, setDeletingTarea] = useState<Tarea | null>(null);
  const { tareas, addTarea, updateTarea, deleteTarea, isLoading: tareasLoading } = useTareas();

  const handleUpdateTarea = async (data: UpdateTarea) => {
    if (editingTarea) await updateTarea(editingTarea.idTarea, data);
  };

  const handleConfirmDeleteTarea = async () => {
    if (deletingTarea) {
      await deleteTarea(deletingTarea.idTarea);
      setDeletingTarea(null);
    }
  };

  // ── Actividades state ─────────────────────────────────────────
  const [isRegistrarActividadOpen, setIsRegistrarActividadOpen] = useState(false);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(null);
  const [deletingActividad, setDeletingActividad] = useState<Actividad | null>(null);
  const { actividades, addActividad, updateActividad, deleteActividad } = useActividades();

  const handleUpdateActividad = async (data: any) => {
    if (editingActividad) {
      const updateData: UpdateActividad = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipoActividad: data.tipoActividad,
        fechaActividad: data.fechaActividad,
      };
      await updateActividad(editingActividad.idActividad, updateData);
    }
  };

  const handleConfirmDeleteActividad = async () => {
    if (deletingActividad) {
      await deleteActividad(deletingActividad.idActividad);
      setDeletingActividad(null);
    }
  };

  // ── Gestión Comercial state ───────────────────────────────────
  const [isRegistrarGestionOpen, setIsRegistrarGestionOpen] = useState(false);
  const [editingGestion, setEditingGestion] = useState<Gestion | null>(null);
  const [deletingGestion, setDeletingGestion] = useState<Gestion | null>(null);
  const { data: gestionData, isLoading: gestionLoading } = useGetGestionesByAsesor(user?.idUsuario ?? "");
  const { mutateAsync: createGestion } = useCreateGestion();
  const { mutateAsync: updateGestion } = useUpdateGestion();
  const { mutateAsync: deleteGestion } = useDeleteGestion();
  const gestiones = gestionData?.data ?? [];

  const handleCreateGestion = async (formData: CreateGestion) => {
    await createGestion(formData);
    setIsRegistrarGestionOpen(false);
  };

  const handleUpdateGestion = async (formData: UpdateGestion) => {
    if (!editingGestion) return;
    await updateGestion({ id: editingGestion.idGestion, data: formData });
    setEditingGestion(null);
  };

  const handleConfirmDeleteGestion = async () => {
    if (!deletingGestion) return;
    await deleteGestion(deletingGestion.idGestion);
    setDeletingGestion(null);
  };

  // ── Header button per tab ─────────────────────────────────────
  const headerButton = {
    tareas: (
      <BotonRegistro label="Nueva Tarea" onClick={() => setIsRegistrarTareaOpen(true)} />
    ),
    actividades: (
      <BotonRegistro label="Nueva Actividad" onClick={() => setIsRegistrarActividadOpen(true)} />
    ),
    "gestion-comercial": (
      <BotonRegistro label="Nueva Gestión" onClick={() => setIsRegistrarGestionOpen(true)} />
    ),
  }[activeTab];

  const headerTitles: Record<Tab, { title: string; description: string }> = {
    tareas: { title: "Gestión de Trabajo", description: "Tareas, actividades y gestión comercial" },
    actividades: { title: "Gestión de Trabajo", description: "Tareas, actividades y gestión comercial" },
    "gestion-comercial": { title: "Gestión de Trabajo", description: "Tareas, actividades y gestión comercial" },
  };

  const TAB_STYLES = "px-4 py-2 text-sm font-medium border-b-2 transition-colors";
  const activeStyle = "border-[#003d5c] text-[#003d5c]";
  const inactiveStyle = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <>
      <Header
        title={headerTitles[activeTab].title}
        description={headerTitles[activeTab].description}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        {headerButton}
      </Header>

      {/* Tab bar */}
      <div className="border-b border-gray-200 px-6">
        <nav className="flex gap-1">
          <button
            className={`${TAB_STYLES} ${activeTab === "tareas" ? activeStyle : inactiveStyle}`}
            onClick={() => setActiveTab("tareas")}
          >
            Tareas
          </button>
          <button
            className={`${TAB_STYLES} ${activeTab === "actividades" ? activeStyle : inactiveStyle}`}
            onClick={() => setActiveTab("actividades")}
          >
            Actividades
          </button>
          <button
            className={`${TAB_STYLES} ${activeTab === "gestion-comercial" ? activeStyle : inactiveStyle}`}
            onClick={() => setActiveTab("gestion-comercial")}
          >
            Gestión Comercial
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="pt-4">
        {/* Tareas */}
        {activeTab === "tareas" && (
          tareasLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <TareasGrid
              tareas={tareas}
              onEdit={setEditingTarea}
              onDelete={setDeletingTarea}
            />
          )
        )}

        {/* Actividades */}
        {activeTab === "actividades" && (
          <ActividadesGrid
            actividades={actividades}
            onEdit={setEditingActividad}
            onDelete={setDeletingActividad}
          />
        )}

        {/* Gestión Comercial */}
        {activeTab === "gestion-comercial" && (
          gestionLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <GestionesGrid
              gestiones={gestiones}
              onEdit={setEditingGestion}
              onDelete={setDeletingGestion}
            />
          )
        )}
      </div>

      {/* ── Tareas modals ── */}
      <RegistrarTarea
        isOpen={isRegistrarTareaOpen}
        onClose={() => setIsRegistrarTareaOpen(false)}
        addTarea={addTarea}
        user={user!}
      />
      {editingTarea && (
        <EditarTarea
          isOpen={!!editingTarea}
          onClose={() => setEditingTarea(null)}
          onSubmit={handleUpdateTarea}
          tarea={editingTarea}
        />
      )}
      <ModalConfirmacion
        isOpen={!!deletingTarea}
        onClose={() => setDeletingTarea(null)}
        onConfirm={handleConfirmDeleteTarea}
        title="Eliminar Tarea"
        message={`¿Estás seguro de eliminar la tarea "${deletingTarea?.asunto}"?`}
        confirmText="Eliminar"
      />

      {/* ── Actividades modals ── */}
      <RegistrarActividad
        isOpen={isRegistrarActividadOpen}
        onClose={() => setIsRegistrarActividadOpen(false)}
        onSubmit={addActividad}
        user={user!}
      />
      {editingActividad && (
        <EditarActividad
          isOpen={!!editingActividad}
          onClose={() => setEditingActividad(null)}
          onSubmit={handleUpdateActividad}
          actividad={editingActividad}
        />
      )}
      <ModalConfirmacion
        isOpen={!!deletingActividad}
        onClose={() => setDeletingActividad(null)}
        onConfirm={handleConfirmDeleteActividad}
        title="Eliminar Actividad"
        message={`¿Estás seguro de eliminar la actividad "${deletingActividad?.titulo}"?`}
        confirmText="Eliminar"
      />

      {/* ── Gestión Comercial modals ── */}
      {user && (
        <RegistrarGestion
          isOpen={isRegistrarGestionOpen}
          onClose={() => setIsRegistrarGestionOpen(false)}
          onSubmit={handleCreateGestion}
          user={user}
        />
      )}
      {editingGestion && (
        <EditarGestion
          isOpen={!!editingGestion}
          onClose={() => setEditingGestion(null)}
          onSubmit={handleUpdateGestion}
          gestion={editingGestion}
        />
      )}
      <ModalConfirmacion
        isOpen={!!deletingGestion}
        onClose={() => setDeletingGestion(null)}
        onConfirm={handleConfirmDeleteGestion}
        title="Eliminar Gestión"
        message={`¿Estás seguro de eliminar esta gestión de tipo "${deletingGestion?.tipo}"?`}
        confirmText="Eliminar"
      />
    </>
  );
}
