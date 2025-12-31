import { api } from "@/config/api-client";

// ==================== TYPES ====================

export interface ChatbotQueryRequest {
  message: string;
  userId: string;
  userRole: "ADMINISTRADOR" | "BROKER" | "AGENTE";
  conversationId?: string;
}

export interface ChatbotQueryResponse {
  response: string;
  conversationId: string;
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
  query: async (request: ChatbotQueryRequest): Promise<ChatbotQueryResponse> => {
    try {
      const { data } = await api.post("/chatbot/query", request);
      // El backend envía { response: { response: "...", conversationId: "..." }, timestamp: "..." }
      // Necesitamos extraer data.response que contiene el objeto real
      return data.response;
    } catch (error) {
      console.error("Error al consultar chatbot:", error);
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
