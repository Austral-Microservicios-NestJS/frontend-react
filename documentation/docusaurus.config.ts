import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Austral CRM · Frontend",
  tagline: "Documentación técnica del CRM de Austral Corredores de Seguros",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://docs.hannahlab.com",
  baseUrl: "/",

  organizationName: "hannahlab",
  projectName: "austral-crm-frontend",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "es",
    locales: ["es"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/austral-social.jpg",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Austral CRM",
      logo: {
        alt: "Austral",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Documentación",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentación",
          items: [
            { label: "Inicio", to: "/" },
            { label: "Arquitectura", to: "/architecture/overview" },
            { label: "Módulos", to: "/modules/usuarios" },
          ],
        },
        {
          title: "Producción",
          items: [
            { label: "App (Railway)", href: "https://app.hannahlab.com" },
            { label: "API (GCP)", href: "https://api.hannahlab.com" },
          ],
        },
        {
          title: "Soporte",
          items: [
            { label: "Conventions", to: "/conventions/code-style" },
            { label: "Troubleshooting", to: "/troubleshooting" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Austral Corredores de Seguros · Construido con Hannah Lab`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "tsx", "typescript"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
