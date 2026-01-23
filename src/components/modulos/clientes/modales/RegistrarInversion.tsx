import {
  ModalContainer,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormGroupDivisor,
} from "@/components/shared";
import {
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from "@/components/ui";
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
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="fechaGasto">Fecha del Gasto</Label>
                <Input
                  id="fechaGasto"
                  type="date"
                  {...register("fechaGasto", { required: true })}
                />
                {errors.fechaGasto && (
                  <span className="text-xs text-red-500">
                    Este campo es requerido
                  </span>
                )}
              </FormGroup>

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
            </FormGroupDivisor>

            <FormGroupDivisor>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona la moneda" />
                      </SelectTrigger>
                      <SelectContent>
                        {monedaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="descripcion">Descripción (Opcional)</Label>
              <Textarea
                id="descripcion"
                placeholder="Detalles adicionales sobre la inversión"
                {...register("descripcion")}
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
              disabled={createMutation.isPending}
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
