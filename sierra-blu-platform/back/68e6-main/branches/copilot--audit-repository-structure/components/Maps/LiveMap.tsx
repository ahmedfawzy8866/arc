'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveMapProps {
  mode?: 'dark' | 'light';
  activeZoneIndex?: number | null;
  zones?: any[];
}


export default function LiveMap({ mode = 'dark', activeZoneIndex = null, zones = [] }: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);


  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletInstance.current) {
      leafletInstance.current.remove();
    }

    const map = L.map(mapRef.current, {
      center: [30.055, 31.530],
      zoom: 11,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    const tileUrl = mode === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 18,
    }).addTo(map);

    const createZoneMarker = (z: any) => L.divIcon({
      className: 'zone-marker',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:2px;pointer-events:auto;">
          <div style="width:12px;height:12px;background:${z.color};border:2px solid rgba(255,255,255,0.9);border-radius:50%;box-shadow:0 0 10px ${z.color}99,0 0 20px ${z.color}44;"></div>
          <div style="background:${mode === 'dark' ? 'rgba(10,21,40,0.88)' : 'rgba(255,255,255,0.92)'};backdrop-filter:blur(6px);padding:2px 7px;border-radius:4px;border:1px solid ${z.color}44;white-space:nowrap;">
            <span style="font-family:'Jost',sans-serif;font-size:9px;font-weight:600;color:${z.color};letter-spacing:.06em;text-transform:uppercase;">${z.short}</span>
          </div>
        </div>
      `,
      iconSize: [80, 38],
      iconAnchor: [40, 8],
    });

    markersRef.current = [];
    zones.forEach((z, i) => {
      const marker = L.marker(z.coords, { icon: createZoneMarker(z) }).addTo(map);
      markersRef.current[i] = marker;

      const popupContent = `
        <div style="font-family:'Jost',sans-serif;padding:6px 4px;text-align:center;">
          <div style="font-size:13px;font-weight:600;color:#071422;margin-bottom:3px;">${z.area}</div>
          <div style="font-size:10px;color:${z.color};font-weight:700;letter-spacing:.06em;text-transform:uppercase;">${z.stat}</div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'sierra-popup-custom',
        offset: [0, 8],
      });

      marker.on('mouseover', function(this: any) { this.openPopup(); });
    });

    leafletInstance.current = map;

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [mode, zones]);

  useEffect(() => {
    if (leafletInstance.current && activeZoneIndex !== null && zones[activeZoneIndex]) {
      const z = zones[activeZoneIndex];
      leafletInstance.current.flyTo(z.coords, 13, { duration: 1.5 });
      markersRef.current[activeZoneIndex]?.openPopup();
    } else if (leafletInstance.current && activeZoneIndex === null) {
      leafletInstance.current.flyTo([30.055, 31.530], 11, { duration: 1.5 });
    }
  }, [activeZoneIndex, zones]);

  return (
    <div className="w-full h-full relative">
      <style jsx global>{`
        .sierra-popup-custom .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 8px;
          border: 1px solid rgba(233, 193, 118, 0.4);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .sierra-popup-custom .leaflet-popup-tip {
          display: none;
        }
        .leaflet-container {
          background: transparent !important;
        }
        .dark-map-tiles .leaflet-tile-pane {
          filter: brightness(0.55) contrast(1.2) saturate(0.3) hue-rotate(180deg);
        }
        .zone-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
      <div ref={mapRef} className={`w-full h-full ${mode === 'dark' ? 'dark-map-tiles' : ''}`} />
    </div>
  );
}
