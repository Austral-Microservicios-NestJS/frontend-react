import type { ReactNode } from "react";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: "🧱",
    title: "Stack moderno",
    description:
      "React 19 + Vite + TypeScript con shadcn/ui sobre Tailwind. React Query maneja todo el estado de servidor; Zustand el cliente.",
  },
  {
    icon: "🔐",
    title: "Seguro por rol",
    description:
      "Roles ADMINISTRADOR, EJECUTIVO_CUENTA, BROKER, PROMOTOR_VENTA, REFERENCIADOR y PUNTO_VENTA. Rutas protegidas y datos filtrados desde el JWT.",
  },
  {
    icon: "🧩",
    title: "Módulos por dominio",
    description:
      "Clientes, Leads, Pólizas, Usuarios, Tareas y Agentes IA. Cada uno con su servicio, hook, modales y tablas separados.",
  },
  {
    icon: "🤖",
    title: "Integración IA",
    description:
      "Chatbot AI propio, recordatorios automáticos por email y WhatsApp (ManyChat) y consulta de información del agente para el cliente.",
  },
  {
    icon: "✅",
    title: "Validaciones consistentes",
    description:
      "Helpers compartidos para DNI, RUC, CE, pasaporte y teléfonos Perú. Mensajes en rojo bajo cada campo y patrones reutilizables.",
  },
  {
    icon: "🚀",
    title: "Deploy continuo",
    description:
      "Frontend en Railway con auto-deploy desde main. Backend en GCP con microservicios Docker tras NATS y Cloud SQL.",
  },
];

export default function HomepageFeatures(): ReactNode {
  return (
    <section>
      <div className="text--center" style={{ paddingTop: "3rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
          Lo esencial del frontend
        </h2>
        <p style={{ color: "#5a6b7b", maxWidth: 600, margin: "0 auto" }}>
          Una vista rápida de cómo está organizado el CRM y qué decisiones
          técnicas lo sostienen.
        </p>
      </div>

      <div className="features-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
