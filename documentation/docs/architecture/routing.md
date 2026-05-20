---
title: Routing y permisos
sidebar_position: 3
---

# Routing y permisos

## Estructura

Toda la configuración de rutas vive en `src/routes/routes.tsx`. Se usa
`createBrowserRouter` de `react-router-dom` v7. La raíz `/dashboard` envuelve
un layout con sidebar, header y notificaciones.

## Roles válidos

Los **6 roles** del sistema están en `src/utils/roles.ts`:

| Rol | Descripción |
|---|---|
| `ADMINISTRADOR` | Acceso total al CRM y maestros |
| `EJECUTIVO_CUENTA` | CRM completo + pólizas + cotizaciones |
| `BROKER` | CRM + gestión de su equipo (PROMOTOR_VENTA, REFERENCIADOR, PUNTO_VENTA) |
| `PROMOTOR_VENTA` | Leads y clientes propios + tareas |
| `REFERENCIADOR` | Solo leads propios (referidos) + Home |
| `PUNTO_VENTA` | Pólizas y clientes del punto asignado |

## Grupos (RoleGroups)

Para no repetir arrays de roles en cada ruta, hay grupos predefinidos:

```ts
// utils/roles.ts
TODOS_CRM       = [ADMINISTRADOR, EJECUTIVO_CUENTA, BROKER,
                   PROMOTOR_VENTA, PUNTO_VENTA]
CON_REFERENCIADOR = TODOS_CRM + REFERENCIADOR
NIVEL_ALTO      = [ADMINISTRADOR, EJECUTIVO_CUENTA, BROKER]
SOLO_ADMIN      = [ADMINISTRADOR]
ADMIN_Y_BROKER  = [ADMINISTRADOR, BROKER]
PUEDE_POLIZAS   = [ADMINISTRADOR, EJECUTIVO_CUENTA, BROKER, PUNTO_VENTA]
SIN_VENDEDOR    = [ADMINISTRADOR, EJECUTIVO_CUENTA, BROKER, PUNTO_VENTA]
BROKERS_E_INFO  = [BROKER, EJECUTIVO_CUENTA]
```

## ProtectedRoute

Cada ruta sensible se envuelve con `<ProtectedRoute requiredRoles={...}>`:

```tsx
{
  path: "gestion-trabajo/leads",
  element: (
    <ProtectedRoute requiredRoles={RoleGroups.CON_REFERENCIADOR}>
      <LeadsPage />
    </ProtectedRoute>
  ),
}
```

El componente lee `auth.store` y, si el rol no coincide, redirige a `Home`.

## Sidebar

`src/routes/modulos.tsx` define qué módulos aparecen en el sidebar según el
rol. Editar este archivo es la forma correcta de añadir / quitar links del
menú lateral. Las rutas en `routes.tsx` y el sidebar en `modulos.tsx` deben
mantenerse consistentes.

## Redirecciones útiles

- `/dashboard/gestion-trabajo/actividades` → `/dashboard/gestion-trabajo/tareas`
- `/dashboard/gestion-trabajo/gestion-comercial` → `/dashboard/gestion-trabajo/tareas`

Estos redirects existen porque los módulos Actividades y Gestión Comercial
fueron unificados en Tareas; cualquier link viejo cae automáticamente.

## JWT y compatibilidad de roles legacy

`auth.store.ts` y `ProtectedRoute` normalizan tokens viejos:

```
ADMIN_GENERAL    → ADMINISTRADOR
BROKER_JURIDICO  → BROKER
BROKER_NATURAL   → BROKER
VENDEDOR         → PROMOTOR_VENTA
```

Esto evita que usuarios con sesiones antiguas se vean fuera del CRM al
desplegar cambios de rol.
