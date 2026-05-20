---
title: Validaciones
sidebar_position: 2
---

# Validaciones

Centralizadas en `src/utils/validators.ts`. Úsalas siempre que un formulario
pida documento, teléfono, nombre o email — son la fuente de verdad.

## API

```ts
import {
  validarNumeroDocumento,
  validarTelefonoPeru,
  validarNombre,
  EMAIL_PATTERN,
} from "@/utils/validators";
```

Todas las funciones devuelven `true` (válido) o un `string` con el mensaje de
error. Compatibles con la prop `validate` de `react-hook-form`.

## Reglas

### Documentos

| Tipo | Regla | Mensaje |
|---|---|---|
| `DNI` | 8 dígitos numéricos | "DNI: deben ser 8 dígitos numéricos" |
| `RUC` | 11 dígitos + empieza con `10` (natural) o `20` (jurídica) | "RUC: 11 dígitos…" / "RUC: debe empezar con 10 o 20" |
| `CE` | 9 a 12 caracteres alfanuméricos | "CE: 9 a 12 caracteres" |
| `PASAPORTE` | 6 a 20 caracteres alfanuméricos | "Pasaporte: 6 a 20 caracteres" |

### Teléfono Perú

```ts
validarTelefonoPeru(value)                       // requerido (default)
validarTelefonoPeru(value, { requerido: false }) // opcional
```

- 9 dígitos numéricos.
- Debe empezar con `9` (números móviles peruanos).
- Vacío + `requerido:false` ⇒ válido.

### Nombre

`validarNombre(value)`:

- Mínimo 2 caracteres (sin contar espacios).
- Solo letras (incluye `ÁÉÍÓÚáéíóúÑñÜü'`), espacios y guiones.

### Email

`EMAIL_PATTERN` se usa con `register("correo", { pattern: EMAIL_PATTERN })`.
Pattern estándar.

## Ejemplo en formulario

```tsx
const { register, watch, formState: { errors } } = useForm();

<Input
  type="text"
  inputMode="text"
  {...register("numeroDocumento", {
    required: "El número de documento es requerido",
    validate: (v) => validarNumeroDocumento(watch("tipoDocumento"), v),
  })}
/>
{errors.numeroDocumento && (
  <span className="text-xs text-red-500">
    {errors.numeroDocumento.message as string}
  </span>
)}
```

## Convenciones de teléfono

- En BD se guarda con `+51` (formato internacional para Perú).
- En formularios se muestra sin prefijo (solo 9 dígitos).
- `PhoneInput` (componente compartido) ya maneja la conversión.
