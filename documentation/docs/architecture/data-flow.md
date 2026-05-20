---
title: Datos y estado
sidebar_position: 4
---

# Datos y estado

## Capas

```
Componente
   ↓ usa
Hook de dominio (useUsuarios, useLeads, useClientes…)
   ↓ envuelve
Service (usuario.service.ts, lead.service.ts…)
   ↓ ejecuta
React Query (useQuery / useMutation)
   ↓ llama
api-client (Axios con JWT)
   ↓ HTTP
client-gateway (NestJS) → NATS → microservicios
```

## Patrón de service

Cada `*.service.ts` exporta:

1. Un objeto con métodos HTTP planos (`getAll`, `getById`, `create`, `update`, `delete`).
2. Hooks de React Query que envuelven esos métodos:

```ts
export const usuarioApi = {
  getAll: async () => (await api.get<Usuario[]>(`/usuarios`)).data || [],
  delete: async (id: string) => api.delete(`/usuarios/${id}`),

  useGetAll: () =>
    useQuery({ queryKey: USUARIOS_KEY, queryFn: () => usuarioApi.getAll() }),

  useRemove: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: usuarioApi.remove,
      onSuccess: () => qc.invalidateQueries({ queryKey: USUARIOS_KEY }),
    });
  },
};
```

## Patrón de hook

Los hooks de `hooks/use*.ts` agregan UX (toasts, loading) sobre el service:

```ts
export const useUsuarios = () => {
  const { data: usuarios = [], isLoading } = usuarioApi.useGetAll();
  const removeMutation = usuarioApi.useRemove();

  const removeUsuario = async (id: string) => {
    try {
      await removeMutation.mutateAsync(id);
      toast.success("Usuario eliminado");
    } catch {
      toast.error("No se pudo eliminar el usuario");
    }
  };

  return { usuarios, isLoading, removeUsuario, /* ... */ };
};
```

## Estado del cliente — Zustand

### `auth.store.ts`

- Persiste el usuario y el token en `localStorage`.
- `login(correo, contrasena)` — llama al backend, guarda token.
- `initializeAuth()` — valida el token al cargar la app (revoca si expiró).
- `logout()` — limpia store + redirige a `/auth/login`.

### `chat.store.ts`

- Mantiene el historial de mensajes con el Austral AI.
- No persiste (se reinicia al cerrar sesión).

## Reglas de oro

1. **Una mutation = una invalidación**. Si tu mutation modifica una lista,
   invalida el `queryKey` correspondiente. No actualices el cache a mano salvo
   en optimistic UI muy controlada.
2. **El hook no debe llamar a Axios directamente.** Pasa por el service.
3. **El componente no debe llamar al service directamente.** Pasa por el hook
   o use directamente los hooks del service (`usuarioApi.useGetAll()`).
4. **Una entidad = una `_KEY`**. Las constantes (`USUARIOS_KEY`,
   `CLIENTES_KEY`, etc.) son la verdad para invalidaciones y prefetchs.
