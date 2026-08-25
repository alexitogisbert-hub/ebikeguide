"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, GeoJSON as LeafletGeoJSON, CircleMarker } from "leaflet";

const SPAIN_CENTER: [number, number] = [40.0, -3.7];
const SPAIN_ZOOM = 5.5;

export function RangoMapaCanvas({
  center,
  geojson,
  onMapClick,
}: {
  center: { lat: number; lon: number } | null;
  geojson: GeoJSON.FeatureCollection | null;
  onMapClick?: (lat: number, lon: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LeafletGeoJSON | null>(null);
  const markerRef = useRef<CircleMarker | null>(null);
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: SPAIN_CENTER,
        zoom: SPAIN_ZOOM,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (e) => onMapClickRef.current?.(e.latlng.lat, e.latlng.lng));

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    import("leaflet").then((L) => {
      if (mapRef.current !== map) return;

      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }

      if (!center) return;

      markerRef.current = L.circleMarker([center.lat, center.lon], {
        radius: 7,
        color: "#fff",
        weight: 2,
        fillColor: "#097c6e",
        fillOpacity: 1,
      }).addTo(map);

      if (geojson) {
        layerRef.current = L.geoJSON(geojson, {
          style: {
            color: "#097c6e",
            weight: 2.5,
            fillColor: "#0fb5a0",
            fillOpacity: 0.28,
          },
        }).addTo(map);
        map.fitBounds(layerRef.current.getBounds(), { padding: [24, 24] });
      } else {
        map.setView([center.lat, center.lon], 11);
      }
    });
  }, [center, geojson]);

  return <div ref={containerRef} className="size-full" />;
}
