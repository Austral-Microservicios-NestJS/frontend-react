import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { Users, UserCheck, Building2, IdCard, Search, Filter } from "lucide-react";
import { ButtonIA } from "@/components/ui";
import { useClientes } from "@/hooks/useCliente";
import { useAuthStore } from "@/store/auth.store";
import type { Cliente } from "@/types/cliente.interface";

export default function ClientesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "NATURAL" | "JURIDICO">("ALL");

  const { } = useAuthStore();
  const {
    clientes,
    clientesPorTipo,
    clientesActivos,
    isLoading
  } = useClientes();

  // Filtrar clientes
  const clientesFiltrados = clientes.filter((cliente) => {
    // Filtro por tipo
    if (filterType !== "ALL" && cliente.tipoPersona !== filterType) {
      return false;
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const nombre = cliente.tipoPersona === "NATURAL"
        ? `${cliente.nombres} ${cliente.apellidos}`.toLowerCase()
        : cliente.razonSocial?.toLowerCase() || "";
      const doc = String(cliente.numeroDocumento);

      return nombre.includes(search) || doc.includes(search);
    }

    return true;
  });

  if (isLoading) {
    return (
      <>
        <Header
          title="Clientes"
          description="Gestiona tu cartera de clientes"
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        >
          <BotonRegistro
            label="Nuevo Cliente"
            onClick={() => setIsModalOpen(true)}
          />
        </Header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
            <p className="mt-4 text-gray-600">Cargando clientes...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Clientes"
        description="Gestiona tu cartera de clientes"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Nuevo Cliente"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Clientes"
            value={clientes.length}
            icon={Users}
            color="bg-blue-500"
          />
          <StatsCard
            title="Personas Naturales"
            value={clientesPorTipo.NATURAL.length}
            icon={UserCheck}
            color="bg-purple-500"
          />
          <StatsCard
            title="Personas Jurídicas"
            value={clientesPorTipo.JURIDICO.length}
            icon={Building2}
            color="bg-indigo-500"
          />
          <StatsCard
            title="Clientes Activos"
            value={clientesActivos.length}
            icon={UserCheck}
            color="bg-green-500"
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <FilterButton
                label="Todos"
                active={filterType === "ALL"}
                onClick={() => setFilterType("ALL")}
                count={clientes.length}
              />
              <FilterButton
                label="Naturales"
                active={filterType === "NATURAL"}
                onClick={() => setFilterType("NATURAL")}
                count={clientesPorTipo.NATURAL.length}
              />
              <FilterButton
                label="Jurídicos"
                active={filterType === "JURIDICO"}
                onClick={() => setFilterType("JURIDICO")}
                count={clientesPorTipo.JURIDICO.length}
              />
            </div>
          </div>
        </div>

        {/* Clientes Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {filterType === "ALL" ? "Todos los Clientes" :
             filterType === "NATURAL" ? "Personas Naturales" : "Personas Jurídicas"}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({clientesFiltrados.length} resultados)
            </span>
          </h3>

          {clientesFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? "No se encontraron clientes con ese criterio" : "No hay clientes registrados"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientesFiltrados.map((cliente) => (
                <ClienteCard key={cliente.idCliente} cliente={cliente} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Filter Button Component
function FilterButton({ label, active, onClick, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
        active
          ? "bg-[#0066CC] text-white shadow-md"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <Filter className="w-4 h-4" />
      <span>{label}</span>
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
        active ? "bg-white/25" : "bg-white"
      }`}>
        {count}
      </span>
    </button>
  );
}

// Cliente Card Component
function ClienteCard({ cliente }: { cliente: Cliente }) {
  const isNatural = cliente.tipoPersona === "NATURAL";
  const nombre = isNatural
    ? `${cliente.nombres} ${cliente.apellidos}`
    : cliente.razonSocial;

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-[#0066CC] overflow-hidden">
      {/* ButtonIA en esquina superior derecha - SIEMPRE VISIBLE */}
      <div className="absolute top-3 right-3 z-20">
        <ButtonIA
          onClick={() => {
            console.log("IA asistente para cliente:", cliente.idCliente);
            // TODO: Implementar lógica de IA
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pr-14">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isNatural ? "bg-purple-100" : "bg-indigo-100"
          }`}>
            {isNatural ? (
              <UserCheck className={`w-6 h-6 text-purple-600`} />
            ) : (
              <Building2 className={`w-6 h-6 text-indigo-600`} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm truncate">{nombre}</h4>
            <p className="text-xs text-gray-500">
              {isNatural ? "Persona Natural" : "Persona Jurídica"}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          cliente.activo
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {cliente.activo ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <IdCard className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-gray-600">{cliente.tipoDocumento}:</span>
          <span className="font-semibold text-gray-900">{cliente.numeroDocumento}</span>
        </div>

        {cliente.telefono1 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">📞</span>
            <span className="text-gray-600 truncate">{cliente.telefono1}</span>
          </div>
        )}

        {cliente.emailNotificaciones && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">✉️</span>
            <span className="text-gray-600 truncate">{cliente.emailNotificaciones}</span>
          </div>
        )}

        {cliente.distrito && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">📍</span>
            <span className="text-gray-600 truncate">
              {cliente.distrito}{cliente.provincia ? `, ${cliente.provincia}` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Footer - Contactos */}
      {cliente.contactos && cliente.contactos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium mb-2">
            {cliente.contactos.length} contacto{cliente.contactos.length > 1 ? "s" : ""}
          </p>
          <div className="flex gap-1">
            {cliente.contactos.slice(0, 3).map((contacto, idx) => (
              <div
                key={idx}
                className="flex-1 bg-blue-50 rounded px-2 py-1 text-xs text-blue-700 truncate"
                title={contacto.nombre}
              >
                {contacto.nombre}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
