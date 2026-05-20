---
title: Tareas
sidebar_position: 5
---

# Módulo · Tareas

"Gestión de Trabajo" unificado. **Antes** había tres tabs (Tareas / Actividades
/ Gestión Comercial). **Hoy** es solo Tareas — se consolidaron porque eran
conceptualmente lo mismo.

## Ruta

| Ruta | Roles | Página |
|---|---|---|
| `/dashboard/gestion-trabajo/tareas` | TODOS_CRM | `TareasPage` |

Rutas viejas con `<Navigate replace>` automático:

- `/gestion-trabajo/actividades` → `/gestion-trabajo/tareas`
- `/gestion-trabajo/gestion-comercial` → `/gestion-trabajo/tareas`

## Archivos clave

- `services/tarea.service.ts`
- `hooks/useTareas.ts`
- `components/modulos/tareas/`
  - `grid/TareasGrid.tsx` — listado con paginación.
  - `modales/RegistrarTarea.tsx` / `modales/EditarTarea.tsx`.

## Dashboard

`TasksWidget` aparece en los 5 dashboards por rol (Admin/Ejecutivo,
BrokerJurídico, BrokerNatural, Vendedor, PuntoVenta). Muestra:

- Conteo real de tareas pendientes.
- Antigüedad de la tarea más vieja ("más antigua: Xd de atraso").
- Click → navega a `/gestion-trabajo/tareas`.

## Manejo de fechas

⚠️ Cuidado con UTC: las fechas se guardan en BD como `YYYY-MM-DD` (sin hora).
Para evitar desfases UTC ↔ Perú, en `TareasGrid`, `EditarTarea` y `TasksWidget`
se usa:

```ts
.substring(0, 10) + "T12:00:00"   // al construir Date para mostrar
.substring(0, 10)                 // al persistir
```

Esto garantiza que una tarea con fecha "2026-05-19" siempre aparezca el 19, no
el 18 (desfase típico cuando el navegador interpreta UTC y la zona es UTC-5).
