import { useState, useCallback } from "react";
import { Header } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useAuthStore } from "@/store/auth.store";
import { clienteService } from "@/services/cliente.service";
import { TipoPersona } from "@/types/cliente.interface";
import type { Cliente } from "@/types/cliente.interface";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Lima, Perú por defecto
const DEFAULT_CENTER = { lat: -12.0464, lng: -77.0428 };
const DEFAULT_ZOOM = 11;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
};

// Colores de marcadores según tipo de persona
const TIPO_COLORS: Record<string, string> = {
  [TipoPersona.NATURAL]: "#2563EB", // Azul (bg-blue-600)
  [TipoPersona.JURIDICO]: "#F97316", // Naranja (bg-orange-500)
};

// Función para generar icono SVG con color personalizado
const getMarkerIcon = (tipo: TipoPersona): google.maps.Icon => {
  const color = TIPO_COLORS[tipo] || "#6B7280"; // Gris por defecto

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="${color}" stroke="#FFFFFF" stroke-width="1.5" 
        d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z"/>
      <circle fill="#FFFFFF" cx="12" cy="12" r="5"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(32, 42),
    anchor: new google.maps.Point(16, 42),
  };
};

export default function MapaPage() {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const user = useAuthStore((state) => state.user);

  // Obtener clientes del usuario actual
  const { data: clientes = [], isLoading } = clienteService.useGetByUsuario(
    user?.idUsuario || "",
    user?.rol?.nombreRol,
  );

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Filtrar clientes con coordenadas válidas
  // Nota: Nos aseguramos de que latitud y longitud sean números
  const clientesConCoordenadas = clientes
    .filter((c) => c.latitud && c.longitud)
    .map((c) => ({
      ...c,
      latitud: Number(c.latitud),
      longitud: Number(c.longitud),
    }))
    .filter(
      (c) =>
        !isNaN(c.latitud) &&
        !isNaN(c.longitud) &&
        c.latitud !== 0 &&
        c.longitud !== 0,
    );

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      // Ajustar bounds si hay clientes con coordenadas
      if (clientesConCoordenadas.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        clientesConCoordenadas.forEach((c) => {
          bounds.extend({ lat: c.latitud, lng: c.longitud });
        });
        map.fitBounds(bounds, 50);
      }
    },
    [clientesConCoordenadas], // Re-ajustar si cambian los clientes filtrados
  );

  const onUnmount = useCallback(() => {
    // Cleanup si es necesario
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="font-semibold">Error de configuración</p>
          <p className="text-sm">
            VITE_GOOGLE_MAPS_API_KEY no está configurado.
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="font-semibold">Error al cargar Google Maps</p>
          <p className="text-sm">{loadError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <Header
        title="Mapa de Clientes"
        description={`Mostrando ${clientesConCoordenadas.length} de ${clientes.length} clientes con ubicación`}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        {/* Leyenda */}
        <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: TIPO_COLORS[TipoPersona.NATURAL] }}
            />
            <span className="text-xs text-gray-600">Persona Natural</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: TIPO_COLORS[TipoPersona.JURIDICO] }}
            />
            <span className="text-xs text-gray-600">Persona Jurídica</span>
          </div>
        </div>
      </Header>

      {/* Map Container */}
      <div className="flex-1 relative min-h-[400px]">
        {!isLoaded || isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">Cargando mapa...</span>
            </div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
          >
            {clientesConCoordenadas.map((cliente) => (
              <Marker
                key={cliente.idCliente}
                position={{
                  lat: cliente.latitud,
                  lng: cliente.longitud,
                }}
                onClick={() => setSelectedCliente(cliente)}
                title={
                  cliente.tipoPersona === TipoPersona.JURIDICO
                    ? cliente.razonSocial
                    : `${cliente.nombres} ${cliente.apellidos}`
                }
                icon={getMarkerIcon(cliente.tipoPersona)}
              />
            ))}

            {selectedCliente && (
              <InfoWindow
                position={{
                  lat: Number(selectedCliente.latitud),
                  lng: Number(selectedCliente.longitud),
                }}
                onCloseClick={() => setSelectedCliente(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    {selectedCliente.tipoPersona === TipoPersona.JURIDICO
                      ? selectedCliente.razonSocial
                      : `${selectedCliente.nombres} ${selectedCliente.apellidos}`}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Tipo:</strong>{" "}
                    {selectedCliente.tipoPersona === TipoPersona.JURIDICO
                      ? "Jurídico"
                      : "Natural"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Documento:</strong> {selectedCliente.tipoDocumento}{" "}
                    {selectedCliente.numeroDocumento}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Dirección:</strong>{" "}
                    {selectedCliente.direccion || "N/A"}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}
