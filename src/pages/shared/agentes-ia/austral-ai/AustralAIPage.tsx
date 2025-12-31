import { useState } from "react";
import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { Sparkles, Send } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { chatbotService } from "@/services/chatbot.service";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AustralAIPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuery = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      // Construir request sin conversationId inicialmente
      const baseRequest = {
        message: userQuery,
        userId: user.idUsuario,
        userRole: user.rol?.nombreRol as "ADMINISTRADOR" | "BROKER" | "AGENTE",
      };

      // Solo agregar conversationId si existe (usando spread operator para garantizar que NO se incluya la propiedad si no existe)
      const requestData = conversationId
        ? { ...baseRequest, conversationId }
        : baseRequest;

      console.log("🔍 Estado conversationId ANTES de enviar:", conversationId);
      console.log("🔍 ¿Tiene conversationId el request?:", 'conversationId' in requestData);
      console.log("📤 Request enviado al backend:", JSON.stringify(requestData, null, 2));

      const response = await chatbotService.query(requestData);

      console.log("📥 Response recibido del backend:", JSON.stringify(response, null, 2));

      // Guardar el conversationId para la siguiente consulta
      setConversationId(response.conversationId);
      console.log("💾 conversationId guardado para próxima consulta:", response.conversationId);

      // Agregar respuesta del chatbot
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error al consultar chatbot:", error);
      toast.error("Error al conectar con Austral AI");

      // Mensaje de error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, no pude procesar tu consulta en este momento. Por favor, intenta nuevamente.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Header
        title="Austral AI"
        description="Asistente inteligente para seguros"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
        {/* Área de mensajes */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: '65vh', scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}>
          {messages.length === 0 ? (
            // Estado inicial - Centrado (sin scroll)
            <div className="flex flex-col items-center justify-center px-6 py-16">
              <div className="flex justify-center mb-8 animate-[fadeIn_0.6s_ease-in-out]">
                <div className="relative">
                  <div className="absolute inset-0 aurora-bg opacity-20 blur-3xl rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full aurora-bg">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8 animate-[fadeIn_0.8s_ease-in-out]">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  ¿En qué puedo ayudarte hoy?
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 justify-center max-w-2xl animate-[fadeIn_1s_ease-in-out]">
                <SuggestionChip text="¿Cuántos leads tengo?" onClick={() => setMessage("¿Cuántos leads tengo?")} />
                <SuggestionChip text="Mostrar mis clientes activos" onClick={() => setMessage("Mostrar mis clientes activos")} />
                <SuggestionChip text="¿Qué tareas tengo pendientes?" onClick={() => setMessage("¿Qué tareas tengo pendientes?")} />
                <SuggestionChip text="Listar leads en estado NUEVO" onClick={() => setMessage("Listar leads en estado NUEVO")} />
              </div>
            </div>
          ) : (
            // Mensajes - Estilo ChatGPT/Gemini (con scroll)
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-4">
                  {/* Avatar */}
                  <div className="shrink-0">
                    {msg.sender === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-sm font-semibold">
                        U
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full aurora-bg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Mensaje */}
                  <div className="flex-1 pt-1">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {msg.sender === "user" ? "Tú" : "Austral AI"}
                    </div>
                    <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none">
                      {msg.sender === "ai" ? (
                        <ReactMarkdown
                          components={{
                            // Personalizar el renderizado de elementos
                            p: ({ children }) => <p className="mb-2">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            li: ({ children }) => <li className="ml-2">{children}</li>,
                            h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>,
                            code: ({ children }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                            pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-2">{children}</pre>,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicador de carga */}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full aurora-bg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      Austral AI
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

          {/* Input área */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-2 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu consulta aquí..."
                  className="flex-1 px-4 py-3 bg-transparent border-0 text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-95 shrink-0 ${
                    message.trim() && !isLoading
                      ? "bg-[#0066CC] hover:bg-[#0052a3]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Suggestion Chip Component
function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors border border-gray-200"
    >
      {text}
    </button>
  );
}
