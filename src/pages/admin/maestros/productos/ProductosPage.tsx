import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import {
  RegistrarProducto,
  ProductosGrid,
} from "@/components/modulos/productos";
import { useProductos } from "@/hooks/useProductos";

export default function ProductosPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { productos, isLoading, addProducto } = useProductos();

  return (
    <>
      <Header
        title="Productos"
        description="Gestiona los productos de seguros"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Producto"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ProductosGrid productos={productos} />
        )}
      </div>

      <RegistrarProducto
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addProducto={addProducto}
      />
    </>
  );
}
