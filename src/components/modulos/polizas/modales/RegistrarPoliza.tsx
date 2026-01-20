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
import {
  type CreatePolizaDto,
  tipoVigenciaOptions,
  TipoVigencia,
} from "@/types/poliza.interface";
import type { Cliente } from "@/types/cliente.interface";
import { useCompanias } from "@/hooks/useCompanias";
import { useRamos } from "@/hooks/useRamos";
import { productoApi } from "@/services/producto.service";
import { asignacionApi } from "@/services/asignacion.service";
import { usuarioApi } from "@/services/usuario.service";
import { useAuthStore } from "@/store/auth.store";
import dayjs from "dayjs";

interface RegistrarPolizaProps {
  isOpen: boolean;
  onClose: () => void;
  addPoliza: (data: CreatePolizaDto) => Promise<void>;
  idCliente: string;
  idUsuario: string;
  cliente?: Cliente;
}

export const RegistrarPoliza = ({
  isOpen,
  onClose,
  addPoliza,
  idCliente,
  idUsuario,
  cliente,
}: RegistrarPolizaProps) => {
  const { companias } = useCompanias();
  const { ramos } = useRamos();
  const { user } = useAuthStore();

  // Obtener el rol del usuario
  const userRole = user?.rol.nombreRol || "";
  const isAdmin = userRole === "ADMINISTRADOR";
  const isBroker = userRole === "BROKER";
  const isAgent = userRole === "AGENTE";

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
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
      idBroker: "",
      idAgente: "",
      fechaEmision: new Date().toISOString().split("T")[0],
      vigenciaInicio: "",
      vigenciaFin: "",
      estado: "VIGENTE",
      moneda: "PEN",
      comisionBroker: 0,
      comisionAgente: 0,
      tipoVigencia: TipoVigencia.ANUAL,
      descripcion: "",
    },
  });

  // Observar cambios en idRamo para filtrar productos
  const watchIdRamo = watch("idRamo");
  const watchTipoVigencia = watch("tipoVigencia");
  const watchVigenciaInicio = watch("vigenciaInicio");
  const watchIdBroker = watch("idBroker");
  const watchIdAgente = watch("idAgente");

  // Obtener productos del ramo seleccionado
  const { data: productos = [] } = productoApi.useGetByRamo(watchIdRamo || "");

  // Obtener brokers para admin
  const { data: brokers = [] } = usuarioApi.useGetBrokersBySupervisor(
    isAdmin ? user?.idUsuario || "" : ""
  );

  // Obtener subordinados según el rol
  // ADMIN: obtiene sus brokers directos (ya obtenido arriba)
  // BROKER: obtiene sus agentes
  const { data: subordinados = [] } = asignacionApi.useGetSubordinados(
    isAdmin ? "" : isBroker ? user?.idUsuario || "" : ""
  );

  // Obtener agentes del broker seleccionado (solo para ADMIN)
  const { data: agentesDelBroker = [] } = asignacionApi.useGetSubordinados(
    isAdmin && watchIdBroker ? watchIdBroker : ""
  );

  // Obtener supervisor (para agentes) para pre-llenar broker
  const { data: supervisorAsignacion } = asignacionApi.useGetSupervisor(
    isAgent ? user?.idUsuario || "" : ""
  );

  // Resetear formulario cuando el modal se cierra o abre
  useEffect(() => {
    if (!isOpen) {
      reset();
    } else {
      // Auto-completar nombreAsegurado con el nombre del cliente
      const nombreAsegurado = cliente
        ? cliente.tipoPersona === "JURIDICO"
          ? cliente.razonSocial
          : `${cliente.nombres || ""} ${cliente.apellidos || ""}`.trim()
        : "";

      // Reset con valores iniciales conocidos
      reset({
        numeroPoliza: "",
        nombreAsegurado: nombreAsegurado,
        idCliente: idCliente,
        registradoPor: idUsuario,
        idCompania: "",
        idProducto: "",
        idRamo: "",
        idBroker: "",
        idAgente: "",
        fechaEmision: new Date().toISOString().split("T")[0],
        vigenciaInicio: "",
        vigenciaFin: "",
        estado: "VIGENTE",
        moneda: "PEN",
        comisionBroker: 0,
        comisionAgente: 0,
        tipoVigencia: TipoVigencia.ANUAL,
        descripcion: "",
      });
    }
  }, [isOpen, reset, idCliente, idUsuario, cliente]);

  // Establecer idBroker cuando el modal está abierto y el usuario es BROKER
  useEffect(() => {
    if (isOpen && isBroker && user?.idUsuario) {
      setValue("idBroker", user.idUsuario, { shouldValidate: true });
    }
  }, [isOpen, isBroker, user, setValue]);

  // Establecer idAgente e idBroker cuando el modal está abierto y el usuario es AGENTE
  useEffect(() => {
    if (isOpen && isAgent && user?.idUsuario) {
      setValue("idAgente", user.idUsuario, { shouldValidate: true });
      
      // Esperar a que llegue la información del supervisor
      if (supervisorAsignacion?.supervisor?.idUsuario) {
        setValue("idBroker", supervisorAsignacion.supervisor.idUsuario, { shouldValidate: true });
      }
    }
  }, [isOpen, isAgent, user, supervisorAsignacion, setValue]);

  // Limpiar idProducto cuando cambia el ramo
  useEffect(() => {
    if (watchIdRamo) {
      setValue("idProducto", "");
    }
  }, [watchIdRamo, setValue]);

  // Calcular fechas automáticamente según tipoVigencia
  useEffect(() => {
    if (watchTipoVigencia === TipoVigencia.ANUAL || watchTipoVigencia === TipoVigencia.DECLARACION_MENSUAL) {
      // Si no hay vigenciaInicio, establecer hoy
      if (!watchVigenciaInicio) {
        const hoy = dayjs().format("YYYY-MM-DD");
        setValue("vigenciaInicio", hoy);
        
        // Calcular vigenciaFin
        if (watchTipoVigencia === TipoVigencia.ANUAL) {
          const vigenciaFin = dayjs().add(1, "year").format("YYYY-MM-DD");
          setValue("vigenciaFin", vigenciaFin);
        } else if (watchTipoVigencia === TipoVigencia.DECLARACION_MENSUAL) {
          const vigenciaFin = dayjs().add(1, "month").format("YYYY-MM-DD");
          setValue("vigenciaFin", vigenciaFin);
        }
      }
    }
  }, [watchTipoVigencia, watchVigenciaInicio, setValue]);

  // Actualizar vigenciaFin cuando cambia vigenciaInicio manualmente
  useEffect(() => {
    if (watchVigenciaInicio && (watchTipoVigencia === TipoVigencia.ANUAL || watchTipoVigencia === TipoVigencia.DECLARACION_MENSUAL)) {
      if (watchTipoVigencia === TipoVigencia.ANUAL) {
        const vigenciaFin = dayjs(watchVigenciaInicio).add(1, "year").format("YYYY-MM-DD");
        setValue("vigenciaFin", vigenciaFin);
      } else if (watchTipoVigencia === TipoVigencia.DECLARACION_MENSUAL) {
        const vigenciaFin = dayjs(watchVigenciaInicio).add(1, "month").format("YYYY-MM-DD");
        setValue("vigenciaFin", vigenciaFin);
      }
    }
  }, [watchVigenciaInicio, watchTipoVigencia, setValue]);

  // Auto-poblar comisiones cuando se selecciona broker
  useEffect(() => {
    if (watchIdBroker && isAdmin) {
      const selectedBroker = brokers.find(b => b.idUsuario === watchIdBroker);
      if (selectedBroker) {
        setValue("comisionBroker", selectedBroker.porcentajeComision);
      }
    }

    // Para BROKER: usar su propia asignación con el supervisor
    if (isBroker && watchIdBroker === user?.idUsuario) {
      // Obtener supervisor del broker para obtener su comisión
      asignacionApi.getSupervisor(user.idUsuario).then((data) => {
        if (data) {
          setValue("comisionBroker", data.porcentajeComision);
        }
      });
    }

    // Para AGENTE: usar la comisión del broker desde supervisorAsignacion
    if (isAgent && supervisorAsignacion) {
      // El broker del agente es su supervisor
      // Necesitamos obtener la comisión del broker (supervisor del agente)
      // que viene de la asignación ADMIN->BROKER
      if (supervisorAsignacion.supervisor.idUsuario === watchIdBroker) {
        asignacionApi.getSupervisor(watchIdBroker).then((data) => {
          if (data) {
            setValue("comisionBroker", data.porcentajeComision);
          }
        });
      }
    }
  }, [watchIdBroker, brokers, isAdmin, isBroker, isAgent, supervisorAsignacion, user, setValue]);

  // Auto-poblar comisión de agente cuando se selecciona
  useEffect(() => {
    if (watchIdAgente) {
      // Para ADMINISTRADOR: buscar asignación del agente en agentesDelBroker
      if (isAdmin && agentesDelBroker.length > 0) {
        const agenteAsignacion = agentesDelBroker.find(
          (asig) => asig.subordinado.idUsuario === watchIdAgente
        );
        
        if (agenteAsignacion) {
          setValue("comisionAgente", agenteAsignacion.porcentajeComision);
        }
      }

      // Para BROKER: buscar asignación del agente en subordinados
      if (isBroker && subordinados.length > 0) {
        const agenteAsignacion = subordinados.find(
          (asig) => asig.subordinado.idUsuario === watchIdAgente
        );
        
        if (agenteAsignacion) {
          setValue("comisionAgente", agenteAsignacion.porcentajeComision);
        }
      }

      // Para AGENTE: su propia comisión viene de su asignación con el supervisor
      if (isAgent && watchIdAgente === user?.idUsuario && supervisorAsignacion) {
        setValue("comisionAgente", supervisorAsignacion.porcentajeComision);
      }
    }
  }, [watchIdAgente, agentesDelBroker, subordinados, isAdmin, isBroker, isAgent, supervisorAsignacion, user, setValue]);

  const onSubmit = async (data: CreatePolizaDto) => {
    const dataToSend = {
      ...data,
      idBroker: data.idBroker || null,
      idAgente: data.idAgente || null,
    };
    console.log(dataToSend);
    await addPoliza(dataToSend);
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
                <Controller
                  name="idProducto"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchIdRamo}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            watchIdRamo
                              ? "Seleccionar..."
                              : "Seleccione un ramo primero"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {productos.map((producto) => (
                          <SelectItem
                            key={producto.idProducto}
                            value={producto.idProducto}
                          >
                            {producto.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.idProducto && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

            <FormGroupDivisor columns={3}>
              <FormGroup>
                <Label htmlFor="tipoVigencia">Tipo de Vigencia</Label>
                <Controller
                  name="tipoVigencia"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoVigenciaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="vigenciaInicio">Inicio de Vigencia</Label>
                <Input
                  id="vigenciaInicio"
                  type="date"
                  {...register("vigenciaInicio", { required: true })}
                />
                {errors.vigenciaInicio && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="vigenciaFin">Fin de Vigencia</Label>
                <Input
                  id="vigenciaFin"
                  type="date"
                  {...register("vigenciaFin", { required: true })}
                />
                {errors.vigenciaFin && (
                  <span className="text-xs text-red-500">Campo requerido</span>
                )}
              </FormGroup>
            </FormGroupDivisor>

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

            <FormGroupDivisor>
              <FormGroup>
                <Label htmlFor="idBroker">Broker</Label>
                {isAdmin ? (
                  <Controller
                    name="idBroker"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar broker..." />
                        </SelectTrigger>
                        <SelectContent>
                          {brokers.map((broker) => (
                            <SelectItem
                              key={broker.idUsuario}
                              value={broker.idUsuario}
                            >
                              {broker.nombreUsuario}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <>
                    <Input
                      value={
                        isBroker
                          ? user?.nombreUsuario || ""
                          : supervisorAsignacion?.supervisor.nombreUsuario || "Cargando..."
                      }
                      disabled
                      className="bg-gray-50"
                    />
                    <input type="hidden" {...register("idBroker")} />
                  </>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="idAgente">Agente</Label>
                {isAgent ? (
                  <>
                    <Input
                      value={user?.nombreUsuario || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <input type="hidden" {...register("idAgente")} />
                  </>
                ) : (
                  <Controller
                    name="idAgente"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={isAdmin && !watchIdBroker}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              isAdmin && !watchIdBroker
                                ? "Seleccione un broker primero"
                                : "Seleccionar agente..."
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Para ADMIN: mostrar agentes del broker seleccionado */}
                          {isAdmin &&
                            agentesDelBroker
                              .filter(
                                (asig) => asig.subordinado.rol?.nombreRol === "AGENTE"
                              )
                              .map((asig) => (
                                <SelectItem
                                  key={asig.subordinado.idUsuario}
                                  value={asig.subordinado.idUsuario}
                                >
                                  {asig.subordinado.nombreUsuario} (
                                  {asig.porcentajeComision}%)
                                </SelectItem>
                              ))}
                          {/* Para BROKER: mostrar sus propios agentes */}
                          {isBroker &&
                            subordinados
                              .filter(
                                (asig) => asig.subordinado.rol?.nombreRol === "AGENTE"
                              )
                              .map((asig) => (
                                <SelectItem
                                  key={asig.subordinado.idUsuario}
                                  value={asig.subordinado.idUsuario}
                                >
                                  {asig.subordinado.nombreUsuario} (
                                  {asig.porcentajeComision}%)
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
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
                placeholder="Breve descripción de lo que asegura..."
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
