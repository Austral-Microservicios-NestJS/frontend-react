import { toast } from "sonner";
import type { CreateUsuario, UpdateUsuario } from "@/types/usuario.interface";
import { usuarioApi } from "@/services/usuario.service";

export const useUsuarios = () => {
  const {
    data: usuarios = [],
    isLoading,
    isError,
    error,
    refetch: getUsuarios,
  } = usuarioApi.useGetAll();

  const create = usuarioApi.useCreate();

  const addUsuario = async (data: CreateUsuario) => {
    try {
      await create.mutateAsync(data);
      toast.success("Usuario registrado exitosamente");
    } catch (error) {
      toast.error("No se pudo registrar el usuario.");
    }
  };

  const update = usuarioApi.useUpdate();
  const updateUsuario = async (id: string, data: UpdateUsuario) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Usuario actualizado correctamente");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "No se pudo actualizar el usuario.";
      toast.error(typeof msg === "string" ? msg : "Error al actualizar");
      throw error;
    }
  };

  const remove = usuarioApi.useRemove();
  const removeUsuario = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Usuario eliminado correctamente");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "No se pudo eliminar el usuario.";
      toast.error(typeof msg === "string" ? msg : "Error al eliminar");
      throw error;
    }
  };

  return {
    addUsuario,
    updateUsuario,
    removeUsuario,
    getUsuarios,
    usuarios,
    isLoading,
    isError,
    error,
  };
};
