import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
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
const DEFAULT_CENTER = { lat: -12.0464, lng: -77.0428 };

const TIPO_COLORS: Record<string, string> = {
  [TipoPersona.NATURAL]: "#2563EB",
  [TipoPersona.JURIDICO]: "#F97316",
};

const getMarkerIcon = (tipo: TipoPersona): google.maps.Icon => {
  const color = TIPO_COLORS[tipo] || "#6B7280";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path fill="${color}" stroke="#FFFFFF" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z"/>
    <circle fill="#FFFFFF" cx="12" cy="12" r="5"/>
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(24, 32),
    anchor: new google.maps.Point(12, 32),
  };
};

const miniMapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: "greedy",
  clickableIcons: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
  ],
};

export const MapWidget = () => {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const user = useAuthStore((state) => state.user);

  const { data: clientes = [], isLoading: loadingClientes } =
    clienteService.useGetByUsuario(user?.idUsuario || "", user?.rol?.nombreRol);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

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
      if (clientesConCoordenadas.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        clientesConCoordenadas.forEach((c) =>
          bounds.extend({ lat: c.latitud, lng: c.longitud }),
        );
        map.fitBounds(bounds, 40);
      }
    },
    [clientesConCoordenadas],
  );

  const isReady =
    isLoaded && !loadingClientes && !loadError && GOOGLE_MAPS_API_KEY;

  return (
    <Card className="h-full border-none shadow-sm ring-1 ring-[#003d5c]/10 hover:ring-[#003d5c]/20 transition-all bg-white overflow-hidden relative flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#003d5c]" />

      <div className="px-4 pt-3 pb-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#003d5c] p-1.5 rounded-lg">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base">
              Mapa de Clientes
            </h3>
          </div>
          <Link
            to="/dashboard/general/mapa"
            className="flex items-center gap-1 text-sm font-semibold text-[#003d5c] hover:text-[#003d5c]/70 transition-colors group/link"
          >
            Ver completo
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>

        {/* Map area */}
        <div className="flex-1 relative rounded-xl overflow-hidden min-h-0 bg-gray-100">
          {!isReady ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              {loadError || !GOOGLE_MAPS_API_KEY ? (
                <>
                  <MapPin className="w-6 h-6 text-gray-300" />
                  <p className="text-xs text-gray-400">Mapa no disponible</p>
                </>
              ) : (
                <div className="w-6 h-6 border-2 border-[#003d5c] border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={DEFAULT_CENTER}
              zoom={11}
              onLoad={onLoad}
              options={miniMapOptions}
            >
              {clientesConCoordenadas.map((cliente) => (
                <Marker
                  key={cliente.idCliente}
                  position={{ lat: cliente.latitud, lng: cliente.longitud }}
                  onClick={() => setSelectedCliente(cliente)}
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
                  <div className="p-1 min-w-35">
                    <p className="font-semibold text-sm text-gray-800">
                      {selectedCliente.tipoPersona === TipoPersona.JURIDICO
                        ? selectedCliente.razonSocial
                        : `${selectedCliente.nombres} ${selectedCliente.apellidos}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedCliente.direccion || "Sin dirección"}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#003d5c]" />
            <span className="text-sm text-gray-400">Con ubicación</span>
            <span className="text-sm font-bold text-[#003d5c]">
              {clientesConCoordenadas.length}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
