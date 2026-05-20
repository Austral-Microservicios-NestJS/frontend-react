---
title: Usuarios
sidebar_position: 1
---

# Módulo · Usuarios

Gestión de los usuarios del CRM (administradores, ejecutivos, brokers,
promotores, referenciadores y puntos de venta).

## Rutas

| Ruta | Roles | Página |
|---|---|---|
| `/dashboard/admin/maestros/usuarios` | ADMIN, BROKER | `pages/admin/maestros/usuarios/UsuariosPage.tsx` |
| `/dashboard/perfil` | TODOS | Auto-edición del propio usuario |

## Archivos clave

- `services/usuario.service.ts` — API + hooks (`useGetAll`, `useGetById`, `useGetByRole`, `useCreate`, `useUpdate`, `useRemove`).
- `hooks/useUsuarios.ts` — orquesta toasts y exporta operaciones.
- `components/modulos/usuarios/`
  - `tablas/TablaUsuarios.tsx` — listado con columnas (correo, rol, comisión, documento, teléfonos, carga de leads, estado).
  - `modales/RegistrarUsuario.tsx` — alta con validaciones.
  - `modales/EditarUsuario.tsx` — edición completa.

## Comportamientos importantes

### Solo se muestran activos

`UsuariosPage` filtra `usuariosActivos = usuarios.filter(u => u.activo !== false)`.
Los inactivos no aparecen — futuros soft-deletes desaparecen automáticamente.

### Borrar usuario = borrado físico

El botón tachito invoca `useRemove` → `DELETE /usuarios/:id` → backend
`auth-ms.softDelete()` que **siempre delega a `hardDelete()`** (elimina
asignaciones, notificaciones, persona y usuario en una transacción).
Irreversible.

La confirmación usa **`<ModalConfirmacion>`** (modal custom, no el
`window.confirm` del navegador).

### Comisión

La comisión vive en la tabla `asignaciones` (relación supervisor → subordinado),
no en `usuario`. El flujo:

1. `EditarUsuario` envía `{ ...usuarioData, porcentajeComision }`.
2. `UsuariosPage.handleUpdate` separa ambos:
   - `updateUsuario(id, data)` actualiza columnas de usuario/persona.
   - `asignacionApi.useUpdateComision({ idUsuario, porcentajeComision })`
     actualiza la asignación correspondiente.

### Roles permitidos al crear

`RegistrarUsuario` filtra roles según quién crea:

- `ADMINISTRADOR` ve todos los roles.
- `BROKER` solo puede crear `PROMOTOR_VENTA`, `REFERENCIADOR`, `PUNTO_VENTA`
  (su red).

## Validaciones del formulario

Centralizadas en `utils/validators.ts`. Ver
[Convenciones · Validators](/conventions/validators).

- **Documento** depende del tipo (DNI 8 dígitos, RUC 11 dígitos + prefijo 10/20).
- **Teléfono** 9 dígitos comenzando con 9.
- **Email** pattern estricto.
- **Comisión** entre 0 y 100.

## Errores conocidos / históricos

- **Bug del `id_rol = null` al editar** (resuelto sesión 12): TypeORM tenía un
  conflicto entre la columna `idRol` y la relación `rol` al hacer
  `save(user)`. Solución: el service ahora usa
  `usuarioRepository.update(id, patch)` por columnas (sin relación). Si vuelves
  a ver 500 al actualizar usuario, revisa `auth-ms/usuarios.service.ts` y
  busca que no se haya reintroducido el patrón `user.rol = null`.
