---
title: Clientes
sidebar_position: 2
---

# Módulo · Clientes

Cartera de clientes (personas naturales y jurídicas) de la corredora.

## Rutas

| Ruta | Roles | Página |
|---|---|---|
| `/dashboard/gestion-trabajo/clientes` | TODOS_CRM | `ClientesPage` |
| `/clientes/:id/polizas` | SIN_VENDEDOR | Pólizas del cliente |
| `/clientes/:id/inversiones` | SIN_VENDEDOR | Inversiones del cliente |
| `/clientes/:id/polizas/:polizaId/siniestros` | SIN_VENDEDOR | Siniestros |

## Archivos clave

- `services/cliente.service.ts`
- `hooks/useCliente.ts`
- `components/modulos/clientes/`
  - `modales/RegistrarCliente.tsx` — alta con cruce DNI/RUC (RENIEC/SUNAT) y
    auto-llenado.
  - `modales/EditarCliente.tsx`
  - `modales/ContextoIAModal.tsx` — contexto narrativo para el chatbot IA.
  - `tablas/TablaClientes.tsx` — Popover de acciones + tachito de borrar.

## Filtrado por rol

`ClientesPage` ajusta la query según quién consulta:

```ts
const isAdmin = rol === Roles.ADMINISTRADOR;
const isNivelAlto = rol === EJECUTIVO_CUENTA || rol === BROKER;

// ADMIN: paginación server-side de todos
useGetAll({ page, limit });

// Otros: getByUsuario; nivel alto manda rol como query param
useGetByUsuario(userId, isNivelAlto ? rol : undefined);
```

Cualquier usuario no privilegiado recibe **solo sus clientes** (filtrado en
backend por `asignado_a = userId`). El frontend ya no necesita filtrar.

## Borrar cliente (solo ADMINISTRADOR)

- Visible: tachito rojo `<BotonEliminar>` en la columna Acciones, solo si
  `onDelete` está provisto (la página lo pasa solo para `isAdmin`).
- Confirmación: `<ModalConfirmacion>` custom.
- Backend: `clients-ms.remove()` ahora es **borrado físico transaccional**:
  borra `cliente_documento`, `cliente_contacto`, `cliente_contexto`,
  `cliente_inversion` y `cliente` en una transacción.
- Referencias cross-DB (`polizas.idCliente`, `lead.id_cliente` en otras bases)
  quedan huérfanas porque no hay FK entre microservicios — comportamiento
  aceptado.

## Cruce de documento

Al registrar un cliente con DNI, `RegistrarCliente` llama al gateway
(`GET /clientes/documento/:numero`) para verificar si ya existe ese documento
en el CRM. Si encuentra, muestra alerta ámbar y autocompleta los campos.

Para RUC, el cruce va contra **SUNAT** (`api.apis.net.pe/v1/ruc`) vía el
backend. Para DNI, contra **RENIEC**.

## Carta de Nombramiento

`RegistrarCliente` permite adjuntar una Carta de Nombramiento (PDF/DOCX) al
registrar el cliente. Se sube a Google Cloud Storage vía `workitems-ms` y se
asocia mediante `cliente_documento.tipo = CARTA_NOMBRAMIENTO`.

## Inversiones y pólizas anidadas

`ClientePolizasPage` y `ClienteInversionesPage` son rutas dependientes de
`:id` y solo visibles para `SIN_VENDEDOR` (admin/ejecutivo/broker/punto venta).
