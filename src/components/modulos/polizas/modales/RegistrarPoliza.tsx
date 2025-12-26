import { useEffect } from "react";
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
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import type { CreatePolizaDto } from "@/types/poliza.interface";
import { useCompanias } from "@/hooks/useCompanias";
import { useRamos } from "@/hooks/useRamos";

interface RegistrarPolizaProps {
  isOpen: boolean;
  onClose: () => void;
  addPoliza: (data: CreatePolizaDto) => Promise<void>;
  idCliente: string;
  idUsuario: string;
}

export const RegistrarPoliza = ({
  isOpen,
  onClose,
  addPoliza,
  idCliente,
  idUsuario,
}: RegistrarPolizaProps) => {
  const { companias } = useCompanias();
  const { ramos } = useRamos();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreatePolizaDto>({
    defaultValues: {
      numeroPoliza: "",
      nombreAsegurado: "",
      idCliente: idCliente,
      registradoPor: idUsuario,
      idCompania: "",
      idProducto: "",
      idRamo: "",
      fechaEmision: "",
      fechaInicio: "",
      fechaFin: "",
      estado: "VIGENTE",
      moneda: "PEN",
      comisionBroker: 0,
      comisionAgente: 0,
      tipoVigencia: "ANUAL",
      descripcion: "",
    },
  });

  // Resetear formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      reset();
    } else {
      // Actualizar idCliente e idUsuario cuando se abre el modal
      reset({
        numeroPoliza: "",
        nombreAsegurado: "",
        idCliente: idCliente,
        registradoPor: idUsuario,
        idCompania: "",
        idProducto: "",
        idRamo: "",
        fechaEmision: "",
        fechaInicio: "",
        fechaFin: "",
        estado: "VIGENTE",
        moneda: "PEN",
        comisionBroker: 0,
        comisionAgente: 0,
        tipoVigencia: "ANUAL",
        descripcion: "",
      });
    }
  }, [isOpen, reset, idCliente, idUsuario]);

  const onSubmit = async (data: CreatePolizaDto) => {
    await addPoliza(data);
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose} size="xl">
      <Modal>
        <ModalHeader title="Registrar Nueva Póliza" onClose={onClose} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="numeroPoliza">Número de Póliza</Label>
                <Input
                  id="numeroPoliza"
                  placeholder="Ej: POL-2024-001"
                  {...register("numeroPoliza", { required: true })}
                />
                {errors.numeroPoliza && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="nombreAsegurado">Nombre Asegurado</Label>
                <Input
                  id="nombreAsegurado"
                  placeholder="Ej: Juan Pérez"
                  {...register("nombreAsegurado", { required: true })}
                />
                {errors.nombreAsegurado && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="idCompania">Compañía</Label>
                <Controller
                  name="idCompania"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {companias.map((compania) => (
                          <SelectItem
                            key={compania.idCompania}
                            value={compania.idCompania}
                          >
                            {compania.nombreComercial}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.idCompania && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="idRamo">Ramo</Label>
                <Controller
                  name="idRamo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ramos.map((ramo) => (
                          <SelectItem key={ramo.idRamo} value={ramo.idRamo}>
                            {ramo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.idRamo && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="idProducto">Producto</Label>
                <Input
                  id="idProducto"
                  placeholder="ID del producto"
                  {...register("idProducto", { required: true })}
                />
                {errors.idProducto && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="fechaEmision">Fecha Emisión</Label>
                <Input
                  id="fechaEmision"
                  type="date"
                  {...register("fechaEmision", { required: true })}
                />
                {errors.fechaEmision && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  {...register("fechaInicio", { required: true })}
                />
                {errors.fechaInicio && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  {...register("fechaFin", { required: true })}
                />
                {errors.fechaFin && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="estado">Estado</Label>
                <Controller
                  name="estado"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIGENTE">Vigente</SelectItem>
                        <SelectItem value="VENCIDA">Vencida</SelectItem>
                        <SelectItem value="CANCELADA">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="tipoVigencia">Tipo de Vigencia</Label>
                <Controller
                  name="tipoVigencia"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ANUAL">Anual</SelectItem>
                        <SelectItem value="SEMESTRAL">Semestral</SelectItem>
                        <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                        <SelectItem value="MENSUAL">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="moneda">Moneda</Label>
                <Controller
                  name="moneda"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PEN">PEN - Soles</SelectItem>
                        <SelectItem value="USD">USD - Dólares</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="comisionBroker">Comisión Broker</Label>
                <Input
                  id="comisionBroker"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("comisionBroker", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
                {errors.comisionBroker && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="comisionAgente">Comisión Agente</Label>
                <Input
                  id="comisionAgente"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("comisionAgente", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
                {errors.comisionAgente && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroup>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Detalles adicionales de la póliza..."
                rows={3}
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
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              Guardar
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  );
};

