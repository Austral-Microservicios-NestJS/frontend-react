
export const Roles = {
  ADMIN_GENERAL:   'ADMIN_GENERAL',
  BROKER_JURIDICO: 'BROKER_JURIDICO',
  BROKER_NATURAL:  'BROKER_NATURAL',
  VENDEDOR:        'VENDEDOR',
  REFERENCIADOR:   'REFERENCIADOR',
}

// Grupos de roles para simplificar la asignación de permisos
export const RoleGroups = {
  // Todos los roles con acceso al CRM
  TODOS_CRM: ['ADMIN_GENERAL', 'BROKER_JURIDICO', 'BROKER_NATURAL', 'VENDEDOR'],
  // Acceso CRM más referenciador (para leads/prospectos)
  CON_REFERENCIADOR: ['ADMIN_GENERAL', 'BROKER_JURIDICO', 'BROKER_NATURAL', 'VENDEDOR', 'REFERENCIADOR'],
  // Sin VENDEDOR (módulos de cierre/pólizas)
  SIN_VENDEDOR: ['ADMIN_GENERAL', 'BROKER_JURIDICO', 'BROKER_NATURAL'],
  // Solo admin
  SOLO_ADMIN: ['ADMIN_GENERAL'],
  // Solo BROKER_JURIDICO (gestión de equipo)
  SOLO_BROKER_JURIDICO: ['BROKER_JURIDICO'],
  // Roles de brokers e intermediarios (no admin)
  BROKERS_E_INFO: ['BROKER_JURIDICO', 'BROKER_NATURAL'],
}
