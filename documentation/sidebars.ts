import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    "intro",
    "getting-started",
    {
      type: "category",
      label: "Arquitectura",
      link: { type: "doc", id: "architecture/overview" },
      items: [
        "architecture/overview",
        "architecture/folder-structure",
        "architecture/routing",
        "architecture/data-flow",
      ],
    },
    {
      type: "category",
      label: "Módulos",
      link: { type: "doc", id: "modules/usuarios" },
      items: [
        "modules/usuarios",
        "modules/clientes",
        "modules/leads",
        "modules/polizas",
        "modules/tareas",
        "modules/agentes-ia",
      ],
    },
    {
      type: "category",
      label: "Convenciones",
      link: { type: "doc", id: "conventions/code-style" },
      items: [
        "conventions/code-style",
        "conventions/validators",
        "conventions/roles-and-permissions",
      ],
    },
    "deployment",
    "troubleshooting",
  ],
};

export default sidebars;
