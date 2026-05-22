import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header, BotonRegistro, ModalConfirmacion } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarProducto } from "@/components/modulos/productos";
import { TablaProductos } from "@/components/modulos/productos/tablas/TablaProductos";
import { EditarProducto } from "@/components/modulos/productos/modales/EditarProducto";
import { useProductosByRamo } from "@/hooks/useProductosByRamo";
import { ramoApi } from "@/services/ramo.service";
import { productoApi } from "@/services/producto.service";
import { useAuthStore } from "@/store/auth.store";
import { Roles } from "@/utils/roles";
import type { Producto, UpdateProductoDto } from "@/types/producto.interface";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function RamoProductosPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombreRol === Roles.ADMINISTRADOR;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(
    null,
  );

  // Obtener información del ramo
  const { data: ramo, isLoading: isLoadingRamo } = ramoApi.useGetById(id || "");

  // Obtener productos del ramo
  const {
    productos,
    isLoading: isLoadingProductos,
    addProducto,
    updateProducto,
  } = useProductosByRamo(id);

  const deleteProducto = productoApi.useDelete();

  const isLoading = isLoadingRamo || isLoadingProductos;

  const handleGoBack = () => {
    navigate("/dashboard/admin/maestros/ramos");
  };

  const handleEditSubmit = async (data: UpdateProductoDto) => {
    if (!editingProducto) return;
    try {
      await updateProducto(editingProducto.idProducto, data);
      toast.success("Producto actualizado");
      setEditingProducto(null);
    } catch {
      toast.error("No se pudo actualizar el producto");
    }
  };

  const confirmarEliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      await deleteProducto.mutateAsync(productoAEliminar.idProducto);
      toast.success("Producto eliminado");
      setProductoAEliminar(null);
    } catch {
      toast.error("No se pudo eliminar el producto");
    }
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
          <TablaProductos
            productos={productos}
            onEdit={isAdmin ? setEditingProducto : undefined}
            onDelete={isAdmin ? setProductoAEliminar : undefined}
          />
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

      {editingProducto && (
        <EditarProducto
          isOpen={!!editingProducto}
          onClose={() => setEditingProducto(null)}
          onSubmit={handleEditSubmit}
          producto={editingProducto}
        />
      )}

      <ModalConfirmacion
        isOpen={!!productoAEliminar}
        onClose={() => setProductoAEliminar(null)}
        onConfirm={confirmarEliminarProducto}
        title="Eliminar producto"
        message={
          productoAEliminar
            ? `¿Eliminar definitivamente el producto "${productoAEliminar.nombre}"? Las pólizas y leads que referencien este producto pueden quedar huérfanos. Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar definitivamente"
        isLoading={deleteProducto.isPending}
      />
    </>
  );
}
