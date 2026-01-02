import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { Send, Bot, User, Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { chatbotService } from "@/services/chatbot.service";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Definición de tipos para la API de reconocimiento de voz
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AustralAIPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const { messages, conversationId, addMessage, setConversationId } = useChatStore();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inicializar reconocimiento de voz si está disponible
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "es-ES";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Error en reconocimiento de voz:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await chatbotService.query({
        message: message.trim(),
        userId: user?.idUsuario || "",
        userRole: user?.rol?.nombreRol as "ADMINISTRADOR" | "BROKER" | "AGENTE",
        conversationId,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };

      addMessage(botMessage);
      setConversationId(response.conversationId);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative flex flex-col h-full overflow-hidden animate-[fadeIn_0.5s_ease-out]"
      style={{ animationFillMode: 'both' }}
    >
      <Header
        title="Austral AI"
        description="Asistente inteligente para seguros"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div
          className={`max-w-4xl mx-auto ${
            messages.length === 0 ? "h-full" : ""
          }`}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-[fadeIn_0.8s_ease-out_0.2s_both]">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
                <img
                  src="/images/logo-austral-main.png"
                  alt="Austral AI"
                  className="w-24 h-24 relative z-10 drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
                ¿En qué puedo ayudarte?
              </h2>
              <p className="text-gray-500 text-lg font-light">
                Soy tu asistente inteligente para seguros
              </p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } animate-[fadeIn_0.3s_ease-out]`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-zinc-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                      msg.role === "user"
                        ? "bg-zinc-900 text-white rounded-br-none"
                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="text-[15px] leading-relaxed">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-4 mb-3 space-y-1">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-4 mb-3 space-y-1">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="pl-1">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-blue-900">
                                {children}
                              </strong>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Animación de carga */}
              {isLoading && (
                <div className="flex gap-4 justify-start animate-[fadeIn_0.3s_ease-out]">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-6 py-4 shadow-sm">
                    <div className="flex gap-1.5 items-center h-6">
                      <div
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input flotante minimalista */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center gap-2 bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleListening}
              className={`rounded-full w-10 h-10 transition-all duration-300 ${
                isListening 
                  ? "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 animate-pulse" 
                  : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
              title={isListening ? "Detener grabación" : "Hablar"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isListening ? "Escuchando..." : "Escribe tu mensaje..."}
              className="flex-1 border-none shadow-none focus-visible:ring-0 px-2 text-base bg-transparent placeholder:text-gray-400 h-10"
            />

            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              size="icon"
              className={`rounded-full w-10 h-10 transition-all duration-300 ${
                message.trim() 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105" 
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400 font-light">
              Austral AI puede cometer errores. Verifica la información importante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
