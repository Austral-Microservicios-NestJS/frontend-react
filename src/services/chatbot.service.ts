import { api } from "@/config/api-client";

// ==================== TYPES ====================

export interface ChatbotQueryRequest {
  message: string;
  userId: string;
  userRole: "ADMINISTRADOR" | "BROKER" | "AGENTE";
  conversationId?: string;
}

export interface GeneratedFile {
  type: "pdf" | "excel";
  filename: string;
  filepath: string;
  metadata: any;
}

export interface ChatbotQueryResponse {
  response: string;
  conversationId: string;
  generatedFiles?: GeneratedFile[];
  timestamp: string;
}

export interface ChatbotHealthResponse {
  service: string;
  status: string;
  timestamp: string;
}

// ==================== API FUNCTIONS ====================

export const chatbotService = {
  // Enviar consulta al chatbot
  query: async (
    request: ChatbotQueryRequest
  ): Promise<ChatbotQueryResponse> => {
    try {
      const { data } = await api.post("/chatbot/query", request);
      // Backend envía directamente { response, conversationId, timestamp }
      return data;
    } catch (error) {
      console.error("Chatbot Service - Error:", error);
      throw error;
    }
  },

  // Descargar archivo generado
  downloadFile: async (
    type: "pdf" | "excel",
    filename: string
  ): Promise<Blob> => {
    try {
      // Mapear 'pdf' a 'pdfs' según requerimiento del backend
      const urlType = type === "pdf" ? "pdfs" : type;
      const response = await api.get(`/chatbot/files/${urlType}/${filename}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("❌ Chatbot Service - Error descargando archivo:", error);
      throw error;
    }
  },

  // Verificar estado del servicio
  health: async (): Promise<ChatbotHealthResponse> => {
    try {
      const { data } = await api.post("/chatbot/health");
      return data;
    } catch (error) {
      console.error("Error al verificar estado del chatbot:", error);
      throw error;
    }
  },
};
