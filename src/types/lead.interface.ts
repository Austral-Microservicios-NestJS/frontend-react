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
  // Vehículos
  { value: TipoSeguro.VEHICULAR, label: "Vehicular",   group: "Vehículos" },
  { value: TipoSeguro.SOAT,      label: "SOAT",        group: "Vehículos" },

  // Personas y salud
  { value: TipoSeguro.SALUD,                   label: "Salud",                                      group: "Personas y Salud" },
  { value: TipoSeguro.EPS,                     label: "EPS",                                        group: "Personas y Salud" },
  { value: TipoSeguro.SCTR_PENSION,            label: "SCTR Pensión",                               group: "Personas y Salud" },
  { value: TipoSeguro.SCTR_SALUD,              label: "SCTR Salud",                                 group: "Personas y Salud" },
  { value: TipoSeguro.VIDA_LEY,                label: "Vida Ley",                                   group: "Personas y Salud" },
  { value: TipoSeguro.VIDA,                    label: "Vida",                                       group: "Personas y Salud" },
  { value: TipoSeguro.ACCIDENTES,              label: "Accidentes Personales",                      group: "Personas y Salud" },
  { value: TipoSeguro.ACCIDENTES_ESPECTACULOS, label: "Accidentes — Espectáculos públicos",         group: "Personas y Salud" },
  { value: TipoSeguro.MASCOTAS,                label: "Mascotas",                                   group: "Personas y Salud" },
  { value: TipoSeguro.SEPELIO,                 label: "Sepelio",                                    group: "Personas y Salud" },
  { value: TipoSeguro.ESTUDIANTIL,             label: "Estudiantil",                                group: "Personas y Salud" },
  { value: TipoSeguro.SEGURO_VIAJE,            label: "Seguro de Viaje",                            group: "Personas y Salud" },
  { value: TipoSeguro.DESGRAVAMEN,             label: "Desgravamen",                                group: "Personas y Salud" },
  { value: TipoSeguro.BANCA_SEGURO,            label: "Banca Seguro",                               group: "Personas y Salud" },

  // Patrimoniales
  { value: TipoSeguro.HOGAR,                  label: "Hogar",                                       group: "Patrimoniales" },
  { value: TipoSeguro.MULTIRRIESGO,           label: "Multiriesgo",                                 group: "Patrimoniales" },
  { value: TipoSeguro.TREC,                   label: "TREC (Todo Riesgo Equipo Contratistas)",      group: "Patrimoniales" },
  { value: TipoSeguro.CAR,                    label: "CAR (Contractor's All Risk)",                 group: "Patrimoniales" },
  { value: TipoSeguro.EAR,                    label: "EAR (Erection All Risk)",                     group: "Patrimoniales" },
  { value: TipoSeguro.FOLA,                   label: "FOLA",                                        group: "Patrimoniales" },
  { value: TipoSeguro.ROBO,                   label: "Robo",                                        group: "Patrimoniales" },
  { value: TipoSeguro.DESHONESTIDAD,          label: "Deshonestidad",                               group: "Patrimoniales" },
  { value: TipoSeguro.CASCOS,                 label: "Cascos",                                      group: "Patrimoniales" },
  { value: TipoSeguro.TRES_D,                 label: "3D",                                          group: "Patrimoniales" },
  { value: TipoSeguro.CAR_SCTR_MULTIFAMILIAR, label: "CAR y SCTR — Edificación Multifamiliar",     group: "Patrimoniales" },

  // Responsabilidad Civil — General
  { value: TipoSeguro.RESPONSABILIDAD_CIVIL, label: "Responsabilidad Civil",            group: "Responsabilidad Civil" },
  { value: TipoSeguro.RC_PROFESIONAL,        label: "RC Profesional",                   group: "Responsabilidad Civil" },
  { value: TipoSeguro.RC_HIDROCARBUROS,      label: "RC Hidrocarburos",                 group: "Responsabilidad Civil" },
  { value: TipoSeguro.D_Y_O,                 label: "D&O (Directors & Officers)",       group: "Responsabilidad Civil" },
  { value: TipoSeguro.LUCRO_CESANTE,         label: "Lucro Cesante",                    group: "Responsabilidad Civil" },
  { value: TipoSeguro.EXTORSION_SECUESTRO,   label: "Extorsión y Secuestro",            group: "Responsabilidad Civil" },

  // Responsabilidad Civil — Regulatorios SBS
  { value: TipoSeguro.RC_RESIDUOS_SOLIDOS,              label: "RC — Gestión integral de residuos sólidos",                    group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_ALMACENAMIENTO_HIDROCARBUROS,  label: "RC — Almacenamiento de hidrocarburos",                         group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_TRANSPORTE_HIDROCARBUROS,      label: "RC — Transporte de hidrocarburos",                             group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_GAS_LICUADO_AUTOMOTOR,         label: "RC — Venta de gas licuado para uso automotor",                 group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_COMERCIALIZACION_COMBUSTIBLES, label: "RC — Comercialización de combustibles líquidos",               group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_TRANSPORTE_RESIDUOS_PELIGROSOS,label: "RC — Transporte de residuos y materiales peligrosos",          group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_GAS_LICUADO_GLP,               label: "RC — Comercialización de Gas Licuado de Petróleo (GLP)",       group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_INSTALADORAS_GAS_NATURAL,      label: "RC y Daños — Instaladoras de gas natural por red de ductos",   group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_TALLERES_GAS_NATURAL,          label: "RC — Talleres instaladores de gas natural vehicular",          group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_VENTA_GAS_NATURAL,             label: "RC — Venta al público de gas natural vehicular",               group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_DISTRIBUCION_GAS_NATURAL,      label: "RC — Distribución de Gas Natural",                             group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_CONSTRUCCION_GAS_NATURAL,      label: "RC — Proyección, diseño y construcción de redes de gas natural",group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_DISTRIBUCION_GAS_DANOS,        label: "RC y Daños — Distribución de Gas Natural",                     group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_TRANSPORTADOR_CARRETERA,       label: "RC — Transportador por carretera en viaje internacional",      group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_PROPIETARIO_VEHICULO,          label: "RC — Propietario de vehículo automotor / transporte nacional",  group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_ESPECTACULOS_DEPORTIVOS,       label: "RC — Organización de espectáculos deportivos",                 group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_CANES_PELIGROSOS,              label: "RC — Propietarios de canes potencialmente peligrosos",         group: "RC Regulatorio SBS" },
  { value: TipoSeguro.RC_AGD,                           label: "RC — Almacenes Generales de Depósito (AGD)",                   group: "RC Regulatorio SBS" },

  // Transporte y logística
  { value: TipoSeguro.TRANSPORTE_NACIONAL,      label: "Transporte Nacional",      group: "Transporte" },
  { value: TipoSeguro.TRANSPORTE_INTERNACIONAL, label: "Transporte Internacional", group: "Transporte" },
  { value: TipoSeguro.TRASLADO,                 label: "Traslado",                 group: "Transporte" },

  // Garantías y crédito
  { value: TipoSeguro.CARTA_FIANZA, label: "Carta Fianza", group: "Garantías y Crédito" },
  { value: TipoSeguro.CAUCION,      label: "Caución",      group: "Garantías y Crédito" },
  { value: TipoSeguro.CREDITO,      label: "Crédito",      group: "Garantías y Crédito" },

  // Energía e industria
  { value: TipoSeguro.ENERGY_OIL_GAS,    label: "Energy / Oil & Gas",    group: "Energía e Industria" },
  { value: TipoSeguro.ENERGIA_RENOVABLE, label: "Energía Renovable",     group: "Energía e Industria" },
  { value: TipoSeguro.PARAMETRICOS,      label: "Paramétricos",          group: "Energía e Industria" },
  { value: TipoSeguro.SEGURO_AGRICOLA,   label: "Seguro Agrícola",       group: "Energía e Industria" },
  { value: TipoSeguro.SEGURO_PECUARIO,   label: "Seguro Pecuario",       group: "Energía e Industria" },

  // Tecnología
  { value: TipoSeguro.CYBER, label: "Cyber", group: "Tecnología" },

  // Especiales
  { value: TipoSeguro.SEGUROS_OBLIGATORIOS, label: "Seguros Obligatorios", group: "Especiales" },
  { value: TipoSeguro.SEGUROS_ESPECIALES,   label: "Seguros Especiales",   group: "Especiales" },
  { value: TipoSeguro.GENERAL,              label: "General",              group: "Especiales" },

  { value: TipoSeguro.OTRO, label: "Otro", group: "General" },
] as const;
