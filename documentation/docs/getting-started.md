---
slug: /getting-started
title: Empezar
sidebar_position: 2
---

# Empezar

## Requisitos

- **Node.js** 20 LTS o superior (probado en 24).
- **pnpm** 10+ (`npm i -g pnpm`).
- Acceso al backend en `https://api.hannahlab.com` (o tu instancia local).

## Instalación

```bash
git clone <repo-frontend>
cd frontend-react
pnpm install
```

## Variables de entorno

Crear `.env` en la raíz de `frontend-react/`:

```ini
VITE_API_URL=https://api.hannahlab.com
VITE_GOOGLE_MAPS_API_KEY=<tu-key>
```

Para desarrollo contra un backend local:

```ini
VITE_API_URL=http://localhost:3000
```

## Scripts disponibles

| Comando | Acción |
|---|---|
| `pnpm dev` | Servidor de desarrollo (`http://localhost:5173`) |
| `pnpm build` | `tsc -b && vite build` — build de producción a `dist/` |
| `pnpm preview` | Sirve el build localmente |
| `pnpm lint` | ESLint sobre todo el proyecto |

## Primera vez

1. Verifica que `tsc -b` pase sin errores.
2. Levanta `pnpm dev`.
3. Inicia sesión con un usuario de pruebas.
4. Navega por el sidebar — cada módulo tiene su capítulo en esta documentación.

## Documentación local

Para correr este sitio de Docusaurus en tu máquina:

```bash
cd documentation
pnpm install
pnpm start
```

Abre `http://localhost:3000`.

## Estructura de carpetas (atajo)

```
src/
├─ App.tsx              # raíz de la app
├─ main.tsx             # entry de Vite
├─ index.css            # tokens Austral + Tailwind
├─ components/
│  ├─ shared/           # botones, modales y tablas genéricos
│  ├─ ui/               # primitives shadcn/ui
│  └─ modulos/          # componentes por dominio (usuarios, clientes, ...)
├─ pages/               # páginas por rol (admin/, broker/, shared/)
├─ routes/              # routes.tsx + modulos.tsx (sidebar)
├─ hooks/               # hooks de dominio (useUsuarios, useLeads, ...)
├─ services/            # capa HTTP por dominio (axios + react-query)
├─ modules/             # módulos avanzados (siniestro, gestion-comercial)
├─ store/               # Zustand (auth.store, chat.store)
├─ types/               # contratos TypeScript
└─ utils/               # roles, validators, ubigeos, export-excel
```

Ver [Estructura](/architecture/folder-structure) para el detalle.
