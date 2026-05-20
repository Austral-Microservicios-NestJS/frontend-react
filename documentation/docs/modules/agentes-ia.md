---
title: Agentes IA y comunicaciones
sidebar_position: 6
---

# Módulo · Agentes IA y comunicaciones

Capa de inteligencia artificial y mensajería automática del CRM.

## Rutas

| Ruta | Roles | Página |
|---|---|---|
| `/dashboard/agentes-ia/austral-ai` | TODOS | Chatbot conversacional |
| `/dashboard/agentes-ia/documentos` | TODOS | OCR de DNI / Factura / Póliza |
| `/dashboard/agentes-ia/insights` | TODOS | Dashboard analítico |

## Austral AI (chatbot)

Frontend: `pages/shared/agentes-ia/austral-ai/AustralAIPage.tsx`.

- Conversación persistente vía `store/chat.store.ts`.
- Backend: `chatbot-ms` (NestJS + LangChain + GPT-4o-mini).
- Tools del chatbot:
  - `generar_ficha_sctr_excel` — descarga Excel de trabajadores SCTR.
  - 5 tools Infraxion/Orbelite para consultas vehiculares (placa, SOAT, revisión,
    papeletas, siniestros).
  - Generación de cotizaciones por aseguradora (pendiente datos de Johan).

## ManyChat (WhatsApp)

ManyChat es el canal de WhatsApp del CRM. **Limitación de WhatsApp Business**:
solo se puede enviar mensajes a contactos que iniciaron conversación con el
bot (son "subscribers").

### Webhook entrante

`POST /leads/manychat` recibe leads desde ManyChat. Guarda
`lead.manychatSubscriberId` para poder enviarle recordatorios después.

### Recordatorios automáticos (cron 4h)

Backend (`leads-ms/src/leads/recordatorios/`) ejecuta cada 4 horas:

1. **Detecta leads estancados** (reglas en `recordatorios.service.ts`):
   - NUEVO ≥ 2 días
   - CONTACTADO ≥ 5 días
   - COTIZADO ≥ 7 días
2. **Cooldown** 24h entre recordatorios al mismo lead.
3. **Notifica** al cliente y al agente:
   - In-app (campanita) — **siempre**.
   - Email — Resend si `RESEND_API_KEY` configurada.
   - WhatsApp — ManyChat si `MANYCHAT_API_TOKEN` configurada **y** el contacto
     es subscriber.

### Resolución de subscriber por teléfono

`NotificadorService.buscarSubscriberPorTelefono(tel)` consulta
`GET https://api.manychat.com/fb/subscriber/findBySystemField?phone=+51...`
para encontrar el `subscriber_id` del agente (si chateó alguna vez con el
bot). Si no es subscriber, el envío de WhatsApp se **omite silenciosamente**
— no registra fila de fallo. Email + in-app siguen entregándose.

### Tabla `lead_recordatorio` (auditoría SBS)

Cada intento de notificación se persiste en `lead_recordatorio`. La tabla es
**inmutable** (triggers `trg_lead_recordatorio_no_update` y `_no_delete`
configurados en BD para cumplir Resolución SBS N° 01029-2026).

Si necesitas modificar/borrar filas (ej. limpieza de leads de prueba), debes
deshabilitar el trigger dentro de una transacción y reactivarlo:

```sql
BEGIN;
ALTER TABLE lead_recordatorio DISABLE TRIGGER trg_lead_recordatorio_no_delete;
DELETE FROM lead_recordatorio WHERE id_lead IN (...);
ALTER TABLE lead_recordatorio ENABLE TRIGGER trg_lead_recordatorio_no_delete;
COMMIT;
```

## OCR de documentos

3 agentes:

- **AgenteDniPage** — sube foto de DNI, OCR estructurado.
- **AgenteFacturaPage** — extrae datos de facturas.
- **AgentePolizaPage** — parsea pólizas en PDF.

Todos viven en `pages/shared/agentes-ia/documentos/` y usan endpoints del
backend que delegan al servicio de OCR correspondiente.
