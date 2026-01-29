import { Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";

type Props = {
  enabled: boolean;
  position?: {
    latitud: number;
    longitud: number;
  } | null;
  onSelect: (lat: number, lng: number) => void;
};

export const MapLocationPicker = ({
  enabled,
  position,
  onSelect,
}: Props) => {
  const map = useMap();

  // Cursor visual
  useEffect(() => {
    map.getContainer().style.cursor = enabled ? "crosshair" : "";
    return () => {
      map.getContainer().style.cursor = "";
    };
  }, [enabled, map]);

  // Click handler
  useMapEvents({
    click(e) {
      if (!enabled) return;
      e.originalEvent?.stopPropagation();
      onSelect(
        Number(e.latlng.lat.toFixed(6)),
        Number(e.latlng.lng.toFixed(6)),
      );
    },
  });

  return position ? (
    <Marker position={[position.latitud, position.longitud]} />
  ) : null;
};
