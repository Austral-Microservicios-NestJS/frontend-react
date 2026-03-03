import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { AppCalendar } from "./AppCalendar";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONALIDADES DISPONIBLES DE react-calendar
// (pásalas como props a <AppCalendar> dentro de <PopoverContent>)
// ─────────────────────────────────────────────────────────────────────────────
//
// selectRange={true}
//   → Permite seleccionar un rango de fechas (inicio → fin).
//     El valor devuelto en onChange será [Date, Date] en lugar de Date.
//
// minDate={new Date()}
//   → Deshabilita todas las fechas anteriores a hoy.
//     Útil para campos como "fecha de entrega" o "fecha tentativa".
//
// maxDate={new Date(2030, 11, 31)}
//   → Deshabilita todas las fechas posteriores a la indicada.
//
// defaultView="year"
//   → Vista inicial al abrir: "month" (default) | "year" | "decade" | "century"
//
// showNeighboringMonth={false}
//   → Oculta los días del mes anterior/siguiente que aparecen en los bordes.
//
// tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6}
//   → Deshabilita tiles específicas por lógica (ej: fines de semana).
//
// tileContent={({ date }) => date.getDate() === 15 ? <span>🔔</span> : null}
//   → Añade contenido HTML/JSX personalizado dentro de cada tile (badges, puntos, iconos).
//
// tileClassName={({ date }) => date.getDay() === 5 ? "viernes" : null}
//   → Añade clases CSS condicionales por tile.
//
// onActiveStartDateChange={({ activeStartDate }) => console.log(activeStartDate)}
//   → Callback que se dispara al navegar entre meses o años.
//     Útil para cargar datos dinámicos (ej: disponibilidad por mes).
//
// formatDay={(locale, date) => date.getDate().toString()}
//   → Personaliza el texto que muestra cada número de día.
//
// locale="es-PE"
//   → Idioma del calendario (ya configurado por defecto en AppCalendar).
//
// ─────────────────────────────────────────────────────────────────────────────

export interface AppDatePickerProps {
  /** Valor actual como string "YYYY-MM-DD". Compatible con react-hook-form. */
  value?: string | null;
  /** Callback al seleccionar una fecha. Devuelve "YYYY-MM-DD". */
  onChange?: (value: string) => void;
  /** Texto placeholder cuando no hay fecha seleccionada. */
  placeholder?: string;
  /** Id HTML para la accesibilidad del botón trigger. */
  id?: string;
  /** Deshabilita el selector. */
  disabled?: boolean;
  /** Clases Tailwind extra para el botón trigger. Útil para tamaño compacto, ej: "w-44 h-8 text-xs". */
  triggerClassName?: string;
  /** Props adicionales que se pasan directamente a <AppCalendar>. */
  calendarProps?: React.ComponentProps<typeof AppCalendar>;
}

/**
 * AppDatePicker — Date picker compuesto por Popover + AppCalendar.
 *
 * Maneja internamente el estado open/close del Popover y convierte
 * el Date a string "YYYY-MM-DD" (y viceversa) para compatibilidad
 * con react-hook-form.
 *
 * Uso simple (sin react-hook-form):
 * ```tsx
 * <AppDatePicker
 *   value={fecha}
 *   onChange={(v) => setFecha(v)}
 * />
 * ```
 *
 * Uso con react-hook-form:
 * ```tsx
 * <Controller
 *   control={control}
 *   name="fechaTentativa"
 *   rules={{ required: "Obligatorio" }}
 *   render={({ field }) => (
 *     <AppDatePicker value={field.value} onChange={field.onChange} />
 *   )}
 * />
 * ```
 *
 * Uso con props adicionales de react-calendar:
 * ```tsx
 * <AppDatePicker
 *   value={field.value}
 *   onChange={field.onChange}
 *   calendarProps={{ minDate: new Date(), showNeighboringMonth: false }}
 * />
 * ```
 */
export const AppDatePicker = ({
  value,
  onChange,
  placeholder = "Seleccione una fecha...",
  id,
  disabled = false,
  triggerClassName,
  calendarProps,
}: AppDatePickerProps) => {
  const [open, setOpen] = useState(false);

  // Convierte "YYYY-MM-DD" → Date usando T12:00:00 para evitar desfase de zona horaria
  const dateValue = value ? new Date(value + "T12:00:00") : null;

  const formatted = dateValue
    ? dateValue.toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            triggerClassName,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 shrink-0" />
          {formatted ?? (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 z-[99999]" align="start">
        <AppCalendar
          value={dateValue}
          onChange={(d) => {
            if (d instanceof Date) {
              // Convierte Date → "YYYY-MM-DD" y cierra el Popover
              onChange?.(d.toISOString().split("T")[0]);
              setOpen(false);
            }
          }}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AppDatePickerField — Atajo para uso directo con react-hook-form (Controller).
// Evita escribir el <Controller> manualmente en cada campo.
// ─────────────────────────────────────────────────────────────────────────────

interface AppDatePickerFieldProps extends Omit<
  AppDatePickerProps,
  "value" | "onChange"
> {
  control: Control<any>;
  name: string;
  rules?: React.ComponentProps<typeof Controller>["rules"];
}

/**
 * AppDatePickerField — Versión todo-en-uno con Controller integrado.
 *
 * ```tsx
 * <AppDatePickerField
 *   control={control}
 *   name="fechaTentativa"
 *   rules={{ required: "La fecha es obligatoria" }}
 *   id="fechaTentativa"
 * />
 * ```
 */
export const AppDatePickerField = ({
  control,
  name,
  rules,
  ...pickerProps
}: AppDatePickerFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <AppDatePicker
          value={field.value}
          onChange={field.onChange}
          {...pickerProps}
        />
      )}
    />
  );
};
