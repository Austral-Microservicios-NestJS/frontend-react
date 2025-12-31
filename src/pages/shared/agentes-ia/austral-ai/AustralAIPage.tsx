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

      {/* Contenedor principal - Estilo ChatGPT/Gemini */}
      <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
        {/* Área de mensajes con scroll */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #f9fafb' }}>
          {messages.length === 0 ? (
            // Estado inicial - Centrado y espaciado
            <div className="flex flex-col items-center justify-center h-full px-6">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 aurora-bg opacity-20 blur-3xl rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full aurora-bg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-3">
                  ¿En qué puedo ayudarte hoy?
                </h2>
                <p className="text-gray-500 text-sm">
                  Consulta sobre leads, clientes, pólizas y más
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                <SuggestionChip text="¿Cuántos leads tengo?" onClick={() => setMessage("¿Cuántos leads tengo?")} />
                <SuggestionChip text="Mostrar mis clientes activos" onClick={() => setMessage("Mostrar mis clientes activos")} />
                <SuggestionChip text="¿Qué tareas tengo pendientes?" onClick={() => setMessage("¿Qué tareas tengo pendientes?")} />
                <SuggestionChip text="Listar leads en estado NUEVO" onClick={() => setMessage("Listar leads en estado NUEVO")} />
              </div>
            </div>
          ) : (
            // Mensajes - Estilo ChatGPT/Gemini
            <div className="w-full">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`py-6 px-4 ${msg.sender === "ai" ? "bg-gray-50" : "bg-white"}`}
                >
                  <div className="max-w-3xl mx-auto flex gap-6">
                    {/* Avatar */}
                    <div className="shrink-0">
                      {msg.sender === "user" ? (
                        <div className="w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center text-white text-sm font-semibold">
                          U
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full aurora-bg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Mensaje */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 mb-2">
                        {msg.sender === "user" ? "Tú" : "Austral AI"}
                      </div>
                      <div className="text-gray-800 text-[15px] leading-7">
                        {msg.sender === "ai" ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                              ol: ({ children }) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-2">{children}</ol>,
                              ul: ({ children }) => <ul className="list-disc list-outside ml-5 mb-4 space-y-2">{children}</ul>,
                              li: ({ children }) => <li className="leading-7">{children}</li>,
                              h1: ({ children }) => <h1 className="text-xl font-semibold mb-3 mt-4">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-lg font-semibold mb-3 mt-4">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-3">{children}</h3>,
                              code: ({ children }) => <code className="bg-gray-800 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                              pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        ) : (
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicador de carga */}
              {isLoading && (
                <div className="py-6 px-4 bg-gray-50">
                  <div className="max-w-3xl mx-auto flex gap-6">
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full aurora-bg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 mb-2">
                        Austral AI
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input fijo en la parte inferior - Estilo ChatGPT/Gemini */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 bg-white rounded-3xl border border-gray-300 shadow-sm hover:border-gray-400 transition-colors focus-within:border-[#0066CC] focus-within:shadow-md">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Envía un mensaje a Austral AI"
                className="flex-1 px-5 py-3 bg-transparent border-0 text-gray-900 placeholder-gray-500 focus:outline-none text-[15px]"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className={`mr-2 p-2 rounded-full transition-all ${
                  message.trim() && !isLoading
                    ? "bg-[#0066CC] hover:bg-[#0052a3] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Suggestion Chip Component - Estilo ChatGPT/Gemini
function SuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm rounded-xl transition-all border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
    >
      {text}
    </button>
  );
}
