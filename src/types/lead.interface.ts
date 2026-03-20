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
  comision?: string;
  idCliente?: string;
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
  comision?: string;
  idCliente?: string;
  notas?: string;
  prioridad?: PrioridadLead;
  tipoSeguro: TipoSeguro;
  // Detail sub-objects (sent with initial create when filled from the form)
  detalleAuto?: Partial<Omit<DetalleAuto, 'idDetalleAuto' | 'idLead' | 'disponible' | 'fechaCreacion' | 'fechaModificacion'>>;
  detalleSoat?: Partial<Omit<DetalleSoat, 'idDetalleSoat' | 'idLead' | 'disponible' | 'fechaCreacion' | 'fechaModificacion'>>;
  detalleSalud?: Partial<Omit<DetalleSalud, 'idDetalleSalud' | 'idLead' | 'disponible' | 'fechaCreacion' | 'fechaModificacion'>>;
  detalleSCTR?: Partial<Omit<DetalleSCTR, 'idDetalleSCTR' | 'idLead' | 'disponible' | 'fechaCreacion' | 'fechaModificacion'>>;
  detalleVida?: Partial<Omit<DetalleVida, 'idDetalleVida' | 'idLead' | 'disponible' | 'fechaCreacion' | 'fechaModificacion'>>;
  detalleVidaLey?: Partial<Omit<DetalleVidaLey, 'idDetalleVidaLey' | 'idLead' | 'disponible' | 'fechaCreacion' | 'fechaModificacion'>>;
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
  // Vehículos
  VEHICULAR = "VEHICULAR",
  SOAT      = "SOAT",

  // Personas y salud
  SALUD                   = "SALUD",
  EPS                     = "EPS",
  SCTR_PENSION            = "SCTR_PENSION",
  SCTR_SALUD              = "SCTR_SALUD",
  VIDA_LEY                = "VIDA_LEY",
  VIDA                    = "VIDA",
  ACCIDENTES              = "ACCIDENTES",
  ACCIDENTES_ESPECTACULOS = "ACCIDENTES_ESPECTACULOS",
  MASCOTAS                = "MASCOTAS",
  SEPELIO                 = "SEPELIO",
  ESTUDIANTIL             = "ESTUDIANTIL",
  SEGURO_VIAJE            = "SEGURO_VIAJE",
  DESGRAVAMEN             = "DESGRAVAMEN",
  BANCA_SEGURO            = "BANCA_SEGURO",

  // Patrimoniales
  HOGAR                  = "HOGAR",
  MULTIRRIESGO           = "MULTIRRIESGO",
  TREC                   = "TREC",
  CAR                    = "CAR",
  EAR                    = "EAR",
  FOLA                   = "FOLA",
  ROBO                   = "ROBO",
  DESHONESTIDAD          = "DESHONESTIDAD",
  CASCOS                 = "CASCOS",
  TRES_D                 = "TRES_D",
  CAR_SCTR_MULTIFAMILIAR = "CAR_SCTR_MULTIFAMILIAR",

  // Responsabilidad Civil — General
  RESPONSABILIDAD_CIVIL = "RESPONSABILIDAD_CIVIL",
  RC_PROFESIONAL        = "RC_PROFESIONAL",
  RC_HIDROCARBUROS      = "RC_HIDROCARBUROS",
  D_Y_O                 = "D_Y_O",
  LUCRO_CESANTE         = "LUCRO_CESANTE",
  EXTORSION_SECUESTRO   = "EXTORSION_SECUESTRO",

  // Responsabilidad Civil — Subtypes regulatorios SBS
  RC_RESIDUOS_SOLIDOS              = "RC_RESIDUOS_SOLIDOS",
  RC_ALMACENAMIENTO_HIDROCARBUROS  = "RC_ALMACENAMIENTO_HIDROCARBUROS",
  RC_TRANSPORTE_HIDROCARBUROS      = "RC_TRANSPORTE_HIDROCARBUROS",
  RC_GAS_LICUADO_AUTOMOTOR         = "RC_GAS_LICUADO_AUTOMOTOR",
  RC_COMERCIALIZACION_COMBUSTIBLES = "RC_COMERCIALIZACION_COMBUSTIBLES",
  RC_TRANSPORTE_RESIDUOS_PELIGROSOS = "RC_TRANSPORTE_RESIDUOS_PELIGROSOS",
  RC_GAS_LICUADO_GLP               = "RC_GAS_LICUADO_GLP",
  RC_INSTALADORAS_GAS_NATURAL      = "RC_INSTALADORAS_GAS_NATURAL",
  RC_TALLERES_GAS_NATURAL          = "RC_TALLERES_GAS_NATURAL",
  RC_VENTA_GAS_NATURAL             = "RC_VENTA_GAS_NATURAL",
  RC_DISTRIBUCION_GAS_NATURAL      = "RC_DISTRIBUCION_GAS_NATURAL",
  RC_CONSTRUCCION_GAS_NATURAL      = "RC_CONSTRUCCION_GAS_NATURAL",
  RC_DISTRIBUCION_GAS_DANOS        = "RC_DISTRIBUCION_GAS_DANOS",
  RC_TRANSPORTADOR_CARRETERA       = "RC_TRANSPORTADOR_CARRETERA",
  RC_PROPIETARIO_VEHICULO          = "RC_PROPIETARIO_VEHICULO",
  RC_ESPECTACULOS_DEPORTIVOS       = "RC_ESPECTACULOS_DEPORTIVOS",
  RC_CANES_PELIGROSOS              = "RC_CANES_PELIGROSOS",
  RC_AGD                           = "RC_AGD",

  // Transporte y logística
  TRANSPORTE_NACIONAL      = "TRANSPORTE_NACIONAL",
  TRANSPORTE_INTERNACIONAL = "TRANSPORTE_INTERNACIONAL",
  TRASLADO                 = "TRASLADO",

  // Garantías y crédito
  CARTA_FIANZA = "CARTA_FIANZA",
  CAUCION      = "CAUCION",
  CREDITO      = "CREDITO",

  // Energía e industria
  ENERGY_OIL_GAS    = "ENERGY_OIL_GAS",
  ENERGIA_RENOVABLE = "ENERGIA_RENOVABLE",
  PARAMETRICOS      = "PARAMETRICOS",
  SEGURO_AGRICOLA   = "SEGURO_AGRICOLA",
  SEGURO_PECUARIO   = "SEGURO_PECUARIO",

  // Tecnología
  CYBER = "CYBER",

  // Especiales
  SEGUROS_OBLIGATORIOS = "SEGUROS_OBLIGATORIOS",
  SEGUROS_ESPECIALES   = "SEGUROS_ESPECIALES",
  GENERAL              = "GENERAL",

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
  { value: FuenteLead.FORMULARIO_WEB,     label: "CRM" },
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
  // Vehículos
  { value: TipoSeguro.VEHICULAR,           label: "Vehicular",            group: "Vehículos" },
  { value: TipoSeguro.SOAT,               label: "SOAT",                 group: "Vehículos" },

  // Personas y Salud
  { value: TipoSeguro.EPS,                label: "EPS",                  group: "Personas y Salud" },
  { value: TipoSeguro.SALUD,              label: "Salud",                group: "Personas y Salud" },
  { value: TipoSeguro.SCTR_PENSION,       label: "SCTR Pensión",         group: "Personas y Salud" },
  { value: TipoSeguro.SCTR_SALUD,         label: "SCTR Salud",           group: "Personas y Salud" },
  { value: TipoSeguro.VIDA_LEY,           label: "Vida Ley",             group: "Personas y Salud" },
  { value: TipoSeguro.SEGURO_VIAJE,       label: "Viaje",                group: "Personas y Salud" },

  // Patrimoniales
  { value: TipoSeguro.MULTIRRIESGO,       label: "Multiriesgo",          group: "Patrimoniales" },
  { value: TipoSeguro.TREC,              label: "TREC",                 group: "Patrimoniales" },
  { value: TipoSeguro.CAR,               label: "CAR",                  group: "Patrimoniales" },
  { value: TipoSeguro.EAR,               label: "EAR",                  group: "Patrimoniales" },
  { value: TipoSeguro.TRES_D,            label: "3D",                   group: "Patrimoniales" },
  { value: TipoSeguro.FOLA,              label: "FOLA",                 group: "Patrimoniales" },

  // Responsabilidad Civil
  { value: TipoSeguro.RESPONSABILIDAD_CIVIL, label: "Responsabilidad Civil", group: "Responsabilidad Civil" },

  // Garantías
  { value: TipoSeguro.CARTA_FIANZA,      label: "Carta Fianza",         group: "Garantías" },
  { value: TipoSeguro.CAUCION,           label: "Caución",              group: "Garantías" },

  // Otro
  { value: TipoSeguro.OTRO,              label: "Otro",                 group: "Otro" },

] as const;
