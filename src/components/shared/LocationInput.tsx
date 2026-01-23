// Declaración de tipos para Google Maps
import React, { useRef, useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { cn } from "@/lib/utils";

export interface LocationData {
  address: string;
  lat?: number;
  lng?: number;
  distrito?: string;
  provincia?: string;
  departamento?: string;
}

interface LocationInputProps {
  value?: string;
  onChange: (data: LocationData) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function LocationInput({
  value = "",
  onChange,
  placeholder = "Buscar ubicación...",
  disabled = false,
  className,
}: LocationInputProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps script
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;

    const checkGoogleMaps = () => {
      if (window.google?.maps?.places) {
        setIsScriptLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGoogleMaps()) return;

    const existingScript = document.getElementById("google-maps-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Poll for API readiness
    const intervalId = setInterval(() => {
      if (checkGoogleMaps()) {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="text-red-500 text-sm p-2 border border-red-300 rounded-md bg-red-50">
        Error: VITE_GOOGLE_MAPS_API_KEY no está configurado.
      </div>
    );
  }

  if (!isScriptLoaded) {
    return (
      <input
        type="text"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        placeholder="Cargando..."
        disabled
      />
    );
  }

  return (
    <PlacesAutocompleteInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      inputRef={inputRef}
    />
  );
}

// Component that uses the hook (must be rendered after script loads)
function PlacesAutocompleteInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  inputRef,
}: LocationInputProps & {
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "pe" },
    },
    debounce: 300,
    defaultValue: value,
  });

  // Sync external value changes
  useEffect(() => {
    if (value !== inputValue) {
      setValue(value || "", false);
    }
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // Update parent with text only (no coordinates yet)
    onChange({ address: e.target.value });
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      // Extract address components
      const addressComponents = results[0].address_components;
      let distrito = "";
      let provincia = "";
      let departamento = "";

      addressComponents.forEach((component: any) => {
        const types = component.types;
        if (
          types.includes("locality") ||
          types.includes("sublocality") ||
          types.includes("neighborhood")
        ) {
          // Often districts in Peru are localities or sublocalities
          if (!distrito) distrito = component.long_name;
        }
        if (types.includes("administrative_area_level_2")) {
          provincia = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          departamento = component.long_name;
        }
      });

      onChange({
        address: description,
        lat,
        lng,
        distrito,
        provincia,
        departamento,
      });
    } catch (error) {
      console.error("Error getting geocode:", error);
      onChange({ address: description });
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInput}
        disabled={!ready || disabled}
        placeholder={placeholder}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      />

      {status === "OK" && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
