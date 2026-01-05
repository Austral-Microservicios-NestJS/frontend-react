import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
<<<<<<< HEAD
import { useAuthStore } from "@/store/auth.store";
import { RegistrarCliente } from "@/components/modulos/clientes/modales/RegistrarCliente";
import { EditarCliente } from "@/components/modulos/clientes/modales/EditarCliente";
import { useClientes } from "@/hooks/useCliente";
import { TablaClientes } from "@/components/modulos/clientes/tablas/TablaClientes";
import type { Cliente, UpdateCliente } from "@/types/cliente.interface";

export default function ClientesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const { user } = useAuthStore();
  const { clientes, addCliente, updateCliente } = useClientes();

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
  };

  const handleUpdate = async (data: UpdateCliente) => {
    if (editingCliente) {
      await updateCliente(editingCliente.idCliente, data);
    }
  };
=======
import {
  Users,
  UserCheck,
  Building2,
  IdCard,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { ButtonIA } from "@/components/ui";
import { useClientes } from "@/hooks/useCliente";
import { useAuthStore } from "@/store/auth.store";
import type { Cliente } from "@/types/cliente.interface";
import { ContextoClienteModal } from "@/components/modulos/clientes/modales/ContextoClienteModal";

export default function ClientesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [, setIsModalOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "NATURAL" | "JURIDICO">(
    "ALL"
  );

  const handleOpenContext = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsContextModalOpen(true);
  };

  const handleCloseContext = () => {
    setIsContextModalOpen(false);
    setSelectedCliente(null);
  };

  const {} = useAuthStore();
  const { clientes, clientesPorTipo, clientesActivos, isLoading } =
    useClientes();

  // Filtrar clientes
  const clientesFiltrados = clientes.filter((cliente) => {
    // Filtro por tipo
    if (filterType !== "ALL" && cliente.tipoPersona !== filterType) {
      return false;
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const nombre =
        cliente.tipoPersona === "NATURAL"
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
>>>>>>> 8207b74c9fcf3c84d9717768838deedfd5963393

  return (
    <>
      <Header
        title="Clientes"
        description="Gestiona tu cartera de clientes"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
<<<<<<< HEAD
          label="Registrar Cliente"
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <TablaClientes clientes={clientes} onEdit={handleEdit} />

      <RegistrarCliente
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        addCliente={addCliente}
        user={user!}
=======
          label="Nuevo Cliente"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <div className="p-6 space-y-6">
        {/* Stats Cards - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Clientes"
            value={clientes.length}
            icon={Users}
            color="text-blue-600"
          />
          <StatsCard
            title="Personas Naturales"
            value={clientesPorTipo.NATURAL.length}
            icon={UserCheck}
            color="text-purple-600"
          />
          <StatsCard
            title="Personas Jurídicas"
            value={clientesPorTipo.JURIDICO.length}
            icon={Building2}
            color="text-indigo-600"
          />
          <StatsCard
            title="Clientes Activos"
            value={clientesActivos.length}
            icon={UserCheck}
            color="text-emerald-600"
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              {filterType === "ALL"
                ? "Todos los Clientes"
                : filterType === "NATURAL"
                ? "Personas Naturales"
                : "Personas Jurídicas"}
              <span className="ml-2 text-gray-400 font-normal">
                ({clientesFiltrados.length})
              </span>
            </h3>
          </div>

          {clientesFiltrados.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 border-dashed">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? "No se encontraron clientes con ese criterio"
                  : "No hay clientes registrados"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientesFiltrados.map((cliente) => (
                <ClienteCard
                  key={cliente.idCliente}
                  cliente={cliente}
                  onOpenContext={() => handleOpenContext(cliente)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ContextoClienteModal
        isOpen={isContextModalOpen}
        onClose={handleCloseContext}
        cliente={selectedCliente}
>>>>>>> 8207b74c9fcf3c84d9717768838deedfd5963393
      />

      {editingCliente && (
        <EditarCliente
          isOpen={!!editingCliente}
          onClose={() => setEditingCliente(null)}
          onSubmit={handleUpdate}
          cliente={editingCliente}
        />
      )}
    </>
  );
}

// Stats Card Component - Minimalist
function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white border border-gray-200 p-4 flex items-center justify-between hover:border-gray-300 transition-colors">
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
          {title}
        </p>
        <p className="text-2xl font-light text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-2 bg-gray-50 rounded-full`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    </div>
  );
}

// Filter Button Component - Minimalist
function FilterButton({ label, active, onClick, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-2 border ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <span>{label}</span>
      <span
        className={`px-1.5 py-0.5 text-[10px] ${
          active ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// Cliente Card Component - Minimalist & Elegant
function ClienteCard({
  cliente,
  onOpenContext,
}: {
  cliente: Cliente;
  onOpenContext: () => void;
}) {
  const isNatural = cliente.tipoPersona === "NATURAL";
  const nombre = isNatural
    ? `${cliente.nombres} ${cliente.apellidos}`
    : cliente.razonSocial;

  return (
    <div className="group relative bg-white border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">
      {/* ButtonIA en esquina superior derecha - SIEMPRE VISIBLE */}
      <div className="absolute top-4 right-4 z-20">
        <ButtonIA
          onClick={() => {
            onOpenContext();
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4 pr-12">
        <div
          className={`w-10 h-10 flex items-center justify-center border ${
            isNatural
              ? "bg-purple-50 border-purple-100 text-purple-600"
              : "bg-blue-50 border-blue-100 text-blue-600"
          }`}
        >
          {isNatural ? (
            <UserCheck className="w-5 h-5" />
          ) : (
            <Building2 className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate leading-tight">
            {nombre}
          </h4>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1 font-medium">
            {isNatural ? "Persona Natural" : "Persona Jurídica"}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2.5 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2.5 text-xs group/item">
          <IdCard className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover/item:text-gray-600 transition-colors" />
          <span className="text-gray-500 font-medium">
            {cliente.tipoDocumento}:
          </span>
          <span className="text-gray-700">{cliente.numeroDocumento}</span>
        </div>

        {cliente.telefono1 && (
          <div className="flex items-center gap-2.5 text-xs group/item">
            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover/item:text-gray-600 transition-colors" />
            <span className="text-gray-600 truncate">{cliente.telefono1}</span>
          </div>
        )}

        {cliente.emailNotificaciones && (
          <div className="flex items-center gap-2.5 text-xs group/item">
            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover/item:text-gray-600 transition-colors" />
            <span className="text-gray-600 truncate">
              {cliente.emailNotificaciones}
            </span>
          </div>
        )}

        {cliente.distrito && (
          <div className="flex items-center gap-2.5 text-xs group/item">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover/item:text-gray-600 transition-colors" />
            <span className="text-gray-600 truncate">
              {cliente.distrito}
              {cliente.provincia ? `, ${cliente.provincia}` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Footer - Status */}
      <div className="mt-4 flex items-center justify-between">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 border ${
            cliente.activo
              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
              : "bg-red-50 border-red-100 text-red-600"
          }`}
        >
          {cliente.activo ? "ACTIVO" : "INACTIVO"}
        </span>

        {/* Contactos - Simplified */}
        {cliente.contactos && cliente.contactos.length > 0 && (
          <div className="flex -space-x-1.5">
            {cliente.contactos.slice(0, 3).map((contacto, i) => (
              <div
                key={i}
                className="h-5 w-5 rounded-full ring-1 ring-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500 border border-gray-200"
                title={contacto.nombre}
              >
                {contacto.nombre.charAt(0)}
              </div>
            ))}
            {cliente.contactos.length > 3 && (
              <div className="h-5 w-5 rounded-full ring-1 ring-white bg-gray-50 flex items-center justify-center text-[8px] font-bold text-gray-400 border border-gray-200">
                +{cliente.contactos.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
