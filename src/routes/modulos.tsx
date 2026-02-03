import {
  BookUser,
  // Bot,
  Building2,
  FishingHook,
  FolderCog,
  HandCoins,
  Handshake,
  NotebookPen,
  ShieldAlert,
  ShieldCheck,
  User,
  WalletCards,
  Sparkles,
  Zap,
  Map,
  MessageSquare,
} from "lucide-react";
import { Roles } from "@/utils/roles";

// Tipos de módulos
export type ModuleType = "CRM" | "ERP";

// Categorías de módulos
export const moduleCategories = [
  {
    id: "general",
    title: "General",
    modules: [
      {
        id: 0,
        name: "Inicio",
        path: "/dashboard/home",
        icon: Building2,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM", "ERP"] as ModuleType[],
      },
      {
        id: 99,
        name: "Mapa",
        path: "/dashboard/general/mapa",
        icon: Map,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM", "ERP"] as ModuleType[],
      },
      {
        id: 100,
        name: "Observaciones",
        path: "/dashboard/gestion-trabajo/observaciones",
        icon: MessageSquare, // Need to import MessageSquare
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM", "ERP"] as ModuleType[],
      },
    ],
  },
  {
    id: "gestion-trabajo",
    title: "Gestión de Trabajo",
    modules: [
      {
        id: 51,
        name: "Actividades",
        path: "/dashboard/gestion-trabajo/actividades",
        icon: BookUser,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM"] as ModuleType[],
      },
      {
        id: 52,
        name: "Tareas",
        path: "/dashboard/gestion-trabajo/tareas",
        icon: NotebookPen,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM"] as ModuleType[],
      },
      {
        id: 53,
        name: "Clientes",
        path: "/dashboard/gestion-trabajo/clientes",
        icon: Handshake,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM"] as ModuleType[],
      },
      {
        id: 54,
        name: "Leads",
        path: "/dashboard/gestion-trabajo/leads",
        icon: FishingHook,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM"] as ModuleType[],
      },
      {
        id: 55,
        name: "Polizas",
        path: "/dashboard/gestion-trabajo/polizas",
        icon: FolderCog,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM", "ERP"] as ModuleType[],
      },
    ],
  },
  {
    id: "control-seguimiento",
    title: "Control de Seguimiento",
    modules: [
      {
        id: 61,
        name: "Siniestros",
        path: "/dashboard/control-seguimiento/siniestros",
        icon: ShieldAlert,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["ERP"] as ModuleType[],
      },
      {
        id: 62,
        name: "Comisiones",
        path: "/dashboard/control-seguimiento/comisiones",
        icon: HandCoins,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["ERP"] as ModuleType[],
      },
      {
        id: 63,
        name: "Cobranzas",
        path: "/dashboard/control-seguimiento/cobranzas",
        icon: WalletCards,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["ERP"] as ModuleType[],
      },
    ],
  },
  {
    id: "agentes-ia",
    title: "Agentes IA",
    modules: [
      {
        id: 70,
        name: "Austral AI",
        path: "/dashboard/agentes-ia/austral-ai",
        icon: Sparkles,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM", "ERP"] as ModuleType[],
        isAuroraModule: true, // Marcador especial para aplicar efecto aurora
      },
      {
        id: 74,
        name: "Insights",
        path: "/dashboard/agentes-ia/insights",
        icon: Zap,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
        type: ["CRM", "ERP"] as ModuleType[],
      },
      // {
      //   id: 71,
      //   name: "Agente de Facturas",
      //   path: "/dashboard/agentes-ia/agente-facturas",
      //   icon: Bot,
      //   roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      //   type: ["CRM"] as ModuleType[],
      // },
      // {
      //   id: 72,
      //   name: "Agente de DNI",
      //   path: "/dashboard/agentes-ia/agente-dni",
      //   icon: Bot,
      //   roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      //   type: ["CRM"] as ModuleType[],
      // },
      // {
      //   id: 73,
      //   name: "Agente de Pólizas",
      //   path: "/dashboard/agentes-ia/agente-polizas",
      //   icon: Bot,
      //   roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      //   type: ["CRM", "ERP"] as ModuleType[],
      // },
    ],
  },
  {
    id: "maestros",
    title: "Maestros",
    modules: [
      {
        id: 1,
        name: "Compañias de Seguros",
        path: "/dashboard/admin/maestros/companias",
        icon: Building2,
        roles: [Roles.ADMINISTRADOR],
        type: ["CRM", "ERP"] as ModuleType[],
      },
      {
        id: 2,
        name: "Ramos",
        path: "/dashboard/admin/maestros/ramos",
        icon: ShieldCheck,
        roles: [Roles.ADMINISTRADOR],
        type: ["CRM", "ERP"] as ModuleType[],
      },
      {
        id: 4,
        name: "Usuarios",
        path: "/dashboard/admin/maestros/usuarios",
        icon: User,
        roles: [Roles.ADMINISTRADOR],
        type: ["CRM", "ERP"] as ModuleType[],
      },
    ],
  },
  {
    id: "modulos",
    title: "Módulos",
    modules: [
      {
        id: 201,
        name: "Mis Agentes",
        path: "/dashboard/broker/agentes",
        icon: User,
        roles: [Roles.BROKER],
        type: ["CRM"] as ModuleType[],
      },
    ],
  },
  {
    id: "informacion-extra",
    title: "Información Extra",
    modules: [
      {
        id: 301,
        name: "Compañias de Seguros",
        path: "/dashboard/informacion-extra/companias",
        icon: Building2,
        roles: [Roles.BROKER, Roles.AGENTE],
        type: ["CRM", "ERP"] as ModuleType[],
      },
    ],
  },
];
