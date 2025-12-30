import { useState } from "react";
import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { Sparkles, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AustralAIPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Agregar mensaje del usuario
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage("");

      // Simular respuesta de IA después de 1 segundo
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Gracias por tu mensaje. Pronto estaré lista para ayudarte con tus consultas de seguros.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden z-10">
      <Header
        title="Austral AI"
        description="Asistente inteligente para seguros"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Área de mensajes - Con scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white"
             style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}>
          {messages.length === 0 ? (
            // Estado inicial - Centrado (sin scroll)
            <div className="flex flex-col items-center justify-center h-full px-6">
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
                <SuggestionChip text="Buscar cliente" onClick={() => setMessage("Buscar cliente")} />
                <SuggestionChip text="Consultar póliza" onClick={() => setMessage("Consultar póliza")} />
                <SuggestionChip text="Generar reporte" onClick={() => setMessage("Generar reporte")} />
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
                    <div className="text-gray-800 leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input fijo abajo con más espacio - Estilo ChatGPT */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-6 py-6 pb-8">
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow">
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
                  disabled={!message.trim()}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-95 shrink-0 ${
                    message.trim()
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
    </div>
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
