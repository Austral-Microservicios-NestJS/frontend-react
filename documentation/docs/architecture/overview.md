---
title: Visión general
sidebar_position: 1
---

# Arquitectura · Visión general

## Stack

| Capa | Tecnología |
|---|---|
| Framework | **React 19** con Vite |
| Lenguaje | TypeScript (`strict`) |
| Routing | `react-router-dom` v7 |
| UI | **shadcn/ui** sobre Radix + Tailwind CSS v4 |
| Estado servidor | **TanStack Query** v5 |
| Estado cliente | **Zustand** (auth + chat) |
| Formularios | **react-hook-form** |
| Validaciones | `class-validator`-compatible + helpers propios en `utils/validators.ts` |
| HTTP | Axios (config centralizado en `config/api-client.ts`) |
| Tablas | `@tanstack/react-table` |
| Notificaciones | **Sonner** (toasts) |
| Mapas | Google Maps API |

## Diagrama lógico

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser (Railway)                     │
│                                                             │
│  ┌──────────┐     ┌──────────────┐     ┌────────────────┐   │
│  │ Páginas  │ ─→  │ Componentes  │ ─→  │ shadcn/ui + UI │   │
│  └────┬─────┘     └──────┬───────┘     └────────────────┘   │
│       │                  │                                  │
│       ▼                  ▼                                  │
│  ┌──────────┐     ┌──────────────┐                          │
│  │  Hooks   │ ─→  │   Services   │                          │
│  │ (domain) │     │ (axios + RQ) │                          │
│  └──────────┘     └──────┬───────┘                          │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS + JWT (Authorization Bearer)
                           ▼
                ┌──────────────────────┐
                │ api.hannahlab.com    │
                │ (client-gateway GCP) │
                └──────────┬───────────┘
                           │ NATS
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   auth-ms            leads-ms           clients-ms
   chatbot-ms       insurance-base-ms   workitems-ms
```

## Decisiones clave

### 1. Estado del servidor vive en React Query

No usamos Redux ni context para data remota. Cada dominio expone hooks
`useGetAll`, `useGetById`, `useCreate`, `useUpdate`, `useDelete` que retornan
las primitivas de React Query. La invalidación (`queryClient.invalidateQueries`)
es responsabilidad del servicio, no de la página.

```ts
// services/cliente.service.ts
useDelete: () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clienteService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
```

### 2. Estado del cliente solo donde aporta valor

Zustand se usa en dos lugares concretos:
- `store/auth.store.ts` — usuario logueado + token + login/logout.
- `store/chat.store.ts` — historial de conversación con el chatbot IA.

El resto (modales abiertos, ediciones en curso) vive como `useState` local.

### 3. JWT en cada request

`config/api-client.ts` adjunta el token desde `auth.store` a cada request.
El **gateway** (NestJS) decodifica el JWT y propaga `{ userId, rol, nombreUsuario }`
a los microservicios vía NATS. Los microservicios filtran data por ownership
(ver memoria del backend para el patrón).

### 4. Rutas protegidas por rol

`routes/routes.tsx` envuelve cada ruta con `<ProtectedRoute requiredRoles={...}>`,
usando grupos definidos en `utils/roles.ts` (`TODOS_CRM`, `NIVEL_ALTO`,
`SOLO_ADMIN`, `ADMIN_Y_BROKER`, `PUEDE_POLIZAS`, etc.). Si el rol del usuario
no pertenece al grupo, se redirige a `Home`.

### 5. Convención de formularios

`react-hook-form` + `Controller` para selects. La validación se centraliza en
`utils/validators.ts` (DNI 8 dígitos, RUC 11 dígitos con prefijo 10/20,
teléfono Perú 9 dígitos empezando con 9, email pattern). Los errores se
muestran como `<span className="text-xs text-red-500">{message}</span>`
debajo del input.

### 6. shadcn/ui no se "instala", se copia

Los componentes en `components/ui/` son piezas vendoreadas — los modificamos
si lo necesitamos. Conservamos exports aunque no se usen hoy (`SelectGroup`,
`CardAction`, `buttonVariants`...) porque son la API de la librería.

## Lecturas siguientes

- [Estructura de carpetas](/architecture/folder-structure)
- [Routing y permisos](/architecture/routing)
- [Estado y datos](/architecture/data-flow)
