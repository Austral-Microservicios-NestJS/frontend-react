import { toast } from "sonner";
import type { CreateProductoDto, UpdateProductoDto } from "@/types/producto.interface";
import { productoApi } from "@/services/producto.service";

export const useProductosByRamo = (idRamo?: string) => {
  // Usar el endpoint específico para obtener productos por ramo
  const { data: productos = [], isLoading } = productoApi.useGetByRamo(idRamo || "");

  const create = productoApi.useCreate();
  const addProducto = async (data: CreateProductoDto) => {
    try {
      await create.mutateAsync(data);
      toast.success("Producto registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar producto:", error);
      toast.error("No se pudo registrar el producto");
      throw error;
    }
  };

  const update = productoApi.useUpdate();
  const updateProducto = async (id: string, data: UpdateProductoDto) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      toast.error("No se pudo actualizar el producto");
      throw error;
    }
  };

  const deleteProducto = productoApi.useDelete();
  const removeProducto = async (id: string) => {
    try {
      await deleteProducto.mutateAsync(id);
      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("No se pudo eliminar el producto");
      throw error;
    }
  };

  return {
    productos,
    isLoading,
    addProducto,
    updateProducto,
    removeProducto,
  };
};
