import Calendar from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AppCalendar.css";
import { cn } from "@/lib/utils";

export type AppCalendarValue = Date | [Date, Date] | null;

export interface AppCalendarProps extends Omit<
  CalendarProps,
  "className" | "onChange"
> {
  /** Fecha(s) seleccionada(s). Acepta Date o rango [Date, Date]. */
  value?: AppCalendarValue;
  /** Callback al seleccionar una fecha. Recibe el valor ya tipado. */
  onChange?: (value: AppCalendarValue) => void;
  className?: string;
}

/**
 * AppCalendar — Wrapper de react-calendar con estilos alineados al design system.
 *
 * Uso básico (fecha única):
 * ```tsx
 * <AppCalendar
 *   value={fecha}
 *   onChange={(date) => setFecha(date as Date)}
 * />
 * ```
 *
 * Uso con react-hook-form + Popover (como date picker):
 * ```tsx
 * <Controller
 *   control={control}
 *   name="fechaTentativa"
 *   render={({ field }) => (
 *     <Popover>
 *       <PopoverTrigger asChild>
 *         <Button variant="outline">
 *           {field.value
 *             ? new Date(field.value + "T12:00:00").toLocaleDateString("es-PE")
 *             : "Seleccione fecha..."}
 *         </Button>
 *       </PopoverTrigger>
 *       <PopoverContent className="w-auto p-0">
 *         <AppCalendar
 *           value={field.value ? new Date(field.value + "T12:00:00") : null}
 *           onChange={(d) => field.onChange((d as Date).toISOString().split("T")[0])}
 *         />
 *       </PopoverContent>
 *     </Popover>
 *   )}
 * />
 * ```
 */
export const AppCalendar = ({
  value,
  onChange,
  className,
  locale = "es-PE",
  ...props
}: AppCalendarProps) => {
  return (
    <Calendar
      className={cn("app-calendar", className)}
      value={value ?? null}
      onChange={(val) => onChange?.(val as AppCalendarValue)}
      locale={locale}
      {...props}
    />
  );
};
