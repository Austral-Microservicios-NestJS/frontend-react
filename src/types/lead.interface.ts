// ==================== INTERFACES PRINCIPALES ====================

export interface Lead {
  idLead: string;
  nombre: string;
  email?: string;
  telefono?: string;
  empresa?: string;
  cargo?: string;
  fuente: FuenteLead;
  estado: EstadoLead;
  valorEstimado?: string;
  notas?: string;
  asignadoA?: string;
  prioridad: PrioridadLead;
  tipoSeguro: TipoSeguro;
  etiquetas?: string[] | null;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
  fechaUltimoCambioEstado: string;
  detalleAuto?: DetalleAuto | null;
  detalleSalud?: DetalleSalud | null;
  detalleSCTR?: DetalleSCTR | null;
  detalleVida?: DetalleVida | null;
  detalleVidaLey?: DetalleVidaLey | null;
  detalleSoat?: DetalleSoat | null;
}

// ==================== DETALLES POR TIPO DE SEGURO ====================

export interface DetalleAuto {
  idDetalleAuto: string;
  idLead: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  usoVehiculo: UsoVehiculo;
  valorComercial: string;
  numeroPasajeros: number;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface DetalleSalud {
  idDetalleSalud: string;
  idLead: string;
  edad: number;
  genero: Genero;
  enfermedadesPreexistentes: string[];
  tipoCobertura: TipoCobertura;
  incluirFamilia: boolean;
  numeroDependientes: number;
  tuvoSeguroAntes: boolean;
  clinicaPreferencia?: string;
  coberturaGeografica?: string;
  preferenciaReembolso?: string;
  presupuestoMensual?: string;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface DetalleSCTR {
  idDetalleSCTR: string;
  idLead: string;
  rucEmpresa: string;
  razonSocial: string;
  numeroTrabajadores: number;
  actividadEconomica: string;
  tipoRiesgo: TipoRiesgo;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface DetalleVida {
  idDetalleVida: string;
  idLead: string;
  edad: number;
  ocupacion: string;
  sumaAsegurada: string;
  beneficiarios: any;
  fuma: boolean;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface DetalleVidaLey {
  idDetalleVidaLey: string;
  idLead: string;
  rucEmpresa: string;
  razonSocial: string;
  numeroEmpleadosPlanilla: number;
  planillaMensual: string;
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface DetalleSoat {
  idDetalleSoat: string;
  idLead: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  usoVehiculo: UsoVehiculo;
  zona?: string;
  valorComercial?: string;
  aseguradoras?: string[];
  disponible: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

// ==================== DTOs ====================

export interface CreateLead {
  nombre: string;
  email?: string;
  telefono?: string;
  empresa?: string;
  cargo?: string;
  fuente: FuenteLead;
  estado?: EstadoLead;
  valorEstimado?: string;
  notas?: string;
  prioridad?: PrioridadLead;
  tipoSeguro: TipoSeguro;
}

export interface UpdateLead extends Partial<CreateLead> {}

// ==================== ENUMS ====================

export enum EstadoLead {
  NUEVO      = "NUEVO",
  CONTACTADO = "CONTACTADO",
  COTIZADO   = "COTIZADO",
  EMITIDO    = "EMITIDO",
  CERRADO    = "CERRADO",
  PERDIDO    = "PERDIDO",
}

export enum PrioridadLead {
  ALTA  = "ALTA",
  MEDIA = "MEDIA",
  BAJA  = "BAJA",
}

export enum FuenteLead {
  FORMULARIO_WEB    = "FORMULARIO_WEB",
  FORMULARIO_GOOGLE = "FORMULARIO_GOOGLE",
  LLAMADA_TELEFONICA = "LLAMADA_TELEFONICA",
  EMAIL             = "EMAIL",
  WHATSAPP          = "WHATSAPP",
  FACEBOOK          = "FACEBOOK",
  INSTAGRAM         = "INSTAGRAM",
  LINKEDIN          = "LINKEDIN",
  REFERIDO          = "REFERIDO",
  EVENTO            = "EVENTO",
  OTRO              = "OTRO",
}

export enum TipoSeguro {
  // Seguros de personas
  VEHICULAR             = "VEHICULAR",
  SALUD                 = "SALUD",
  EPS                   = "EPS",
  SCTR_PENSION          = "SCTR_PENSION",
  SCTR_SALUD            = "SCTR_SALUD",
  VIDA_LEY              = "VIDA_LEY",
  SOAT                  = "SOAT",
  ACCIDENTES            = "ACCIDENTES",

  // Seguros patrimoniales
  HOGAR                 = "HOGAR",
  MULTIRRIESGO          = "MULTIRRIESGO",
  TREC                  = "TREC",         // Todo Riesgo Equipo Contratistas
  CAR                   = "CAR",           // Contractor's All Risk
  EAR                   = "EAR",           // Erection All Risk
  FOLA                  = "FOLA",

  // Responsabilidades
  RESPONSABILIDAD_CIVIL = "RESPONSABILIDAD_CIVIL",
  RC_HIDROCARBUROS      = "RC_HIDROCARBUROS",

  // Transportes y fianzas
  TRANSPORTE_NACIONAL      = "TRANSPORTE_NACIONAL",
  TRANSPORTE_INTERNACIONAL = "TRANSPORTE_INTERNACIONAL",
  CARTA_FIANZA             = "CARTA_FIANZA",

  OTRO = "OTRO",
}

export enum UsoVehiculo {
  PARTICULAR = "PARTICULAR",
  COMERCIAL  = "COMERCIAL",
  TAXI       = "TAXI",
  CARGA      = "CARGA",
}

export enum Genero {
  MASCULINO = "MASCULINO",
  FEMENINO  = "FEMENINO",
  OTRO      = "OTRO",
}

export enum TipoCobertura {
  BASICO      = "BASICO",
  INTERMEDIO  = "INTERMEDIO",
  COMPLETO    = "COMPLETO",
}

export enum TipoRiesgo {
  BAJO  = "BAJO",
  MEDIO = "MEDIO",
  ALTO  = "ALTO",
}

// ==================== OPTIONS PARA SELECTORES ====================

export const estadoLeadOptions = [
  { value: EstadoLead.NUEVO,      label: "Nuevo",      color: "bg-indigo-500" },
  { value: EstadoLead.CONTACTADO, label: "Contactado", color: "bg-blue-500" },
  { value: EstadoLead.COTIZADO,   label: "Cotizado",   color: "bg-violet-500" },
  { value: EstadoLead.EMITIDO,    label: "Emitido",    color: "bg-orange-500" },
  { value: EstadoLead.CERRADO,    label: "Cerrado",    color: "bg-emerald-500" },
  { value: EstadoLead.PERDIDO,    label: "Perdido",    color: "bg-rose-500" },
] as const;

export const prioridadLeadOptions = [
  { value: PrioridadLead.ALTA,  label: "Alta",  color: "bg-red-500" },
  { value: PrioridadLead.MEDIA, label: "Media", color: "bg-yellow-500" },
  { value: PrioridadLead.BAJA,  label: "Baja",  color: "bg-green-500" },
] as const;

export const fuenteLeadOptions = [
  { value: FuenteLead.FORMULARIO_WEB,     label: "Formulario Web" },
  { value: FuenteLead.FORMULARIO_GOOGLE,  label: "Formulario Google" },
  { value: FuenteLead.LLAMADA_TELEFONICA, label: "Llamada Telefónica" },
  { value: FuenteLead.EMAIL,              label: "Email" },
  { value: FuenteLead.WHATSAPP,           label: "WhatsApp" },
  { value: FuenteLead.FACEBOOK,           label: "Facebook" },
  { value: FuenteLead.INSTAGRAM,          label: "Instagram" },
  { value: FuenteLead.LINKEDIN,           label: "LinkedIn" },
  { value: FuenteLead.REFERIDO,           label: "Referido" },
  { value: FuenteLead.EVENTO,             label: "Evento" },
  { value: FuenteLead.OTRO,               label: "Otro" },
] as const;

export const tipoSeguroOptions = [
  // Personas
  { value: TipoSeguro.VEHICULAR,             label: "Vehicular",                         group: "Personas" },
  { value: TipoSeguro.SALUD,                 label: "Salud",                             group: "Personas" },
  { value: TipoSeguro.EPS,                   label: "EPS",                               group: "Personas" },
  { value: TipoSeguro.SCTR_PENSION,          label: "SCTR Pensión",                      group: "Personas" },
  { value: TipoSeguro.SCTR_SALUD,            label: "SCTR Salud",                        group: "Personas" },
  { value: TipoSeguro.VIDA_LEY,              label: "Vida Ley",                          group: "Personas" },
  { value: TipoSeguro.SOAT,                  label: "SOAT",                              group: "Personas" },
  { value: TipoSeguro.ACCIDENTES,            label: "Accidentes Personales",             group: "Personas" },
  // Patrimoniales
  { value: TipoSeguro.HOGAR,                 label: "Hogar",                             group: "Patrimoniales" },
  { value: TipoSeguro.MULTIRRIESGO,          label: "Multiriesgo",                       group: "Patrimoniales" },
  { value: TipoSeguro.TREC,                  label: "TREC (Todo Riesgo Equipo Contratistas)", group: "Patrimoniales" },
  { value: TipoSeguro.CAR,                   label: "CAR (Contractor's All Risk)",       group: "Patrimoniales" },
  { value: TipoSeguro.EAR,                   label: "EAR (Erection All Risk)",           group: "Patrimoniales" },
  { value: TipoSeguro.FOLA,                  label: "FOLA",                              group: "Patrimoniales" },
  // Responsabilidades
  { value: TipoSeguro.RESPONSABILIDAD_CIVIL, label: "Responsabilidad Civil",             group: "Responsabilidades" },
  { value: TipoSeguro.RC_HIDROCARBUROS,      label: "RC Hidrocarburos",                  group: "Responsabilidades" },
  // Transportes y fianzas
  { value: TipoSeguro.TRANSPORTE_NACIONAL,      label: "Transporte Nacional",            group: "Transporte" },
  { value: TipoSeguro.TRANSPORTE_INTERNACIONAL, label: "Transporte Internacional",       group: "Transporte" },
  { value: TipoSeguro.CARTA_FIANZA,             label: "Carta Fianza",                   group: "Transporte" },
  // General
  { value: TipoSeguro.OTRO,                  label: "Otro",                              group: "General" },
] as const;
