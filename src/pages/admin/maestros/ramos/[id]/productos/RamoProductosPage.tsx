import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarProducto } from "@/components/modulos/productos";
import { TablaProductos } from "@/components/modulos/productos/tablas/TablaProductos";
import { useProductosByRamo } from "@/hooks/useProductosByRamo";
import { ramoApi } from "@/services/ramo.service";
import { ArrowLeft } from "lucide-react";

export default function RamoProductosPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener información del ramo
  const { data: ramo, isLoading: isLoadingRamo } = ramoApi.useGetById(id || "");

  // Obtener productos del ramo
  const {
    productos,
    isLoading: isLoadingProductos,
    addProducto,
  } = useProductosByRamo(id);

  const isLoading = isLoadingRamo || isLoadingProductos;

  const handleGoBack = () => {
    navigate("/dashboard/admin/maestros/ramos");
  };

  return (
    <>
      <Header
        title={`Productos de ${ramo?.nombre || "Ramo"}`}
        description="Gestiona los productos asociados a este ramo"
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
            label="Registrar Producto"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </Header>

      <div>
        {/* Información del ramo */}
        {ramo && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ramo</p>
                <p className="font-medium text-gray-900">{ramo.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Código</p>
                <p className="font-medium text-gray-900">{ramo.codigo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="font-medium text-gray-900">
                  {ramo.descripcion || "-"}
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
          <TablaProductos productos={productos} />
        )}
      </div>

      {id && (
        <RegistrarProducto
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          addProducto={addProducto}
          idRamo={id}
        />
      )}
    </>
  );
}
