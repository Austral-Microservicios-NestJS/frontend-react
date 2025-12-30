import { api } from "@/config/api-client";
import type { InvoiceApiResponse } from "@/types/agente-factura.interface";
import { useMutation } from "@tanstack/react-query";

export const agenteFacturasApi = {
  extractData: async (file: File): Promise<InvoiceApiResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<InvoiceApiResponse>(
      "/agentes-ia/extract/invoice",
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
  useExtractInvoice: () => {
    return useMutation({
      mutationFn: (file: File) => agenteFacturasApi.extractData(file),
    });
  },
};
