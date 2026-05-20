---
title: Leads
sidebar_position: 3
---

# Módulo · Leads

Leads son prospectos comerciales. El objetivo es **llevar todos los leads a
EMITIDO** (póliza vigente).

## Rutas

| Ruta | Roles | Página |
|---|---|---|
| `/dashboard/gestion-trabajo/leads` | CON_REFERENCIADOR | `LeadsPage` |
| `/dashboard/gestion-trabajo/leads/:id` | CON_REFERENCIADOR | `LeadDetail` |

## Archivos clave

- `services/lead.service.ts`
- `hooks/useLeads.ts`
- `components/modulos/leads/`
  - Cards / lista de leads.
  - Modales de registro y detalle.

## Estados del lead

```
NUEVO → CONTACTADO → COTIZADO → EMITIDO → CERRADO
                            ↘ PERDIDO
```

Hay transiciones automáticas (sesión 7-8):

- Al **registrar un cliente** desde un lead → estado `COTIZADO`.
- Al **registrar una póliza** asociada → estado `EMITIDO`.
- Cron a las 48h sin actividad → posible `PERDIDO`.

## Filtrado por rol

El backend (`leads-ms`) filtra `WHERE asignado_a = userId` para roles no
privilegiados (PROMOTOR_VENTA, REFERENCIADOR, PUNTO_VENTA). El frontend ya
**no** filtra client-side — confía en el server.

Roles privilegiados (ADMIN, EJECUTIVO_CUENTA, BROKER) ven todos los leads
dentro de su scope.

## Tipos de seguro

20 tipos definidos en `types/lead.interface.ts`:

VEHICULAR · SOAT · SCTR · VIDA · VIDA_LEY · SALUD · EPS · ACCIDENTES ·
HOGAR · TREC · MULTIRRIESGO · FOLA · TREA · ACCIDENTE · OTRO (+ legacy)

`RegistrarLead` muestra un icono por tipo (`iconMap`). Si el cliente elige
"Otro", se captura el texto en un campo aparte y se concatena en `notas` como
`[Tipo: xxx]`. `LeadsPage.getDisplayTipoSeguro()` extrae ese texto para
mostrar en badges y mensajes de WhatsApp.

## Fuentes (Origen)

`CRM` (default) · `WHATSAPP` · `MANYCHAT` · `WEB` · `REFERIDO` ·
`PROSPECTO_FRIO`.

Al venir por ManyChat se guarda `manychat_subscriber_id` que permite
enviar recordatorios automáticos por WhatsApp.

## Recordatorios automáticos

Cuando un lead se **estanca** (NUEVO >2 días, CONTACTADO >5, COTIZADO >7), el
backend dispara recordatorios por **email** (Resend) y **WhatsApp** (ManyChat).

Detalles en [Agentes IA y Comunicaciones](/modules/agentes-ia).

## Detalle del lead

`LeadDetail` muestra y permite editar:

- Datos del prospecto.
- Asignación a agente (cualquier admin puede reasignar).
- Trabajadores SCTR (tabla editable en JSONB).
- Carta de Nombramiento (preview/download).
- Historial de cambios de estado.
- Botón "Descargar Excel" para fichas SCTR.

## Estancados

`LeadsSummaryWidget` muestra un badge naranja con el conteo de leads
estancados (NUEVO/CONTACTADO >7 días, mostrando la fecha más antigua).
