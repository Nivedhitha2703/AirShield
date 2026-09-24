import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

import type { PollutionEvent, RiskData } from "../types"

interface PollutionMapProps {
  event: PollutionEvent
  risk: RiskData
}

function PollutionMap({ event, risk }: PollutionMapProps) {
  return (
    <div className="map-container">
      <MapContainer
        center={[event.latitude, event.longitude]}
        zoom={11}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CircleMarker
          center={[event.latitude, event.longitude]}
          radius={22}
          pathOptions={{
            color: "#dc2626",
            fillColor: "#ef4444",
            fillOpacity: 0.45,
            weight: 3,
          }}
        >
          <Popup>
            <strong>Current Pollution Hotspot</strong>
            <br />
            Event: {event.event_id}
            <br />
            PM2.5: {event.pm25} µg/m³
            <br />
            PM10: {event.pm10} µg/m³
            <br />
            NO₂: {event.no2} ppb
            <br />
            Confidence: {(event.event_confidence * 100).toFixed(0)}%
          </Popup>
        </CircleMarker>

        <Polyline
          positions={risk.trajectory}
          pathOptions={{
            color: "#f97316",
            weight: 5,
            dashArray: "10 10",
          }}
        >
          <Popup>Predicted pollution trajectory</Popup>
        </Polyline>
      </MapContainer>

      <div className="map-overlay">
        <div>
          <span className="map-overlay-dot"></span>
          Active pollution event
        </div>

        <div>
          <span className="map-overlay-line"></span>
          Predicted movement
        </div>
      </div>
    </div>
  )
}

export default PollutionMap