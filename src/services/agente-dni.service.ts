import { api } from "@/config/api-client";
import type { DniApiResponse } from "@/types/agente-dni.interface";
import { useMutation } from "@tanstack/react-query";

export const agenteDniApi = {
  extractData: async (file: File): Promise<DniApiResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<DniApiResponse>(
      "/agentes-ia/extract/identity",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // React Query hooks
  useExtractDni: () => {
    return useMutation({
      mutationFn: (file: File) => agenteDniApi.extractData(file),
    });
  },
};
