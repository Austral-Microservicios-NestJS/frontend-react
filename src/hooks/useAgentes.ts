import { toast } from "sonner";
import type { CreateUsuario, UpdateUsuario } from "@/types/usuario.interface";
import { usuarioApi } from "@/services/usuario.service";
import { useAuthStore } from "@/store/auth.store";

export const useAgentes = () => {
  const { user } = useAuthStore();
  const idSupervisor = user?.idUsuario || "";

  const {
    data: agentesData,
    isLoading,
    isError,
    error,
    refetch: getAgentes,
  } = usuarioApi.useGetSubordinados(idSupervisor);

  const agentes = agentesData || [];

  const create = usuarioApi.useCreate();

  const addAgente = async (data: CreateUsuario) => {
    try {
      await create.mutateAsync(data);
      toast.success("Agente registrado exitosamente");
    } catch (error) {
      toast.error("No se pudo registrar el agente.");
    }
  };

  const update = usuarioApi.useUpdate();
  const updateAgente = async (id: string, data: UpdateUsuario) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Agente actualizado exitosamente");
    } catch (error) {
      toast.error("No se pudo actualizar el agente.");
    }
  };

  return {
    addAgente,
    updateAgente,
    getAgentes,
    agentes,
    isLoading,
    isError,
    error,
  };
};
