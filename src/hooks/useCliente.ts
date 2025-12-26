import { toast } from "sonner";
import type { CreateCliente, UpdateCliente } from "@/types/cliente.interface";
import { clienteApi } from "@/services/cliente.service";
import { useAuthStore } from "@/store/auth.store";

export const useClientes = () => {
  const { user } = useAuthStore();
  const idUsuario = user?.idUsuario || "";

  const {
    data: clientes = [],
    isLoading,
    isError,
    error,
    refetch: getClientes,
  } = clienteApi.useGetAllByUsuario(idUsuario);

  const create = clienteApi.useCreate();

  const addCliente = async (data: CreateCliente) => {
    try {
      await create.mutateAsync(data);
      toast.success("Cliente registrado exitosamente");
    } catch (error) {
      toast.error("No se pudo registrar el cliente.");
    }
  };

  const update = clienteApi.useUpdate();
  const updateCliente = async (id: string, data: UpdateCliente) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Cliente actualizado exitosamente");
    } catch (error) {
      toast.error("No se pudo actualizar el cliente.");
    }
  };

  return {
    addCliente,
    updateCliente,
    getClientes,
    clientes,
    isLoading,
    isError,
    error,
  };
};
