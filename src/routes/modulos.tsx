import { BookUser, Bot, FishingHook, FolderCog, Handshake, NotebookPen, User } from "lucide-react";
import { Roles } from "@/utils/roles";

// Categorías de módulos
export const moduleCategories = [
  {
    id: "gestion-trabajo",
    title: "Gestión de Trabajo",
    modules: [
      // Módulos de gestión de trabajo pueden ser añadidos aquí
      {
        id: 51,
        name: "Actividades",
        path: "/dashboard/gestion-trabajo/actividades",
        icon: BookUser,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      },
      {
        id: 52,
        name: "Tareas",
        path: "/dashboard/gestion-trabajo/tareas",
        icon: NotebookPen,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      },
      {
        id: 53,
        name: "Clientes",
        path: "/dashboard/gestion-trabajo/clientes",
        icon: Handshake,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      },
      {
        id: 54,
        name: "Leads",
        path: "/dashboard/gestion-trabajo/leads",
        icon: FishingHook,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      },
      {
        id: 55,
        name: "Polizas",
        path: "/dashboard/gestion-trabajo/polizas",
        icon: FolderCog,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      }
    ],
  },
  {
    id: "agentes-ia",
    title: "Agentes IA",
    modules: [
      // Módulos de agentes IA pueden ser añadidos aquí
      {
        id: 61,
        name: "Agente de Facturas",
        path: "/dashboard/agentes-ia/agente-facturas",
        icon: Bot,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      },
      {
        id: 62,
        name: "Agente de DNI",
        path: "/dashboard/agentes-ia/agente-dni",
        icon: Bot,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      },
      {
        id: 63,
        name: "Agente de Pólizas",
        path: "/dashboard/agentes-ia/agente-polizas",
        icon: Bot,
        roles: [Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE],
      },
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
        icon: User,
        roles: [Roles.ADMINISTRADOR],
      },
      {
        id: 2,
        name: "Ramos",
        path: "/dashboard/admin/maestros/ramos",
        icon: User,
        roles: [Roles.ADMINISTRADOR],
      },
      {
        id: 3,
        name: "Productos",
        path: "/dashboard/admin/maestros/productos",
        icon: User,
        roles: [Roles.ADMINISTRADOR],
      },
      {
        id: 4,
        name: "Usuarios",
        path: "/dashboard/admin/maestros/usuarios",
        icon: User,
        roles: [Roles.ADMINISTRADOR],
      },
    ],
  },
  {
    id: "modulos",
    title: "Módulos",
    modules: [
      // Modulos Compartidos

      // Modulos de broker
      {
        id: 201,
        name: "Mis Agentes",
        path: "/dashboard/broker/agentes",
        icon: User,
        roles: [Roles.BROKER],
      },
    ],
  },
];
