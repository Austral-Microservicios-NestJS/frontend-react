---
title: Code style
sidebar_position: 1
---

# Code style

## Reglas generales

- **TypeScript strict** — sin `any` implícito. Usa tipos del dominio
  (`@/types/*.interface.ts`).
- **Pure functions cuando se pueda**. Side-effects en hooks o handlers, no en
  helpers.
- **Naming**:
  - Componentes en `PascalCase` (`TablaUsuarios`, `EditarCliente`).
  - Hooks en `camelCase` con prefijo `use*`.
  - Servicios en `camelCase` con sufijo `Service` o `Api`.
  - Constantes globales en `SCREAMING_SNAKE_CASE` (`USUARIOS_KEY`).
- **Imports relativos** vía alias `@/` (`@/components/...`, `@/services/...`).
  No usar `../../..` en código de aplicación.

## Componentes

- **Funcionales** con `React.FC` evitado — usa la forma `export const X = (...)`.
- **Destructurar props** y dar default values inline cuando aplique.
- **Estado mínimo**: si el dato vive en React Query, no lo dupliques con
  `useState`. Si se deriva de props, calcúlalo en render.
- **Una responsabilidad por componente**. Si crece más de ~250 líneas,
  considera separar modales/tablas internas.

## Formularios

- Usa `react-hook-form` siempre que haya >2 campos.
- `register` para inputs nativos, `<Controller>` para shadcn `<Select>`.
- Muestra errores debajo del input:

  ```tsx
  {errors.campo && (
    <span className="text-xs text-red-500">
      {errors.campo.message as string}
    </span>
  )}
  ```

- Valida desde `utils/validators.ts` (no dupliques regex en cada formulario).

## Modales y confirmaciones

- Modal de edición/registro: `ModalContainer + Modal + ModalHeader/Body/Footer`.
- **Confirmación destructiva**: usa `<ModalConfirmacion>`, no `window.confirm`.
  El diálogo del navegador (`austral.up.railway.app dice...`) no es aceptable
  en el CRM.

## Iconos

- Librería: `lucide-react`. Importa solo lo que uses.
- Tamaño por defecto: `w-4 h-4` para inline, `w-5 h-5` para botones, `h-3.5
  w-3.5` para chips.

## Estilos

- Tailwind utility-first. Evita CSS arbitrario salvo para los tokens
  `--austral-*`.
- Para colores propios usar variables CSS: `style={{ backgroundColor:
  "var(--austral-azul)" }}` o las clases ya configuradas.
- shadcn/ui ya viene tematizado — no overridear globalmente.

## Comentarios

- **Comenta el "por qué", no el "qué"**. El qué se lee del código.
- JSDoc en exports públicos de servicios y utilidades.
- Sin `console.log` en código comiteado. Si necesitas debug temporal, bórralo
  antes de PR.
- Sin código comentado "por si acaso". Si lo quieres recuperar, está en git.

## TODOs

- Formato: `// TODO(ticket-N): descripción corta` o `// TODO(nombre): ...`.
- Si lleva más de 1 mes sin tocarse, considera eliminar o convertir en issue.
