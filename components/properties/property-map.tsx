"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [map, center]);
  return null;
}

interface PropertyMapProps {
  lat: string;
  long: string;
  title?: string;
  className?: string;
}

export function PropertyMap({ lat, long, title, className }: PropertyMapProps) {
  const latNum = parseFloat(lat);
  const longNum = parseFloat(long);

  if (isNaN(latNum) || isNaN(longNum)) return null;

  const center: [number, number] = [latNum, longNum];

  return (
    <div
      className={`rounded-xl overflow-hidden border border-border ${className ?? ""}`}
      style={{ height: 320 }}
    >
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ minHeight: 320 }}
      >
        <MapUpdater center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={defaultIcon}>
          {title && <Popup>{title}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
