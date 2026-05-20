---
slug: /intro
title: Bienvenido
sidebar_position: 1
---

# Austral CRM — Frontend

El CRM de **Austral Corredores de Seguros** es una aplicación web que centraliza
la operación de la corredora: gestión de clientes, leads de venta, pólizas,
tareas, comunicaciones automatizadas y un agente IA propio.

Este sitio documenta el **frontend** (la pieza con la que interactúa todo el
equipo de la corredora). Para el backend, ver el monorepo `austral-launcher`.

## ¿Qué encontrarás aquí?

- **[Empezar](/getting-started)** — clonar, instalar, correr en local.
- **[Arquitectura](/architecture/overview)** — stack, capas, decisiones técnicas.
- **[Módulos](/modules/usuarios)** — un capítulo por dominio (usuarios,
  clientes, leads, pólizas, tareas, IA).
- **[Convenciones](/conventions/code-style)** — estilo, validaciones, roles,
  fechas, teléfonos.
- **[Deploy](/deployment)** — cómo se publica en Railway.
- **[Troubleshooting](/troubleshooting)** — problemas comunes y cómo resolverlos.

## Resumen rápido

| Aspecto | Valor |
|---|---|
| Framework | React 19 + Vite |
| Lenguaje | TypeScript (strict) |
| UI | shadcn/ui + Tailwind CSS |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand |
| Formularios | react-hook-form |
| Router | react-router-dom v7 |
| Package manager | pnpm |
| Producción | Railway · `https://app.hannahlab.com` |
| API | `https://api.hannahlab.com` (GCP) |

:::tip
La documentación es viva. Si encuentras algo desactualizado, abre un PR
modificando el `.md` correspondiente en `documentation/docs/`.
:::
