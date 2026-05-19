/**
 * Validaciones compartidas para formularios (gestión de usuarios y otros).
 * Mantiene la misma convención que RegistrarCliente.tsx:
 *  - DNI: 8 dígitos
 *  - RUC: 11 dígitos, empieza con 10 (natural) o 20 (jurídica)
 *  - CE: 9 a 12 caracteres alfanuméricos
 *  - PASAPORTE: 6 a 20 caracteres alfanuméricos
 *  - Teléfono Perú: 9 dígitos, empieza con 9
 *
 * Cada función devuelve `true` si es válido o un string con el mensaje de error
 * (formato esperado por la prop `validate` de react-hook-form).
 */

export const validarNumeroDocumento = (
  tipoDocumento: string | undefined,
  value: unknown,
): true | string => {
  const v = String(value ?? "").trim();
  if (!tipoDocumento) return "Primero seleccione el tipo de documento";
  if (!v) return "El número de documento es requerido";

  switch (tipoDocumento) {
    case "DNI":
      return /^\d{8}$/.test(v) ? true : "DNI: deben ser 8 dígitos numéricos";
    case "RUC":
      if (!/^\d{11}$/.test(v)) return "RUC: deben ser 11 dígitos numéricos";
      if (!v.startsWith("10") && !v.startsWith("20"))
        return "RUC: debe empezar con 10 o 20";
      return true;
    case "CE":
      if (!/^[a-zA-Z0-9]+$/.test(v)) return "CE: solo caracteres alfanuméricos";
      return v.length >= 9 && v.length <= 12
        ? true
        : "CE: 9 a 12 caracteres";
    case "PASAPORTE":
      if (!/^[a-zA-Z0-9]+$/.test(v))
        return "Pasaporte: solo caracteres alfanuméricos";
      return v.length >= 6 && v.length <= 20
        ? true
        : "Pasaporte: 6 a 20 caracteres";
    default:
      return true;
  }
};

/** Teléfono móvil Perú: exactamente 9 dígitos y empieza con 9. */
export const validarTelefonoPeru = (
  value: unknown,
  { requerido = true }: { requerido?: boolean } = {},
): true | string => {
  const v = String(value ?? "").trim();
  if (!v) return requerido ? "El teléfono es requerido" : true;
  if (!/^\d{9}$/.test(v)) return "Teléfono: deben ser 9 dígitos numéricos";
  if (!v.startsWith("9")) return "Teléfono: debe empezar con 9";
  return true;
};

/** Nombres/apellidos: solo letras (incluye tildes y ñ), espacios y guiones. */
export const validarNombre = (value: unknown): true | string => {
  const v = String(value ?? "").trim();
  if (!v) return "Este campo es requerido";
  if (v.length < 2) return "Mínimo 2 caracteres";
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/.test(v)
    ? true
    : "Solo se permiten letras y espacios";
};

/** Email con formato estándar. */
export const EMAIL_PATTERN = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: "Correo inválido (ej: nombre@dominio.com)",
};
