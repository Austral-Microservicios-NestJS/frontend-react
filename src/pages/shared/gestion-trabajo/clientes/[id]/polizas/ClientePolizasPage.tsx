import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/components/sidebar/Sidebar";
import { RegistrarPoliza, TablaPolizas } from "@/components/modulos/polizas";
import { usePolizas } from "@/hooks/usePolizas";
import { useAuthStore } from "@/store/auth.store";
import { clienteApi } from "@/services/cliente.service";
import { ArrowLeft } from "lucide-react";
import days from "dayjs";

export default function ClientePolizasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  // Obtener información del cliente
  const { data: cliente, isLoading: isLoadingCliente } = clienteApi.useGetById(
    id || ""
  );

  // Obtener pólizas del cliente
  const { polizas, isLoading: isLoadingPolizas, addPoliza } = usePolizas(id);

  const isLoading = isLoadingCliente || isLoadingPolizas;

  const handleGoBack = () => {
    navigate("/dashboard/gestion-trabajo/clientes");
  };

  const clienteName = cliente
    ? cliente.tipoPersona === "JURIDICO"
      ? cliente.razonSocial
      : `${cliente.nombres || ""} ${cliente.apellidos || ""}`.trim()
    : "Cliente";

  return (
    <>
      <Header
        title={`Pólizas de ${clienteName}`}
        description="Gestiona las pólizas asociadas a este cliente"
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
            label="Registrar Póliza"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </Header>

      <div>
        {/* Información del cliente */}
        {cliente && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Documento</p>
                <p className="font-medium text-gray-900">
                  {cliente.tipoDocumento}: {cliente.numeroDocumento}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {cliente.emailNotificaciones || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium text-gray-900">
                  {cliente.telefono1 || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Cumpleaños / Aniversario
                </p>
                <p className="font-medium text-gray-900">
                  {days(cliente.cumpleanos).format("DD/MM/YYYY") || "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TablaPolizas polizas={polizas} />
        )}
      </div>

      {user && id && (
        <RegistrarPoliza
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          addPoliza={addPoliza}
          idCliente={id}
          idUsuario={user.idUsuario}
        />
      )}
    </>
  );
}
