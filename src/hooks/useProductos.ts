import { toast } from "sonner";
import type { CreateProductoDto, UpdateProductoDto } from "@/types/producto.interface";
import { productoApi } from "@/services/producto.service";

export const useProductos = () => {
  const {
    data: productos = [],
    isLoading,
    isError,
    error,
    refetch: getProductos,
  } = productoApi.useGetAll();

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
    isError,
    error,
    addProducto,
    updateProducto,
    removeProducto,
    getProductos,
  };
};
