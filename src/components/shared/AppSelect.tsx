import ReactSelect, {
  type GroupBase,
  type Props as ReactSelectProps,
} from "react-select";
import Creatable, { type CreatableProps } from "react-select/creatable";

export interface SelectOption {
  value: string;
  label: string;
}

type AppSelectProps<
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = ReactSelectProps<Option, IsMulti, Group> &
  Pick<
    CreatableProps<Option, IsMulti, Group>,
    "onCreateOption" | "formatCreateLabel" | "isValidNewOption"
  > & {
    /**
     * Cuando es `true` el usuario puede escribir un valor libre que no exista
     * en las opciones y éste se preserva como nueva opción.
     * Internamente cambia de ReactSelect a react-select/creatable.
     */
    isCreatable?: boolean;
  };

/**
 * AppSelect — Wrapper de react-select con estilos alineados al sistema de diseño.
 *
 * Uso básico con react-hook-form:
 * ```tsx
 * <Controller
 *   control={control}
 *   name="campo"
 *   rules={{ required: "Campo obligatorio" }}
 *   render={({ field }) => (
 *     <AppSelect
 *       options={opciones}
 *       placeholder="Seleccione..."
 *       value={opciones.find(o => o.value === field.value) ?? null}
 *       onChange={(opt) => field.onChange((opt as SelectOption)?.value ?? null)}
 *     />
 *   )}
 * />
 * ```
 */
export const AppSelect = <
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  placeholder = "Seleccione una opción...",
  noOptionsMessage = () => "Sin opciones",
  loadingMessage = () => "Cargando...",
  isSearchable = true,
  isCreatable = false,
  onCreateOption,
  formatCreateLabel = (input) => `Usar "${input}"`,
  isValidNewOption,
  ...props
}: AppSelectProps<Option, IsMulti, Group>) => {
  const sharedClassNames: ReactSelectProps<
    Option,
    IsMulti,
    Group
  >["classNames"] = {
    control: ({ isFocused, isDisabled }) =>
      [
        "flex min-h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
        isFocused
          ? "border-ring ring-ring/50 ring-[3px] outline-none"
          : "border-input",
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-default",
      ].join(" "),

    valueContainer: () => "flex flex-wrap gap-1 py-0.5",

    placeholder: () => "text-muted-foreground",

    singleValue: () => "text-foreground",

    input: () => "text-foreground",

    indicatorsContainer: () => "flex items-center gap-1",

    dropdownIndicator: ({ isFocused }) =>
      [
        "text-muted-foreground transition-colors hover:text-foreground",
        isFocused ? "text-foreground" : "",
      ].join(" "),

    clearIndicator: () =>
      "text-muted-foreground transition-colors hover:text-destructive cursor-pointer",

    indicatorSeparator: () => "bg-border mx-0.5 self-stretch w-px",

    menu: () =>
      "mt-1 rounded-md border border-border bg-popover text-popover-foreground shadow-md z-50 overflow-hidden",

    menuList: () => "p-1 max-h-60 overflow-auto",

    option: ({ isFocused, isSelected }) =>
      [
        "relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        isSelected
          ? "bg-blue-100 text-blue-800 font-medium"
          : isFocused
            ? "bg-blue-50 text-blue-700"
            : "text-foreground",
      ].join(" "),

    noOptionsMessage: () => "py-6 text-center text-sm text-muted-foreground",

    loadingMessage: () => "py-6 text-center text-sm text-muted-foreground",

    multiValue: () =>
      "flex items-center gap-1 rounded-sm bg-accent text-accent-foreground px-1.5 py-0.5 text-xs font-medium",

    multiValueLabel: () => "text-accent-foreground",

    multiValueRemove: () =>
      "hover:text-destructive cursor-pointer transition-colors",

    group: () => "py-1",

    groupHeading: () =>
      "px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
  };

  const commonProps = {
    unstyled: true as const,
    placeholder,
    noOptionsMessage,
    loadingMessage,
    isSearchable,
    classNames: sharedClassNames,
    ...props,
  };

  if (isCreatable) {
    return (
      <Creatable<Option, IsMulti, Group>
        {...commonProps}
        onCreateOption={onCreateOption}
        formatCreateLabel={formatCreateLabel}
        isValidNewOption={isValidNewOption}
      />
    );
  }

  return <ReactSelect<Option, IsMulti, Group> {...commonProps} />;
};
