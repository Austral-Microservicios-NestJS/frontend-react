import { api } from "@/config/api-client";
import type { Rol } from "@/types/usuario.interface";
import { useQuery } from "@tanstack/react-query";

export const ROLES_KEY = ["roles"];

export const rolApi = {
  getAll: async () => {
    const response = await api.get<Rol[]>(`/roles`);
    return response.data || [];
  },

  // ===== Hooks de React Query =====

  useGetAll: () => {
    return useQuery({
      queryKey: ROLES_KEY,
      queryFn: () => rolApi.getAll(),
    });
  },
};
