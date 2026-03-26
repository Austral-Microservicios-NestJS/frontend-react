import { api } from "@/config/api-client";
import type { ClienteDocumento } from "@/types/cliente.interface";
import { useQuery } from "@tanstack/react-query";

const DOCS_KEY = ["cliente-documentos"];

export const clienteDocumentoApi = {
  getByCliente: async (idCliente: string): Promise<ClienteDocumento[]> => {
    const response = await api.get<ClienteDocumento[]>(
      `/cliente-documento/cliente/${idCliente}`,
    );
    return response.data || [];
  },

  useGetByCliente: (idCliente: string) => {
    return useQuery({
      queryKey: [...DOCS_KEY, idCliente],
      queryFn: () => clienteDocumentoApi.getByCliente(idCliente),
      enabled: !!idCliente,
    });
  },
};
