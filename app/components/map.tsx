"use client"

import { useEffect, useRef } from "react"
import type { ProcessedEvent } from "../types"

// Define the ProcessedEvent interface since we're using it
interface MapProps {
  events: ProcessedEvent[]
}

// Bengaluru coordinates and event locations
const eventLocations: Record<string, [number, number]> = {
  "Outer Ring Road & MG Road": [12.9716, 77.5946], // Central location
  Marathahalli: [12.9591, 77.6974],
  "MG Road": [12.9716, 77.6033],
  "HSR Layout": [12.9082, 77.6476],
  Indiranagar: [12.9784, 77.6408],
  "Church Street": [12.9716, 77.6033],
}

export default function MapComponent({ events }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix for default markers in Leaflet with webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      // Initialize map
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView([12.9716, 77.5946], 11)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstanceRef.current)
      }

      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer)
        }
      })

      // Add markers for each event
      events.forEach((event) => {
        const location = eventLocations[event.location]
        if (location) {
          // Create custom icon based on event type and urgency
          const iconColor = getMarkerColor(event.urgency, event.type)
          const customIcon = createCustomIcon(L, iconColor, event.type)

          const marker = L.marker(location, { icon: customIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(createPopupContent(event))
        }
      })
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [events])

  const getMarkerColor = (urgency: string, type: string) => {
    switch (urgency) {
      case "Critical":
        return "#dc2626" // Keep red for critical
      case "High":
        return "#f97316" // More vibrant orange
      case "Medium":
        return "#eab308" // More vibrant yellow
      case "Low":
        return "#22c55e" // More vibrant green
      default:
        return "#6366f1" // Change default to indigo
    }
  }

  const createCustomIcon = (L: any, color: string, type: string) => {
    const iconHtml = `
    <div style="
      background: linear-gradient(135deg, ${color}, ${color}dd);
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 3px ${color}44;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: white;
      font-weight: bold;
      animation: pulse 2s infinite;
    ">
      ${getTypeIcon(type)}
    </div>
  `

    return L.divIcon({
      html: iconHtml,
      className: "custom-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Traffic":
        return "🚗"
      case "Weather":
        return "🌧️"
      case "Infrastructure":
        return "⚡"
      case "Event":
        return "👥"
      default:
        return "⚠️"
    }
  }

  const createPopupContent = (event: ProcessedEvent) => {
    return `
      <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 16px;">${getTypeIcon(event.type)}</span>
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${event.title}</h3>
        </div>
        
        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
          <span style="font-size: 12px;">📍</span>
          <span style="font-size: 14px; color: #6b7280;">${event.location}</span>
          <span style="
            background-color: ${getMarkerColor(event.urgency, event.type)};
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            margin-left: 8px;
          ">${event.urgency}</span>
        </div>
        
        <p style="margin: 8px 0; font-size: 14px; color: #374151; line-height: 1.4;">
          ${event.description}
        </p>
        
        <div style="background-color: #dbeafe; padding: 8px; border-radius: 6px; margin: 8px 0;">
          <div style="font-weight: 500; color: #1e40af; font-size: 13px; margin-bottom: 4px;">💡 Advice</div>
          <div style="font-size: 13px; color: #1e40af; line-height: 1.3;">${event.advice}</div>
        </div>
        
        ${
          event.prediction
            ? `
          <div style="background-color: #f3e8ff; padding: 8px; border-radius: 6px; margin: 8px 0;">
            <div style="font-weight: 500; color: #7c3aed; font-size: 13px; margin-bottom: 4px;">🔮 Prediction</div>
            <div style="font-size: 13px; color: #7c3aed; line-height: 1.3;">${event.prediction}</div>
          </div>
        `
            : ""
        }
        
        ${
          event.estimatedDuration
            ? `
          <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">
            ⏱️ Est. Duration: ${event.estimatedDuration}
          </div>
        `
            : ""
        }
      </div>
    `
  }

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "384px" }} />
    </>
  )
}
