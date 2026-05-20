---
title: Pólizas
sidebar_position: 4
---

# Módulo · Pólizas

Pólizas vigentes / históricas. Cada póliza pertenece a un cliente y referencia
una compañía, un ramo y un producto.

## Rutas

| Ruta | Roles | Página |
|---|---|---|
| `/dashboard/gestion-trabajo/polizas` | SIN_VENDEDOR | `PolizasPage` |
| `/clientes/:id/polizas` | SIN_VENDEDOR | `ClientePolizasPage` |

## Archivos clave

- `services/poliza.service.ts`
- `hooks/usePolizas.ts`
- `components/modulos/polizas/`
  - `modales/RegistrarPoliza.tsx` — alta con auto-poblado de comisiones.
  - `modales/DetallePolizaModal.tsx` — preview en read-only.
  - `tablas/TablaPolizas.tsx` — listado.

## Crear póliza desde clientes

Desde `PolizasPage` el botón "Nueva Póliza" abre un selector de cliente en 2
pasos:

1. Buscar cliente por nombre/documento.
2. Confirmar y abrir `RegistrarPoliza` con `idCliente` precargado.

## Comisiones (broker + agente)

El formulario auto-puebla `comisionBroker` y `comisionAgente` cuando se
selecciona el broker o agente, según el rol del usuario que registra:

| Rol que crea | comisionBroker | comisionAgente |
|---|---|---|
| ADMIN | Toma `porcentajeComision` del broker seleccionado | Toma del agente seleccionado |
| BROKER | Toma de su propia asignación con el supervisor | Toma de la asignación del subordinado |
| AGENTE | Toma de su asignación con el broker (supervisor) | Su propia comisión |

### Bug histórico — auto-populate sobrescribía lo escrito a mano

En la sesión 12 había un bug donde los `useEffect` de auto-populate se
re-ejecutaban en cada render (por referencias `[]` inestables y `watch()`),
reseteando el campo cuando intentabas tipear → "no me deja escribir
números".

**Solución actual** (`RegistrarPoliza.tsx`):

```ts
const appliedBrokerIdRef = useRef<string | undefined>(undefined);
const appliedAgenteIdRef = useRef<string | undefined>(undefined);
```

El auto-populate solo se ejecuta cuando el `id` seleccionado **cambia respecto
al último aplicado**. Después de eso el campo es libre para editar. Los refs
se limpian al abrir/cerrar el modal.

Si vuelves a ver el bug, revisa que no se haya eliminado este patrón.

## Vigencia

`tipoVigencia` ∈ `ANUAL | SEMESTRAL | MENSUAL | OTRO`. Al seleccionar
`vigenciaInicio` y `tipoVigencia`, `vigenciaFin` se calcula automáticamente
con `dayjs`.

## Estado de pólizas

`VIGENTE | VENCIDA | CANCELADA | EMITIDA`. El default al crear es `VIGENTE`.
