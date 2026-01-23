import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { TablaInversiones } from "@/components/modulos/clientes/tablas/TablaInversiones";
import { clienteService } from "@/services/cliente.service";
import { clienteInversionService } from "@/services/cliente-inversion.service";
import { RegistrarInversion } from "@/components/modulos/clientes/modales/RegistrarInversion";
import { EditarInversion } from "@/components/modulos/clientes/modales/EditarInversion";
import { useAuthStore } from "@/store/auth.store";
import type { ClienteInversion } from "@/types/cliente-inversion.interface";
import { ArrowLeft, DollarSign, Coins } from "lucide-react";

export default function ClienteInversionesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInversion, setSelectedInversion] =
    useState<ClienteInversion | null>(null);
  const { user } = useAuthStore();

  // Obtener información del cliente
  const { data: cliente, isLoading: isLoadingCliente } =
    clienteService.useGetById(id || "");

  // Obtener inversiones del cliente
  const { data: inversiones = [], isLoading: isLoadingInversiones } =
    clienteInversionService.useGetByCliente(id || "");

  const deleteMutation = clienteInversionService.useDelete();

  const isLoading = isLoadingCliente || isLoadingInversiones;

  // Calcular totales por moneda
  const totalPEN = inversiones
    .filter((inv) => inv.moneda === "PEN")
    .reduce((sum, inv) => sum + Number(inv.monto), 0);

  const totalUSD = inversiones
    .filter((inv) => inv.moneda === "USD")
    .reduce((sum, inv) => sum + Number(inv.monto), 0);

  const handleGoBack = () => {
    navigate("/dashboard/gestion-trabajo/clientes");
  };

  const handleEdit = (inversion: ClienteInversion) => {
    setSelectedInversion(inversion);
  };

  const handleDelete = async (inversion: ClienteInversion) => {
    if (window.confirm("¿Estás seguro de eliminar esta inversión?")) {
      try {
        await deleteMutation.mutateAsync(inversion.idInversion);
      } catch (error) {
        console.error("Error al eliminar inversión:", error);
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
        title={`Inversiones de ${clienteName}`}
        description="Gestiona las inversiones realizadas para captar a este cliente"
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
            label="Nueva Inversión"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </Header>

      <div>
        {/* Resumen de Inversiones por Moneda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Tarjeta PEN */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-sm border border-emerald-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-700">
                    Total en Soles
                  </p>
                </div>
                <p className="text-3xl font-bold text-emerald-900">
                  S/{" "}
                  {totalPEN.toLocaleString("es-PE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  {inversiones.filter((inv) => inv.moneda === "PEN").length}{" "}
                  {inversiones.filter((inv) => inv.moneda === "PEN").length ===
                  1
                    ? "inversión"
                    : "inversiones"}
                </p>
              </div>
              <div className="bg-emerald-200 rounded-full p-3">
                <Coins className="w-8 h-8 text-emerald-700" />
              </div>
            </div>
          </div>

          {/* Tarjeta USD */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-medium text-blue-700">
                    Total en Dólares
                  </p>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  ${" "}
                  {totalUSD.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {inversiones.filter((inv) => inv.moneda === "USD").length}{" "}
                  {inversiones.filter((inv) => inv.moneda === "USD").length ===
                  1
                    ? "inversión"
                    : "inversiones"}
                </p>
              </div>
              <div className="bg-blue-200 rounded-full p-3">
                <DollarSign className="w-8 h-8 text-blue-700" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TablaInversiones
            inversiones={inversiones}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {id && (
        <>
          <RegistrarInversion
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            idCliente={id}
            idUsuario={user?.idUsuario}
          />

          <EditarInversion
            isOpen={!!selectedInversion}
            onClose={() => setSelectedInversion(null)}
            inversion={selectedInversion}
          />
        </>
      )}
    </>
  );
}
