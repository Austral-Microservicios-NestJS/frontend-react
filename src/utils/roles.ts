// ==================== DEFINICIÓN DE ROLES ====================
// Roles del sistema Austral CRM

export const Roles = {
  ADMINISTRADOR:    'ADMINISTRADOR',
  EJECUTIVO_CUENTA: 'EJECUTIVO_CUENTA',   // Cotiza, gestiona cuentas, interactúa con aseguradoras
  BROKER:           'BROKER',             // Mini-administrador con equipo propio
  PROMOTOR_VENTA:   'PROMOTOR_VENTA',     // Vendedor activo
  REFERENCIADOR:    'REFERENCIADOR',      // Solo aporta el dato / lead
  PUNTO_VENTA:      'PUNTO_VENTA',        // Local/tienda que vende seguros
} as const;

export type Rol = typeof Roles[keyof typeof Roles];

// ==================== GRUPOS DE ROLES ====================

export const RoleGroups = {
  // Todos los que acceden al CRM (sin REFERENCIADOR)
  TODOS_CRM: [
    Roles.ADMINISTRADOR,
    Roles.EJECUTIVO_CUENTA,
    Roles.BROKER,
    Roles.PROMOTOR_VENTA,
    Roles.PUNTO_VENTA,
  ],

  // CRM más REFERENCIADOR (para leads y prospectos)
  CON_REFERENCIADOR: [
    Roles.ADMINISTRADOR,
    Roles.EJECUTIVO_CUENTA,
    Roles.BROKER,
    Roles.PROMOTOR_VENTA,
    Roles.PUNTO_VENTA,
    Roles.REFERENCIADOR,
  ],

  // Nivel alto — ven datos de toda la organización
  NIVEL_ALTO: [
    Roles.ADMINISTRADOR,
    Roles.EJECUTIVO_CUENTA,
    Roles.BROKER,
  ],

  // Solo administrador del sistema
  SOLO_ADMIN: [Roles.ADMINISTRADOR],

  // Administrador y Broker (gestión de equipo)
  ADMIN_Y_BROKER: [Roles.ADMINISTRADOR, Roles.BROKER],

  // Acceso a Pólizas (excluye PROMOTOR_VENTA que no cierra directo)
  PUEDE_POLIZAS: [
    Roles.ADMINISTRADOR,
    Roles.EJECUTIVO_CUENTA,
    Roles.BROKER,
    Roles.PUNTO_VENTA,
  ],
} as const;
