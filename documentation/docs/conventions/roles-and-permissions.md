---
title: Roles y permisos
sidebar_position: 3
---

# Roles y permisos

Los **6 roles** del sistema y sus grupos. Detalle de matriz de acceso por
módulo.

## Roles

| Rol | Quién | Qué hace |
|---|---|---|
| `ADMINISTRADOR` | Soporte / dueño | Todo |
| `EJECUTIVO_CUENTA` | Personal interno Austral | CRM completo, pólizas, cotizaciones |
| `BROKER` | Broker contratado | CRM + administra su red (PROMOTOR_VENTA / REFERENCIADOR / PUNTO_VENTA) |
| `PROMOTOR_VENTA` | Vendedor del broker | Solo sus leads, clientes y tareas |
| `REFERENCIADOR` | Referidor externo | Solo sus leads + Home |
| `PUNTO_VENTA` | Local físico (caja) | Pólizas y clientes del punto |

## Grupos (`utils/roles.ts`)

```ts
RoleGroups.TODOS_CRM         // ADMIN, EJEC, BROKER, PROMOTOR, PUNTO_VENTA
RoleGroups.CON_REFERENCIADOR // TODOS_CRM + REFERENCIADOR
RoleGroups.NIVEL_ALTO        // ADMIN, EJEC, BROKER
RoleGroups.SOLO_ADMIN        // ADMIN
RoleGroups.ADMIN_Y_BROKER    // ADMIN, BROKER
RoleGroups.PUEDE_POLIZAS     // ADMIN, EJEC, BROKER, PUNTO_VENTA
RoleGroups.SIN_VENDEDOR      // ADMIN, EJEC, BROKER, PUNTO_VENTA
RoleGroups.BROKERS_E_INFO    // BROKER, EJEC
```

## Matriz simplificada

| Recurso | ADMIN | EJEC | BROKER | PROMOTOR | REFER | PUNTO_VENTA |
|---|---|---|---|---|---|---|
| Home/Dashboard | ✅ | ✅ | ✅ (Mi Red) | ✅ | ✅ | ✅ |
| Leads | ✅ todos | ✅ todos | ✅ su red | ✅ propios | ✅ propios | — |
| Clientes | ✅ todos | ✅ todos | ✅ su red | ✅ propios | — | ✅ del punto |
| Pólizas | ✅ | ✅ | ✅ | — | — | ✅ |
| Tareas | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Usuarios (maestro) | ✅ | — | ✅ (su red) | — | — | — |
| Compañías / Ramos | ✅ | — | — | — | — | — |
| Crear cliente | ✅ | ✅ | ✅ | ✅ | — | ✅ |
| Borrar cliente | ✅ | — | — | — | — | — |
| Borrar usuario | ✅ | — | — | — | — | — |

> **Nota**: filtrado de data por ownership ocurre en el **backend** (microservicios
> filtran por `userId` derivado del JWT). El frontend ya no necesita filtrar
> client-side excepto para mostrar/ocultar componentes UI por rol.

## ProtectedRoute en práctica

```tsx
<Route
  path="leads"
  element={
    <ProtectedRoute requiredRoles={RoleGroups.CON_REFERENCIADOR}>
      <LeadsPage />
    </ProtectedRoute>
  }
/>
```

Si el rol del usuario logueado no está en `requiredRoles`, se redirige al Home
correspondiente.

## Tokens JWT legacy

`auth.store.ts` normaliza tokens viejos para no romper sesiones:

```
ADMIN_GENERAL    → ADMINISTRADOR
BROKER_JURIDICO  → BROKER
BROKER_NATURAL   → BROKER
VENDEDOR         → PROMOTOR_VENTA
```
