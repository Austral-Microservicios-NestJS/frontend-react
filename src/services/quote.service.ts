import { api } from "@/config/api-client";

export interface Quote {
  id: string;
  idLead: string;
  clientName: string;
  company: string;
  insuranceType: string;
  status: string;
  pdfUrl?: string; // Data URI or URL
  specificData?: any;
  contactData?: any;
}

export const quoteService = {
  // Obtener la cotización más reciente de un lead.
  // El gateway solo expone `find_one_quote` por id de cotización, no por leadId,
  // así que esta función queda como stub para la futura búsqueda alternativa.
  getLatestByLeadId: async (_leadId: string): Promise<Quote | null> => {
    return null;
  },

  // Completar y generar PDF de la cotización
  completeQuote: async (id: string, updateData?: any): Promise<Quote> => {
    const { data } = await api.patch<Quote>(`/quotes/${id}/complete`, { updateData });
    return data;
  },

  // Crear una nueva cotización (si no existe)
  create: async (idLead: string, company?: string): Promise<Quote> => {
    // Nota: El endpoint en gateway es /webhooks/manychat/quotes (POST)
    const { data } = await api.post<Quote>("/webhooks/manychat/quotes", { idLead, company });
    return data;
  },
  
  // Obtener por ID
  getById: async (id: string): Promise<Quote> => {
    const { data } = await api.get<Quote>(`/quotes/${id}`);
    return data;
  },

  // Enviar cotización por email
  enviarEmail: async (params: { 
    destinatario: string; 
    nombreCliente: string; 
    cotizacion: any;
    pdfBase64?: string;
  }): Promise<{ success: boolean; mensaje: string }> => {
    const { data } = await api.post("/chatbot/enviar-cotizacion", params);
    return data;
  },

  // Subir PDFs para análisis comparativo (hasta 6)
  uploadPdfs: async (files: File[]): Promise<any> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const { data } = await api.postForm("/quotes/upload-pdf", formData);
    return data;
  }
};
