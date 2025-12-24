import { toast } from "sonner";
import type { CreateActividad, UpdateActividad } from "@/types/actividad.interface";
import { actividadApi } from "@/services/actividad.service";
import { useAuthStore } from "@/store/auth.store";

export const useActividades = () => {
    const { user } = useAuthStore();
    const idUsuario = user?.idUsuario || "";

    const {
        data: actividades = [],
        isLoading,
        isError,
        error,
        refetch: getActividades,
    } = actividadApi.useGetAllByUsuario(idUsuario);

    const create = actividadApi.useCreate();
    const addActividad = async (data: CreateActividad) => {
        try {
            await create.mutateAsync(data);
            toast.success("Actividad registrada exitosamente");
        } catch (error) {
            toast.error("No se pudo registrar la actividad.");
        }
    };

    const update = actividadApi.useUpdate();
    const updateActividad = async (id: string, data: UpdateActividad) => {
        try {
            await update.mutateAsync({ id, data });
            toast.success("Actividad actualizada exitosamente");
        } catch (error) {
            toast.error("No se pudo actualizar la actividad.");
        }
    };

    return {
        addActividad,
        updateActividad,
        getActividades,
        actividades,
        isLoading,
        isError,
        error,
    };
};