import { useState, useRef, useEffect } from "react";
import { MessageCircleQuestion, X, Send, Loader2 } from "lucide-react";
import { api } from "@/config/api-client";
import { useAuthStore } from "@/store/auth.store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Respuestas predefinidas para consultas comunes
const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["lead", "crear", "nuevo", "registrar lead"],
    answer: "Para crear un lead: ve a Leads > clic en '+ Nuevo Lead'. Llena nombre, email, telefono, tipo de seguro y fuente. El lead aparecera en la columna 'Nuevo' del kanban.",
  },
  {
    keywords: ["cliente", "registrar cliente", "vincular"],
    answer: "Para registrar un cliente: entra al detalle del lead > clic en 'Registrar Cliente'. Ingresa el DNI o RUC y presiona 'Validar' para autocompletar con RENIEC/SUNAT. Luego completa la direccion y telefonos.",
  },
  {
    keywords: ["poliza", "registrar poliza", "nueva poliza"],
    answer: "Para registrar una poliza: primero vincula un cliente al lead. Luego aparece el boton 'Registrar Poliza' en el detalle del lead. Selecciona compania, ramo, producto, broker y agente.",
  },
  {
    keywords: ["estado", "cambiar estado", "cotizado", "emitido", "cerrado", "perdido"],
    answer: "Los estados se cambian automaticamente: Nuevo > Cotizado (al registrar cliente) > Emitido (al registrar poliza). Puedes cambiar manualmente desde el select de estado en el detalle del lead. Leads sin actividad por 7 dias pasan a Perdido automaticamente.",
  },
  {
    keywords: ["placa", "vehiculo", "soat", "consultar placa"],
    answer: "Para consultar un vehiculo: en el detalle de un lead vehicular, la consulta se hace automaticamente al detectar la placa. Veras datos del vehiculo, SOAT, papeletas, revisiones tecnicas y siniestros.",
  },
  {
    keywords: ["carta", "nombramiento", "documento"],
    answer: "La Carta de Nombramiento se sube al registrar un cliente (campo opcional al final del formulario). Acepta PDF, DOC y DOCX. Se visualiza en el detalle del lead con botones 'Vista previa' y 'Descargar'.",
  },
  {
    keywords: ["sctr", "trabajador", "nomina", "excel"],
    answer: "Para SCTR: en el detalle del lead, seccion 'Detalle SCTR', encontraras la tabla 'Nomina de Trabajadores'. Agrega trabajadores con el boton '+ Agregar trabajador'. Los datos se guardan con 'Guardar cambios'.",
  },
  {
    keywords: ["rol", "permiso", "acceso", "admin", "broker"],
    answer: "Roles del sistema: ADMINISTRADOR (acceso total), EJECUTIVO_CUENTA (CRM completo), BROKER (gestion de equipo), PROMOTOR_VENTA (leads propios), REFERENCIADOR (solo referidos), PUNTO_VENTA (polizas del punto). Cada rol ve solo lo que le corresponde.",
  },
  {
    keywords: ["token", "sbs", "auditoria"],
    answer: "Cada cliente tiene un Token SBS unico generado automaticamente al registrarse. Se muestra en el detalle del lead (seccion verde con icono de escudo). Este token es para seguimiento y auditoria ante la SBS.",
  },
  {
    keywords: ["manychat", "whatsapp", "chatbot"],
    answer: "Los leads del chatbot WhatsApp (ManyChat) aparecen automaticamente en la columna 'Nuevo' del kanban. La fuente se marca como 'WhatsApp (Chatbot)'. El CRM refresca cada 30 segundos.",
  },
  {
    keywords: ["contrasena", "password", "perfil"],
    answer: "Para cambiar tu contrasena: clic en tu avatar (esquina superior derecha) > 'Mi Perfil' > 'Cambiar contrasena'. La nueva contrasena debe tener al menos 6 caracteres.",
  },
  {
    keywords: ["buscar", "busqueda", "encontrar"],
    answer: "Usa la barra de busqueda en la parte superior (o Cmd+K / Ctrl+K). Puedes buscar clientes, leads y polizas. Los resultados aparecen en un dropdown con links directos.",
  },
];

function findFaqAnswer(query: string): string | null {
  const q = query.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keywords.some((kw) => q.includes(kw))) return faq.answer;
  }
  return null;
}

export const HelpChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hola! Soy el asistente de Austral. Puedo ayudarte con el uso del CRM. Prueba preguntar sobre: leads, clientes, polizas, estados, roles, SCTR, vehiculos, o cualquier otra funcion.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    // Primero buscar en FAQ predefinidas
    const faqAnswer = findFaqAnswer(text);
    if (faqAnswer) {
      setMessages((prev) => [...prev, { role: "assistant", content: faqAnswer }]);
      return;
    }

    // Si no hay FAQ, usar la IA
    setLoading(true);
    try {
      const { data } = await api.post("/chatbot/query", {
        userId: user?.idUsuario,
        userRole: user?.rol?.nombreRol,
        query: `[AYUDA CRM] El usuario pregunta: "${text}". Responde breve y claro sobre como usar el CRM Austral. Si no sabes, sugiere contactar al administrador.`,
        conversationId: null,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "No pude procesar tu consulta. Intenta con otra pregunta." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "No pude conectar con el asistente AI. Intenta con preguntas como: 'como crear un lead', 'como registrar poliza', 'que roles existen'." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: "var(--austral-azul)" }}
        title="Ayuda del CRM"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircleQuestion className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-[420px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div
            className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 shrink-0"
            style={{ backgroundColor: "var(--austral-azul)" }}
          >
            <MessageCircleQuestion className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Ayuda Austral CRM</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 p-2 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg text-white disabled:opacity-50 transition-colors"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
