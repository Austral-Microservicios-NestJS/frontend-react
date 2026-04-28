import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateUsuario, UpdateUsuario } from "@/types/usuario.interface";
import { usuarioApi, USUARIOS_KEY } from "@/services/usuario.service";
import { useAuthStore } from "@/store/auth.store";

// Traduce errores comunes del backend a mensajes claros para el agente
function mensajeErrorAmigable(error: any): string {
  const raw =
    error?.response?.data?.message ||
    error?.message ||
    "Error desconocido";

  const texto = Array.isArray(raw) ? raw.join(", ") : String(raw);

  if (/correo.*en uso/i.test(texto)) {
    return "Ese correo ya está registrado. Usa otro.";
  }
  if (/numero_documento|unique.*documento|UQ_af/i.test(texto)) {
    return "Ese número de documento ya existe. Verifica el DNI/CE.";
  }
  if (/nombre_usuario|unique.*nombre_usuario/i.test(texto)) {
    return "Ese nombre de usuario ya está tomado.";
  }
  if (/supervisor.*no encontrado/i.test(texto)) {
    return "El supervisor no es válido. Recarga la página y reintenta.";
  }
  if (/validation|should not be empty|must be/i.test(texto)) {
    return `Faltan datos o hay campos inválidos: ${texto}`;
  }
  return texto.length > 200 ? "Error al registrar. Verifica los datos." : texto;
}

export const useAgentes = () => {
  const { user } = useAuthStore();
  const qc = useQueryClient();
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
      toast.success("Agente registrado correctamente");
      // invalidar lista de subordinados (clave distinta a USUARIOS_KEY)
      qc.invalidateQueries({ queryKey: [...USUARIOS_KEY, "subordinados", idSupervisor] });
      await getAgentes();
    } catch (error: any) {
      toast.error(mensajeErrorAmigable(error));
      throw error; // re-throw para que el modal no cierre si el caller lo espera
    }
  };

  const update = usuarioApi.useUpdate();
  const updateAgente = async (id: string, data: UpdateUsuario) => {
    try {
      await update.mutateAsync({ id, data });
      toast.success("Agente actualizado correctamente");
      qc.invalidateQueries({ queryKey: [...USUARIOS_KEY, "subordinados", idSupervisor] });
      await getAgentes();
    } catch (error: any) {
      toast.error(mensajeErrorAmigable(error));
      throw error;
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
