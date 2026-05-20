---
title: Estructura de carpetas
sidebar_position: 2
---

# Estructura de carpetas

```
frontend-react/
├─ public/                  Assets estáticos servidos en raíz
├─ documentation/           ← Este sitio (Docusaurus)
├─ src/
│  ├─ App.tsx               Raíz: provee QueryClient + Router + Toaster
│  ├─ main.tsx              Entry de Vite
│  ├─ index.css             Tokens Austral + Tailwind base
│  ├─ vite-env.d.ts
│  │
│  ├─ components/
│  │  ├─ shared/            Genéricos del CRM
│  │  │   ├─ Table.tsx          Tabla genérica con paginación/búsqueda
│  │  │   ├─ Modal*.tsx         Contenedor + Header + Body + Footer
│  │  │   ├─ ModalConfirmacion  Aviso custom (reemplazo a window.confirm)
│  │  │   ├─ BotonEditar / BotonEliminar / BotonRegistro
│  │  │   ├─ Header / Sidebar / Navbar
│  │  │   ├─ FormGroup* / PhoneInput / LocationInput
│  │  │   └─ AppCalendar / AppDatePicker / AppSelect
│  │  ├─ ui/                Primitives shadcn/ui (Input, Select, Popover...)
│  │  └─ modulos/           Componentes de dominio (un subdirectorio por módulo)
│  │      ├─ usuarios/      modales/ + tablas/
│  │      ├─ clientes/      modales/ + tablas/
│  │      ├─ leads/         (cards, kanban, modales, detalle)
│  │      ├─ polizas/       modales/ + tablas/
│  │      ├─ productos/     modales/ + tablas/
│  │      ├─ ramos/         (un módulo simple)
│  │      ├─ companias/
│  │      ├─ tareas/        grid/ + modales/
│  │      ├─ siniestros/
│  │      ├─ observacion/
│  │      ├─ agentes-ia/
│  │      └─ home/          Widgets del dashboard (TasksWidget, RedBroker, ...)
│  │
│  ├─ pages/
│  │  ├─ admin/maestros/    Páginas exclusivas de ADMINISTRADOR
│  │  │   ├─ usuarios/
│  │  │   ├─ companias/
│  │  │   ├─ ramos/
│  │  │   └─ productos/  ← (eliminada en limpieza, ver routes)
│  │  ├─ broker/agentes/    Gestión de equipo (BROKER)
│  │  ├─ shared/            Páginas accesibles a varios roles
│  │  │   ├─ home/          Dashboard por rol (despacha al Dashboard correcto)
│  │  │   ├─ gestion-trabajo/
│  │  │   │   ├─ clientes/        ClientesPage + subrutas
│  │  │   │   ├─ leads/           LeadsPage + LeadDetail
│  │  │   │   ├─ polizas/         PolizasPage
│  │  │   │   ├─ tareas/          TareasPage (unificada)
│  │  │   │   └─ observaciones/
│  │  │   ├─ control-seguimiento/ Siniestros, comisiones
│  │  │   ├─ agentes-ia/          Austral AI + documentos OCR
│  │  │   └─ perfil/              Auto-edición del usuario logueado
│  │  └─ auth/              Login + recuperación
│  │
│  ├─ routes/
│  │  ├─ routes.tsx         Definición de rutas con ProtectedRoute
│  │  ├─ modulos.tsx        Sidebar (qué se muestra a qué rol)
│  │  └─ ProtectedRoute.tsx Guard de rol
│  │
│  ├─ hooks/                Hooks de dominio (useUsuarios, useLeads...)
│  │
│  ├─ services/             Capa HTTP + React Query por dominio
│  │   ├─ usuario.service.ts
│  │   ├─ cliente.service.ts
│  │   ├─ lead.service.ts
│  │   ├─ poliza.service.ts
│  │   ├─ tarea.service.ts
│  │   ├─ chatbot.service.ts
│  │   └─ ... (uno por entidad)
│  │
│  ├─ modules/              Módulos avanzados con su propio shape
│  │   └─ siniestro/        keys + queries + service + types
│  │
│  ├─ store/                Zustand
│  │   ├─ auth.store.ts     Usuario + token + login/logout
│  │   └─ chat.store.ts     Historial conversación chatbot
│  │
│  ├─ types/                Contratos TypeScript (un archivo por entidad)
│  │
│  ├─ utils/
│  │   ├─ roles.ts          Enum Roles + grupos
│  │   ├─ validators.ts     DNI/RUC/CE/teléfono/email/nombre
│  │   ├─ ubigeos.json      Departamentos/provincias/distritos Perú
│  │   └─ export-excel.ts   Helpers de descarga XLSX
│  │
│  └─ config/
│      └─ api-client.ts     Instancia Axios con interceptor JWT
│
├─ documentation/           Este sitio (Docusaurus)
├─ package.json
├─ tsconfig*.json
└─ vite.config.ts
```

## Reglas no escritas

- Un módulo de dominio = una carpeta en `components/modulos/<dominio>/` con
  subcarpetas `modales/` y `tablas/` (o `grid/` según corresponda).
- Una entidad = un archivo en `services/`, un hook en `hooks/`, un tipo en
  `types/`.
- Las páginas son **delgadas**: orquestan estado local + llamadas a hooks +
  renderizan componentes del módulo. No tienen HTTP ni lógica pesada.
- Los componentes en `components/ui/` son shadcn/ui — modificables pero
  generalmente intactos para mantener el patrón de la librería.
