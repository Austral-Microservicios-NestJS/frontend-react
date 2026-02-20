import { forwardRef } from "react";
import PhoneInputOriginal, { type Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<
  React.ComponentProps<typeof PhoneInputOriginal>,
  "onChange"
> {
  className?: string;
  onChange?: (value: Value) => void;
  error?: string;
}

const PhoneInput = forwardRef<any, PhoneInputProps>(
  ({ className, error, onChange, ...props }, ref) => {
    return (
      <div className={cn("grid gap-2", className)}>
        <PhoneInputOriginal
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            "[&>.PhoneInputCountry]:mr-2", // Espaciado para la bandera
            "[&>.PhoneInputCountrySelect]:opacity-0", // Ocultar el select nativo pero mantener funcionalidad
            "[&>input]:bg-transparent [&>input]:outline-none [&>input]:border-none [&>input]:h-full [&>input]:w-full", // Estilos para el input interno
          )}
          defaultCountry="PE"
          onChange={onChange as any}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
