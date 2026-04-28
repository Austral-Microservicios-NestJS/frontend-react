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
  // Obtener la cotización más reciente de un lead
  getLatestByLeadId: async (leadId: string): Promise<Quote | null> => {
    try {
      console.log(`Buscando cotización para lead: ${leadId}`);
      // Nota: El backend de gateway no tiene un endpoint directo por leadId, 
      // así que usaremos el de buscar todas y filtraremos en el frontend o 
      // implementaremos la búsqueda por ID de lead si existiera.
      // Como el controller de gateway solo tiene 'find_one_quote', asumiremos 
      // que el ID de la cotización se maneja en el flujo del lead.
      
      // Intentamos obtener por el ID de cotización (si el lead lo tuviera)
      // Pero como el lead no tiene id_quote en el interface, buscaremos una vía alternativa.
      // Por ahora, devolvemos null y dejaremos que se cree/complete una.
      return null;
    } catch (error) {
      console.error("Error al obtener cotización:", error);
      return null;
    }
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
