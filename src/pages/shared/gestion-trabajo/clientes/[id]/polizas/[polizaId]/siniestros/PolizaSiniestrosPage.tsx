import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import {
  TablaSiniestros,
  RegistrarSiniestro,
  EditarSiniestro,
} from "@/components/modulos/siniestros";
import { clienteService } from "@/services/cliente.service";
import { polizaApi } from "@/services/poliza.service";
import { useGetSiniestrosByPoliza, useDeleteSiniestro } from "@/modules/siniestro/siniestro.queries";
import { useAuthStore } from "@/store/auth.store";
import type { Siniestro } from "@/modules/siniestro/siniestro.types";
import { EstadoSiniestro } from "@/modules/siniestro/siniestro.types";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function PolizaSiniestrosPage() {
  const { id, polizaId } = useParams<{ id: string; polizaId: string }>();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSiniestro, setSelectedSiniestro] = useState<Siniestro | null>(
    null
  );
  const { user } = useAuthStore();

  // Datos del cliente
  const { data: cliente, isLoading: isLoadingCliente } =
    clienteService.useGetById(id || "");

  // Pólizas del cliente para obtener datos de la póliza seleccionada
  const { data: polizas = [], isLoading: isLoadingPoliza } =
    polizaApi.useGetAllByCliente(id || "");

  const poliza = polizas.find((p) => (p.id ?? p.idPoliza) === polizaId);

  // Siniestros de la póliza
  const { data: siniestros = [], isLoading: isLoadingSiniestros } =
    useGetSiniestrosByPoliza(polizaId || "");

  const deleteMutation = useDeleteSiniestro();

  const isLoading = isLoadingCliente || isLoadingPoliza || isLoadingSiniestros;

  // Estadísticas por estado
  const conteoEstados = {
    [EstadoSiniestro.REPORTADO]: siniestros.filter(
      (s) => s.estado === EstadoSiniestro.REPORTADO
    ).length,
    [EstadoSiniestro.EN_PROCESO]: siniestros.filter(
      (s) => s.estado === EstadoSiniestro.EN_PROCESO
    ).length,
    [EstadoSiniestro.APROBADO]: siniestros.filter(
      (s) => s.estado === EstadoSiniestro.APROBADO
    ).length,
    [EstadoSiniestro.RECHAZADO]: siniestros.filter(
      (s) => s.estado === EstadoSiniestro.RECHAZADO
    ).length,
    [EstadoSiniestro.PAGADO]: siniestros.filter(
      (s) => s.estado === EstadoSiniestro.PAGADO
    ).length,
    [EstadoSiniestro.CERRADO]: siniestros.filter(
      (s) => s.estado === EstadoSiniestro.CERRADO
    ).length,
  };

  const handleGoBack = () => {
    navigate(`/dashboard/gestion-trabajo/clientes/${id}/polizas`);
  };

  const handleEdit = (siniestro: Siniestro) => {
    setSelectedSiniestro(siniestro);
  };

  const handleDelete = async (siniestro: Siniestro) => {
    if (window.confirm("¿Estás seguro de eliminar este siniestro?")) {
      try {
        await deleteMutation.mutateAsync(siniestro.idSiniestro);
      } catch (error) {
        console.error("Error al eliminar siniestro:", error);
      }
    }
  };

  const clienteName = cliente
    ? cliente.tipoPersona === "JURIDICO"
      ? cliente.razonSocial
      : `${cliente.nombres || ""} ${cliente.apellidos || ""}`.trim()
    : "Cliente";

  return (
    <>
      <Header
        title={`Siniestros — ${poliza?.numeroPoliza ?? polizaId}`}
        description={`Gestiona los siniestros de la póliza de ${clienteName}`}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <BotonRegistro
            label="Registrar Siniestro"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </Header>

      <div>
        {/* Resumen de póliza */}
        {poliza && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">N° Póliza</p>
                <p className="font-medium text-gray-900">
                  {poliza.numeroPoliza}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Asegurado</p>
                <p className="font-medium text-gray-900">
                  {poliza.nombreAsegurado}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="font-medium text-gray-900">{poliza.estado}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Siniestros</p>
                <p className="font-medium text-gray-900">{siniestros.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Reportados</p>
              <p className="text-xl font-bold text-blue-800">
                {conteoEstados[EstadoSiniestro.REPORTADO]}
              </p>
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-amber-600 font-medium">En Proceso</p>
              <p className="text-xl font-bold text-amber-800">
                {conteoEstados[EstadoSiniestro.EN_PROCESO]}
              </p>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-green-600 font-medium">Aprobados</p>
              <p className="text-xl font-bold text-green-800">
                {conteoEstados[EstadoSiniestro.APROBADO]}
              </p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-4 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-red-600 font-medium">Rechazados</p>
              <p className="text-xl font-bold text-red-800">
                {conteoEstados[EstadoSiniestro.RECHAZADO]}
              </p>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-emerald-600 font-medium">Pagados</p>
              <p className="text-xl font-bold text-emerald-800">
                {conteoEstados[EstadoSiniestro.PAGADO]}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Cerrados</p>
              <p className="text-xl font-bold text-gray-700">
                {conteoEstados[EstadoSiniestro.CERRADO]}
              </p>
            </div>
          </div>
        </div>

        {/* Tabla */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TablaSiniestros
            siniestros={siniestros}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal: Registrar */}
      <RegistrarSiniestro
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idPoliza={polizaId || ""}
        registradoPor={user?.idUsuario || ""}
      />

      {/* Modal: Editar */}
      <EditarSiniestro
        isOpen={!!selectedSiniestro}
        onClose={() => setSelectedSiniestro(null)}
        siniestro={selectedSiniestro}
      />
    </>
  );
}
