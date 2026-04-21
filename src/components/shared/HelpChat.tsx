import { useState, useRef, useEffect } from "react";
import { MessageCircleQuestion, X, Send, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { api } from "@/config/api-client";
import { useAuthStore } from "@/store/auth.store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FaqCategory {
  title: string;
  items: { q: string; a: string }[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "Leads",
    items: [
      { q: "Como crear un lead?", a: "Ve a Leads > clic en '+ Nuevo Lead'. Llena nombre, email, telefono, tipo de seguro y fuente. El lead aparecera en la columna 'Nuevo'." },
      { q: "Como se mueven los estados?", a: "Automatico: Nuevo > Cotizado (al registrar cliente) > Emitido (al registrar poliza) > Cerrado. Puedes cambiar manualmente desde el select de estado o arrastrando en el kanban. Leads sin actividad por 7 dias pasan a Perdido." },
      { q: "Puedo importar leads?", a: "Los leads llegan automaticamente desde WhatsApp (ManyChat) o se crean manualmente desde el CRM. El kanban se actualiza cada 30 segundos." },
    ],
  },
  {
    title: "Clientes",
    items: [
      { q: "Como registrar un cliente?", a: "Desde el detalle del lead > 'Registrar Cliente'. Selecciona Natural o Juridica. Para autocompletar, ingresa DNI o RUC y presiona 'Validar' (consulta RENIEC o SUNAT)." },
      { q: "Que es Natural vs Juridica?", a: "Natural = persona con DNI/CE/Pasaporte. Juridica = empresa con RUC (empieza con 20). RUC que empieza con 10 es persona natural con negocio." },
      { q: "Que es la Carta de Nombramiento?", a: "Documento firmado por el cliente designando a AI Corredores como su corredor. Se sube al registrar cliente (PDF/DOC) y se visualiza en el detalle del lead." },
    ],
  },
  {
    title: "Polizas",
    items: [
      { q: "Como registrar una poliza?", a: "Primero vincula un cliente al lead. Aparece el boton 'Registrar Poliza'. Selecciona compania, ramo, producto, vigencia, broker y agente." },
      { q: "Donde veo las polizas de un cliente?", a: "En el detalle del lead, seccion 'Polizas Emitidas'. Tambien en la pagina de Polizas del menu lateral." },
    ],
  },
  {
    title: "SCTR",
    items: [
      { q: "Como agregar trabajadores SCTR?", a: "En el detalle del lead SCTR, seccion 'Nomina de Trabajadores'. Usa '+ Agregar trabajador' o 'Importar Excel'. Guarda con 'Guardar cambios'." },
      { q: "Como exportar el Excel SCTR?", a: "Clic en 'Exportar Excel' en la seccion SCTR. Genera un archivo con 2 hojas: Empresa y Trabajadores (formato trama estandar)." },
      { q: "Como importar trabajadores desde Excel?", a: "Clic en 'Importar Excel'. El archivo debe tener columnas: Tipo Doc, N Doc, Ap. Paterno, Ap. Materno, Nombres, F. Nacimiento, Sexo, Sueldo." },
    ],
  },
  {
    title: "Vehiculos",
    items: [
      { q: "Como consultar una placa?", a: "En el detalle de un lead vehicular, la consulta se hace automaticamente. Veras: datos del vehiculo, SOAT, papeletas, revisiones tecnicas y siniestros." },
      { q: "Que es Orbelite/Infraxion?", a: "Es la API externa que consulta datos vehiculares de Peru (SUNARP, SAT Lima, MTC). Cada consulta consume 1 credito." },
    ],
  },
  {
    title: "Roles y Acceso",
    items: [
      { q: "Que roles existen?", a: "ADMINISTRADOR (todo), EJECUTIVO_CUENTA (CRM completo), BROKER (gestion de equipo), PROMOTOR_VENTA (leads propios), REFERENCIADOR (solo referidos), PUNTO_VENTA (polizas del punto)." },
      { q: "Que es el Token SBS?", a: "Cada cliente tiene un token unico generado automaticamente para seguimiento y auditoria ante la SBS. Se muestra en el detalle del lead." },
      { q: "Como cambiar mi contrasena?", a: "Clic en tu avatar (esquina superior derecha) > 'Mi Perfil' > 'Cambiar contrasena'." },
    ],
  },
];

export const HelpChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"faq" | "chat">("faq");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && mode === "chat") inputRef.current?.focus();
  }, [isOpen, mode]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/chatbot/help", {
        question: text,
        userRole: user?.rol?.nombreRol || "USUARIO",
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || "No pude procesar tu consulta." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "No pude conectar con el asistente. Revisa las preguntas frecuentes." }]);
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
        <div className="fixed bottom-20 right-6 z-50 w-80 h-[450px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0" style={{ backgroundColor: "var(--austral-azul)" }}>
            <div className="flex items-center gap-2">
              <MessageCircleQuestion className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Ayuda Austral</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMode("faq")} className={`px-2 py-0.5 text-[10px] font-medium rounded ${mode === "faq" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"}`}>FAQ</button>
              <button onClick={() => setMode("chat")} className={`px-2 py-0.5 text-[10px] font-medium rounded ${mode === "chat" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"}`}>Chat AI</button>
            </div>
          </div>

          {mode === "faq" ? (
            /* FAQ Mode */
            <div className="flex-1 overflow-y-auto p-2">
              {FAQ_CATEGORIES.map((cat) => (
                <div key={cat.title} className="mb-1">
                  <button
                    onClick={() => setExpandedCat(expandedCat === cat.title ? null : cat.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {cat.title}
                    {expandedCat === cat.title ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  {expandedCat === cat.title && (
                    <div className="ml-2 space-y-1 mb-2">
                      {cat.items.map((item, i) => (
                        <details key={i} className="group">
                          <summary className="px-3 py-1.5 text-xs font-medium text-blue-700 cursor-pointer hover:bg-blue-50 rounded-lg list-none flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform shrink-0" />
                            {item.q}
                          </summary>
                          <p className="px-3 py-2 ml-4 text-xs text-gray-600 bg-gray-50 rounded-lg leading-relaxed">{item.a}</p>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-3 py-3 mt-2 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700">No encuentras lo que buscas? Cambia a <button onClick={() => setMode("chat")} className="font-semibold underline">Chat AI</button> para preguntas personalizadas.</p>
              </div>
            </div>
          ) : (
            /* Chat AI Mode */
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <MessageCircleQuestion className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Pregunta lo que necesites sobre el CRM</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}>{msg.content}</div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none"><Loader2 className="w-4 h-4 animate-spin text-gray-400" /></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-gray-100 p-2 flex gap-2 shrink-0">
                <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Escribe tu pregunta..." className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" disabled={loading} />
                <button onClick={handleSend} disabled={loading || !input.trim()} className="p-2 rounded-lg text-white disabled:opacity-50" style={{ backgroundColor: "var(--austral-azul)" }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
