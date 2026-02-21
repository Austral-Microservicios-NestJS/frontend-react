import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalContainer,
  FormGroup,
  FormGroupDivisor,
  LocationInput,
  type LocationData,
} from "@/components/shared";
import { ModalHeader } from "@/components/shared";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EstadoSiniestro,
  TipoSiniestro,
  estadoSiniestroOptions,
  tipoSiniestroOptions,
  type CreateSiniestro,
} from "@/modules/siniestro/siniestro.types";
import { useCreateSiniestro } from "@/modules/siniestro/siniestro.queries";

const monedaOptions = [
  { value: "PEN", label: "PEN - Sol" },
  { value: "USD", label: "USD - Dólar" },
  { value: "EUR", label: "EUR - Euro" },
];

interface RegistrarSiniestroForm {
  tipoSiniestro: TipoSiniestro;
  estado: EstadoSiniestro;
  fechaOcurrencia: string;
  fechaReporte: string;
  fechaResolucion: string;
  descripcion: string;
  numeroSiniestroCompania: string;
  direccion: string;
  latitud: string;
  longitud: string;
  montoReclamado: string;
  montoAprobado: string;
  montoDeducible: string;
  moneda: string;
  ajustador: string;
  observaciones: string;
}

interface RegistrarSiniestroProps {
  isOpen: boolean;
  onClose: () => void;
  idPoliza: string;
  registradoPor: string;
}

export const RegistrarSiniestro = ({
  isOpen,
  onClose,
  idPoliza,
  registradoPor,
}: RegistrarSiniestroProps) => {
  const createMutation = useCreateSiniestro();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarSiniestroForm>({
    defaultValues: {
      moneda: "PEN",
      estado: EstadoSiniestro.REPORTADO,
      fechaReporte: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        moneda: "PEN",
        estado: EstadoSiniestro.REPORTADO,
        fechaReporte: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen, reset]);

  const handleLocationChange = (data: LocationData) => {
    setValue("direccion", data.address);
    if (data.lat != null) setValue("latitud", String(data.lat));
    if (data.lng != null) setValue("longitud", String(data.lng));
  };

  const onSubmit = async (data: RegistrarSiniestroForm) => {
    try {
      const payload: CreateSiniestro = {
        idPoliza,
        registradoPor,
        tipoSiniestro: data.tipoSiniestro,
        estado: data.estado || undefined,
        fechaOcurrencia: data.fechaOcurrencia,
        fechaReporte: data.fechaReporte,
        fechaResolucion: data.fechaResolucion || undefined,
        descripcion: data.descripcion,
        numeroSiniestroCompania: data.numeroSiniestroCompania || undefined,
        direccion: data.direccion || undefined,
        latitud: data.latitud ? parseFloat(data.latitud) : undefined,
        longitud: data.longitud ? parseFloat(data.longitud) : undefined,
        montoReclamado: data.montoReclamado
          ? parseFloat(data.montoReclamado)
          : undefined,
        montoAprobado: data.montoAprobado
          ? parseFloat(data.montoAprobado)
          : undefined,
        montoDeducible: data.montoDeducible
          ? parseFloat(data.montoDeducible)
          : undefined,
        moneda: data.moneda,
        ajustador: data.ajustador || undefined,
        observaciones: data.observaciones || undefined,
      };

      await createMutation.mutateAsync(payload);
      toast.success("Siniestro registrado correctamente");
      onClose();
    } catch {
      toast.error("Error al registrar el siniestro");
    }
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Registrar Siniestro" onClose={onClose} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            {/* Tipo y Estado */}
            <FormGroupDivisor>
              <FormGroup>
                <Label required>Tipo de Siniestro</Label>
                <Controller
                  name="tipoSiniestro"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoSiniestroOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tipoSiniestro && (
                  <span className="text-xs text-red-500">
                    Este campo es requerido
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label required>Estado</Label>
                <Controller
                  name="estado"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoSiniestroOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
            </FormGroupDivisor>

            {/* Fechas */}
            <FormGroupDivisor>
              <FormGroup>
                <Label required htmlFor="fechaOcurrencia">
                  Fecha de Ocurrencia
                </Label>
                <Input
                  id="fechaOcurrencia"
                  type="date"
                  {...register("fechaOcurrencia", { required: true })}
                />
                {errors.fechaOcurrencia && (
                  <span className="text-xs text-red-500">
                    Este campo es requerido
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label required htmlFor="fechaReporte">
                  Fecha de Reporte
                </Label>
                <Input
                  id="fechaReporte"
                  type="date"
                  {...register("fechaReporte", { required: true })}
                />
                {errors.fechaReporte && (
                  <span className="text-xs text-red-500">
                    Este campo es requerido
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="fechaResolucion">
                  Fecha de Resolución (Opcional)
                </Label>
                <Input
                  id="fechaResolucion"
                  type="date"
                  {...register("fechaResolucion")}
                />
              </FormGroup>
            </FormGroupDivisor>

            {/* Descripción */}
            <FormGroup>
              <Label required htmlFor="descripcion">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el siniestro..."
                {...register("descripcion", { required: true })}
                rows={3}
              />
              {errors.descripcion && (
                <span className="text-xs text-red-500">
                  Este campo es requerido
                </span>
              )}
            </FormGroup>

            {/* Número compañía */}
            <FormGroup>
              <Label htmlFor="numeroSiniestroCompania">
                N° Siniestro Compañía (Opcional)
              </Label>
              <Input
                id="numeroSiniestroCompania"
                placeholder="Número asignado por la compañía"
                {...register("numeroSiniestroCompania")}
              />
            </FormGroup>

            {/* Ubicación */}
            <FormGroup>
              <Label>Dirección del Siniestro (Opcional)</Label>
              <Controller
                name="direccion"
                control={control}
                render={({ field }) => (
                  <LocationInput
                    value={field.value}
                    onChange={handleLocationChange}
                  />
                )}
              />
            </FormGroup>

            {/* Montos */}
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="montoReclamado">Monto Reclamado</Label>
                <Input
                  id="montoReclamado"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("montoReclamado")}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="montoAprobado">Monto Aprobado</Label>
                <Input
                  id="montoAprobado"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("montoAprobado")}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="montoDeducible">Deducible</Label>
                <Input
                  id="montoDeducible"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("montoDeducible")}
                />
              </FormGroup>
            </FormGroupDivisor>

            {/* Moneda */}
            <FormGroup>
              <Label required>Moneda</Label>
              <Controller
                name="moneda"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona la moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      {monedaOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormGroup>

            {/* Ajustador y Observaciones */}
            {/* <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="ajustador">Ajustador (Opcional)</Label>
                <Input
                  id="ajustador"
                  placeholder="Nombre del ajustador"
                  {...register("ajustador")}
                />
              </FormGroup>
            </FormGroupDivisor> */}

            <FormGroup>
              <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
              <Textarea
                id="observaciones"
                placeholder="Observaciones adicionales..."
                {...register("observaciones")}
                rows={3}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              {createMutation.isPending ? "Guardando..." : "Guardar"}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
