---
slug: /deployment
title: Deploy
sidebar_position: 6
---

# Deploy

## Frontend → Railway

El frontend se publica en **Railway** con auto-deploy desde la rama `main`
del repo `frontend-react`.

- URL pública: **https://app.hannahlab.com** (y `https://austral.up.railway.app`).
- Build command: `pnpm build` (Vite production).
- Output: `dist/`.
- Healthcheck: la ruta `/` debe responder 200.

### Variables de entorno en Railway

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://api.hannahlab.com` |
| `VITE_GOOGLE_MAPS_API_KEY` | Key con permisos JS Maps + Geocoding |
| `NODE_ENV` | `production` |

> Las variables `VITE_*` se inlinean en el bundle en build-time, no en runtime.
> Cambiar una requiere redeploy.

### Workflow

1. Trabajas en una rama (`feat/…`, `fix/…`, `chore/…`).
2. PR a `main`.
3. Merge → Railway detecta el push y construye el sitio.
4. Si el build pasa, despliega automáticamente.

### Cómo verificar un deploy

- Railway dashboard → Deployments.
- O bien, abrir la URL y revisar:
  - Footer del navbar (sin errores en consola).
  - Versión visible (si tienes el badge de commit en el sidebar).
  - Network tab → las requests van a `api.hannahlab.com`.

## Backend → GCP (referencia)

El backend (`austral-launcher`) corre en una VM `austral-backend` en
`us-central1-a`, proyecto `austral-crm-prod`. Cada microservicio es un
contenedor Docker en la red `usuario_microservices-network`.

Detalles completos en `austral-launcher/archivos/mdsPROD/MANUAL-ACTUALIZACION-PRODUCCION.md`.

## Docusaurus → ¿dónde?

Esta documentación puede hostearse en:

1. **GitHub Pages** del repo del frontend (gratis).
2. **Railway** como sitio estático.
3. **Vercel** / **Netlify** apuntando a `documentation/build`.

Build local:

```bash
cd documentation
pnpm build       # genera /build
pnpm serve       # sirve el build estático
```
