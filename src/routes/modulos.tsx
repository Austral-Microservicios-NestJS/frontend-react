import { User } from "lucide-react";
import { Roles } from "@/utils/roles";

// Categorías de módulos
export const moduleCategories = [
  {
    id: "maestros",
    title: "Maestros",
    modules: [
      {
        id: 1,
        name: "Compañias de Seguros",
        path: "/dashboard/maestros/companias-seguros",
        icon: User,
        roles: [Roles.ADMINISTRADOR],
      },
      {
        id: 2,
        name: "Ramos",
        path: "/dashboard/maestros/ramos",
        icon: User,
        roles: [Roles.ADMINISTRADOR],
      },
    ],
  },
];
