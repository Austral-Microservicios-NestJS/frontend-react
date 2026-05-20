---
slug: /troubleshooting
title: Troubleshooting
sidebar_position: 7
---

# Troubleshooting

## "No puedo editar usuarios (500)"

Causa típica: regresión en `auth-ms/usuarios.service.ts.update()`.

El doble mapeo de TypeORM (`idRol` columna + `rol` relación) hace que al
guardar con `save(user)` la relación gane prioridad y se escriba `id_rol = null`.

**Patrón correcto** (no remover):

```ts
// Construir patch SOLO de columnas
const patch: Record<string, any> = {};
if (idRol) patch.idRol = idRol;
if (idSupervisor !== undefined) patch.idSupervisor = idSupervisor;
// ...

if (Object.keys(patch).length > 0) {
  await this.usuarioRepository.update(id, patch);
}
```

Buscar la causa raíz revisando los logs del contenedor:

```bash
gcloud compute ssh austral-backend --zone=us-central1-a \
  --project=austral-crm-prod \
  --command='sudo docker logs auth-ms --tail 60 | grep -iE "error|null value"'
```

## "Las comisiones en pólizas no me dejan escribir"

Causa: los `useEffect` de auto-populate están sobrescribiendo cada keystroke.

`RegistrarPoliza.tsx` debe tener los refs `appliedBrokerIdRef` y
`appliedAgenteIdRef` que limitan el auto-populate a **un solo disparo por
selección**:

```ts
if (watchIdBroker === appliedBrokerIdRef.current) return;
```

## "El botón eliminar no funciona en usuarios inactivos"

Caso histórico (sesión 11). Actualmente la tabla de Gestión de Usuarios solo
muestra **activos** (`usuariosActivos = usuarios.filter(...)`); el problema ya
no aplica. Si necesitas accionar sobre inactivos, primero hay que mostrarlos
(toggle "ver inactivos") y el backend ya hace borrado físico siempre.

## "Recordatorio WhatsApp falla todos los ciclos"

Solo se envía por WhatsApp si el lead tiene `manychatSubscriberId`. Para
clientes que entraron por CRM (no por chatbot), el WhatsApp no aplica — email
+ in-app deberían cubrirlo.

Para el agente, su `telefonoEmpresarial` debe ser subscriber de ManyChat (haber
escrito al bot al menos una vez). Si no, también se omite silenciosamente.

## "Quiero borrar un lead/cliente/usuario y deja huérfanos"

Es esperado: las bases de los microservicios son independientes (auth-ms,
leads-ms, clients-ms, insurance-base-ms cada una con su DB). Hay
**referencias por UUID sin FK** entre microservicios.

Después de un borrado, otros micros pueden tener referencias huérfanas (ej:
`lead.asignado_a` apuntando a un usuario borrado, `polizas.idCliente`
apuntando a un cliente borrado). No causa errores en BD pero sí inconsistencias
de UI. Para limpiezas mayores, hacer la cascada manual cross-DB.

## "TypeScript se queja después de borrar archivos"

Corre `pnpm dlx tsc -b` para localizar el import roto. Si un archivo fue
removido por knip pero su import quedó, normalmente el remove no debió
hacerse, o el barrel (`index.ts`) necesita actualizarse.

## "Las fechas se muestran un día antes"

Problema de UTC. Asegúrate de usar el patrón:

```ts
// Mostrar
new Date(fecha.substring(0, 10) + "T12:00:00").toLocaleDateString("es-PE")

// Persistir
fecha.substring(0, 10)
```

Sin el `T12:00:00`, JavaScript interpreta `YYYY-MM-DD` como medianoche UTC, y
en Perú (UTC-5) ves el día anterior.

## "El admin perdió permisos"

Verifica el rol en BD:

```sql
SELECT u.correo, r.nombre_rol
FROM usuario u
JOIN rol r ON r.id_rol = u.id_rol
WHERE u.correo = 'admin@austral.com';
```

Si es distinto de `ADMINISTRADOR`, actualiza:

```sql
UPDATE usuario
SET id_rol = (SELECT id_rol FROM rol WHERE nombre_rol = 'ADMINISTRADOR')
WHERE correo = 'admin@austral.com';
```

El usuario debe cerrar sesión y volver a entrar (el JWT se refresca solo).
