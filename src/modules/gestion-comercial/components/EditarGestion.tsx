import {
  Modal,
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  FormGroup,
  FormGroupDivisor,
} from "@/components/shared";
import {
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import {
  gestionCanalOptions,
  gestionEstadoOptions,
  gestionPrioridadOptions,
  gestionTipoOptions,
  type Gestion,
  type UpdateGestion,
} from "../gestion-comercial.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateGestion) => Promise<void>;
  gestion: Gestion;
}

const formatDatetimeLocal = (fecha?: string) => {
  if (!fecha) return "";
  return dayjs(fecha).format("YYYY-MM-DDTHH:mm");
};

export const EditarGestion = ({
  isOpen,
  onClose,
  onSubmit,
  gestion,
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateGestion>({
    defaultValues: {
      tipo: gestion.tipo,
      estado: gestion.estado,
      prioridad: gestion.prioridad,
      canal: gestion.canal,
      descripcion: gestion.descripcion || "",
      fechaProgramada: formatDatetimeLocal(gestion.fechaProgramada),
      fechaVencimiento: formatDatetimeLocal(gestion.fechaVencimiento),
      meetLink: gestion.meetLink || "",
      idCliente: gestion.idCliente,
      idPoliza: gestion.idPoliza || "",
      idSiniestro: gestion.idSiniestro || "",
    },
  });

  const handleFormSubmit = async (data: UpdateGestion) => {
    const payload: UpdateGestion = {
      ...data,
      idPoliza: data.idPoliza || undefined,
      idSiniestro: data.idSiniestro || undefined,
      meetLink: data.meetLink || undefined,
      fechaProgramada: data.fechaProgramada || undefined,
      fechaVencimiento: data.fechaVencimiento || undefined,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="lg">
      <Modal>
        <ModalHeader title="Editar Gestión" onClose={onClose} />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            {/* Tipo + Canal */}
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="tipo">Tipo de Gestión</Label>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {gestionTipoOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="canal">Canal</Label>
                <Controller
                  name="canal"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el canal" />
                      </SelectTrigger>
                      <SelectContent>
                        {gestionCanalOptions.map((opt) => (
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

            {/* Descripción */}
            <FormGroup>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe la gestión..."
                rows={3}
                {...register("descripcion")}
              />
            </FormGroup>

            {/* Prioridad + Estado */}
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="prioridad">Prioridad</Label>
                <Controller
                  name="prioridad"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        {gestionPrioridadOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="estado">Estado</Label>
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        {gestionEstadoOptions.map((opt) => (
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
                <Label htmlFor="fechaProgramada">Fecha Programada</Label>
                <Input
                  id="fechaProgramada"
                  type="datetime-local"
                  {...register("fechaProgramada")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                <Input
                  id="fechaVencimiento"
                  type="datetime-local"
                  {...register("fechaVencimiento")}
                />
              </FormGroup>
            </FormGroupDivisor>

            {/* ID Cliente */}
            <FormGroup>
              <Label htmlFor="idCliente">ID Cliente</Label>
              <Input
                id="idCliente"
                placeholder="UUID del cliente"
                {...register("idCliente", { required: true })}
              />
              {errors.idCliente && (
                <span className="text-xs text-red-500">Campo requerido</span>
              )}
            </FormGroup>

            {/* Meet link */}
            <FormGroup>
              <Label htmlFor="meetLink">Enlace de Reunión (opcional)</Label>
              <Input
                id="meetLink"
                placeholder="https://meet.google.com/..."
                {...register("meetLink")}
              />
            </FormGroup>

            {/* IDs opcionales */}
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="idPoliza">ID Póliza (opcional)</Label>
                <Input
                  id="idPoliza"
                  placeholder="UUID de la póliza"
                  {...register("idPoliza")}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="idSiniestro">ID Siniestro (opcional)</Label>
                <Input
                  id="idSiniestro"
                  placeholder="UUID del siniestro"
                  {...register("idSiniestro")}
                />
              </FormGroup>
            </FormGroupDivisor>
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
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              Guardar Cambios
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};
