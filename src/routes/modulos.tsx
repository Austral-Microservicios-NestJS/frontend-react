import {
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
import { Roles, RoleGroups } from "@/utils/roles";

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
        roles: RoleGroups.CON_REFERENCIADOR,
        type: ["CRM", "ERP"] as ModuleType[],
      },
      {
        id: 99,
        name: "Mapa",
        path: "/dashboard/general/mapa",
        icon: Map,
        roles: RoleGroups.TODOS_CRM,
        type: ["CRM", "ERP"] as ModuleType[],
      },
      {
        id: 100,
        name: "Observaciones",
        path: "/dashboard/gestion-trabajo/observaciones",
        icon: MessageSquare,
        roles: RoleGroups.TODOS_CRM,
        type: ["CRM", "ERP"] as ModuleType[],
      },
    ],
  },
  {
    id: "gestion-trabajo",
    title: "Gestión de Trabajo",
    modules: [
      {
        id: 52,
        name: "Tareas",
        path: "/dashboard/gestion-trabajo/tareas",
        icon: NotebookPen,
        roles: RoleGroups.TODOS_CRM,
        type: ["CRM"] as ModuleType[],
      },
      {
        id: 53,
        name: "Clientes",
        path: "/dashboard/gestion-trabajo/clientes",
        icon: Handshake,
        roles: RoleGroups.TODOS_CRM,
        type: ["CRM"] as ModuleType[],
      },
      {
        id: 54,
        name: "Leads",
        path: "/dashboard/gestion-trabajo/leads",
        icon: FishingHook,
        // REFERENCIADOR también puede ver leads (los suyos)
        roles: RoleGroups.CON_REFERENCIADOR,
        type: ["CRM"] as ModuleType[],
      },
      {
        id: 55,
        name: "Polizas",
        path: "/dashboard/gestion-trabajo/polizas",
        icon: FolderCog,
        // VENDEDOR no gestiona pólizas
        roles: RoleGroups.SIN_VENDEDOR,
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
        roles: RoleGroups.SIN_VENDEDOR,
        type: ["ERP"] as ModuleType[],
      },
      {
        id: 62,
        name: "Comisiones",
        path: "/dashboard/control-seguimiento/comisiones",
        icon: HandCoins,
        roles: RoleGroups.SIN_VENDEDOR,
        type: ["ERP"] as ModuleType[],
      },
      {
        id: 63,
        name: "Cobranzas",
        path: "/dashboard/control-seguimiento/cobranzas",
        icon: WalletCards,
        roles: RoleGroups.SIN_VENDEDOR,
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
        roles: RoleGroups.TODOS_CRM,
        type: ["CRM", "ERP"] as ModuleType[],
        isAuroraModule: true,
      },
      {
        id: 74,
        name: "Radar Comercial",
        path: "/dashboard/agentes-ia/insights",
        icon: Zap,
        roles: RoleGroups.TODOS_CRM,
        type: ["CRM", "ERP"] as ModuleType[],
      },
      // {
      //   id: 71,
      //   name: "Agente de Facturas",
      //   path: "/dashboard/agentes-ia/agente-facturas",
      //   icon: Bot,
      //   roles: RoleGroups.TODOS_CRM,
      //   type: ["CRM"] as ModuleType[],
      // },
      // {
      //   id: 72,
      //   name: "Agente de DNI",
      //   path: "/dashboard/agentes-ia/agente-dni",
      //   icon: Bot,
      //   roles: RoleGroups.TODOS_CRM,
      //   type: ["CRM"] as ModuleType[],
      // },
      // {
      //   id: 73,
      //   name: "Agente de Pólizas",
      //   path: "/dashboard/agentes-ia/agente-polizas",
      //   icon: Bot,
      //   roles: RoleGroups.TODOS_CRM,
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
        roles: RoleGroups.SOLO_ADMIN,
        type: ["CRM", "ERP"] as ModuleType[],
      },
      {
        id: 2,
        name: "Ramos",
        path: "/dashboard/admin/maestros/ramos",
        icon: ShieldCheck,
        roles: RoleGroups.SOLO_ADMIN,
        type: ["CRM", "ERP"] as ModuleType[],
      },
      {
        id: 4,
        name: "Usuarios",
        path: "/dashboard/admin/maestros/usuarios",
        icon: User,
        // ADMIN_GENERAL y BROKER_JURIDICO pueden gestionar usuarios de su equipo
        roles: [Roles.ADMIN_GENERAL, Roles.BROKER_JURIDICO],
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
        name: "Mi Equipo",
        path: "/dashboard/broker/agentes",
        icon: User,
        // BROKER_JURIDICO gestiona su equipo (BROKER_NATURAL, VENDEDOR, REFERENCIADOR)
        roles: RoleGroups.SOLO_BROKER_JURIDICO,
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
        roles: RoleGroups.BROKERS_E_INFO,
        type: ["CRM", "ERP"] as ModuleType[],
      },
    ],
  },
];
