import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  FormGroupDivisor,
  SubmitButtons,
  AppSelect,
  AppDatePickerField,
} from "@/components/shared";
import { Input, Label, Textarea } from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { monedaOptions, Moneda } from "@/types/cliente-inversion.interface";
import { clienteInversionService } from "@/services/cliente-inversion.service";
import { toast } from "sonner";

interface RegistrarInversionProps {
  isOpen: boolean;
  onClose: () => void;
  idCliente: string;
  idUsuario?: string;
}

export const RegistrarInversion = ({
  isOpen,
  onClose,
  idCliente,
  idUsuario,
}: RegistrarInversionProps) => {
  const createMutation = clienteInversionService.useCreate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idCliente,
      monto: 0,
      moneda: Moneda.PEN,
      tipo: "",
      descripcion: "",
      fechaGasto: "",
      registradoPor: idUsuario || "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        monto: Number(data.monto),
      });
      toast.success("Inversión registrada exitosamente");
      onClose();
    } catch (error) {
      toast.error("Error al registrar la inversión");
      console.error(error);
    }
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Registrar Nueva Inversión" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="tipo">Tipo de Inversión</Label>
              <Input
                id="tipo"
                placeholder="Ej: Reunión de Negocios, Publicidad, Regalo"
                {...register("tipo", { required: true })}
              />
              {errors.tipo && (
                <span className="text-xs text-red-500">
                  Este campo es requerido
                </span>
              )}
            </FormGroup>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="monto">Monto</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("monto", { required: true, min: 0 })}
                />
                {errors.monto && (
                  <span className="text-xs text-red-500">
                    Ingrese un monto válido
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="moneda">Moneda</Label>
                <Controller
                  name="moneda"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <AppSelect
                      options={monedaOptions as any}
                      placeholder="Selecciona la moneda"
                      value={
                        monedaOptions.find((o) => o.value === field.value) ??
                        null
                      }
                      onChange={(opt) =>
                        field.onChange((opt as any)?.value ?? null)
                      }
                    />
                  )}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="fechaGasto">Fecha del Gasto</Label>
                <AppDatePickerField
                  control={control}
                  name="fechaGasto"
                  rules={{ required: true }}
                  id="fechaGasto"
                  placeholder="Selecciona la fecha"
                />
                {errors.fechaGasto && (
                  <span className="text-xs text-red-500">
                    Este campo es requerido
                  </span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="descripcion">Descripción (Opcional)</Label>
              <Textarea
                id="descripcion"
                placeholder="Detalles adicionales sobre la inversión"
                {...register("descripcion")}
                rows={5}
              />
            </FormGroup>
          </ModalBody>

          <SubmitButtons
            onClose={onClose}
            isSubmitting={createMutation.isPending}
          />
        </form>
      </Modal>
    </ModalContainer>
  );
};
