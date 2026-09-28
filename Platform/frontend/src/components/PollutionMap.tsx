import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  Circle,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

import type {
  Member1Event,
  Member2AIResponse,
} from "../types"

interface PollutionMapProps {
  event: Member1Event
  risk: Member2AIResponse
}

function formatRisk(value: string) {
  return value.replace(/_/g, " ")
}

function getRiskColor(risk: string) {
  switch (risk.toUpperCase()) {
    case "CRITICAL":
      return "#ff3f4d"

    case "HIGH":
      return "#ff8a3d"

    case "MODERATE":
      return "#ffd166"

    default:
      return "#57f5cf"
  }
}

function PollutionMap({
  event,
  risk,
}: PollutionMapProps) {
  const center: [number, number] = [
    event.latitude,
    event.longitude,
  ]

  const trajectory =
    risk.trajectory?.map(
      (point) =>
        [
          point.latitude,
          point.longitude,
        ] as [number, number]
    ) ?? []

  const riskColor = getRiskColor(
    risk.risk || event.risk_level
  )

  return (
    <div className="map-container">

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ================================================
            POLLUTION IMPACT ZONES
        ================================================= */}

        <Circle
          center={center}
          radius={1800}
          pathOptions={{
            color: riskColor,
            fillColor: riskColor,
            fillOpacity: 0.035,
            weight: 1,
            className: "pollution-zone pollution-zone-one",
          }}
        />

        <Circle
          center={center}
          radius={1100}
          pathOptions={{
            color: riskColor,
            fillColor: riskColor,
            fillOpacity: 0.05,
            weight: 1,
            className: "pollution-zone pollution-zone-two",
          }}
        />

        <Circle
          center={center}
          radius={600}
          pathOptions={{
            color: riskColor,
            fillColor: riskColor,
            fillOpacity: 0.08,
            weight: 1,
            className: "pollution-zone pollution-zone-three",
          }}
        />

        {/* ================================================
            MAIN POLLUTION HOTSPOT
        ================================================= */}

        <CircleMarker
          center={center}
          radius={28}
          pathOptions={{
            color: riskColor,
            fillColor: riskColor,
            fillOpacity: 0.16,
            weight: 2,
            className: "pollution-hotspot",
          }}
        />

        <CircleMarker
          center={center}
          radius={12}
          pathOptions={{
            color: riskColor,
            fillColor: riskColor,
            fillOpacity: 0.9,
            weight: 2,
            className: "pollution-core",
          }}
        >
          <Popup>
            <div className="map-popup">

              <strong>
                POLLUTION EVENT
              </strong>

              <div>
                Event: {event.event_id}
              </div>

              <div>
                Sensor: {event.sensor_id}
              </div>

              <div>
                Location: {event.location}
              </div>

              <div>
                Type: {event.event_type}
              </div>

              <div>
                Risk: {formatRisk(
                  risk.risk || event.risk_level
                )}
              </div>

              <div>
                AQI: {event.aqi.toFixed(1)}
              </div>

              <div>
                PM2.5: {event.pm25.toFixed(1)} µg/m³
              </div>

              <div>
                PM10: {event.pm10.toFixed(1)} µg/m³
              </div>

            </div>
          </Popup>
        </CircleMarker>

        {/* ================================================
            SENSOR SIGNAL RINGS
        ================================================= */}

        <CircleMarker
          center={center}
          radius={42}
          pathOptions={{
            color: riskColor,
            fillOpacity: 0,
            weight: 1,
            dashArray: "4 8",
            className: "sensor-ring sensor-ring-one",
          }}
        />

        <CircleMarker
          center={center}
          radius={58}
          pathOptions={{
            color: riskColor,
            fillOpacity: 0,
            weight: 1,
            dashArray: "3 12",
            className: "sensor-ring sensor-ring-two",
          }}
        />

        {/* ================================================
            MEMBER 2 PREDICTED TRAJECTORY
        ================================================= */}

        {trajectory.length > 1 && (
          <Polyline
            positions={trajectory}
            pathOptions={{
              color: "#57f5cf",
              weight: 4,
              opacity: 0.85,
              dashArray: "8 12",
              className: "pollution-trajectory",
            }}
          >
            <Popup>
              <div className="map-popup">
                <strong>
                  PREDICTED POLLUTION TRAJECTORY
                </strong>

                <div>
                  Forecast:{" "}
                  {risk.forecast_horizon.replace(
                    /_/g,
                    " "
                  )}
                </div>

                <div>
                  Points: {trajectory.length}
                </div>

                <div>
                  Predicted PM2.5:{" "}
                  {risk.predicted_pm25.toFixed(1)} µg/m³
                </div>
              </div>
            </Popup>
          </Polyline>
        )}

        {/* ================================================
            TRAJECTORY POINTS
        ================================================= */}

        {trajectory.slice(1).map((point, index) => (
          <CircleMarker
            key={`trajectory-${index}`}
            center={point}
            radius={4}
            pathOptions={{
              color: "#57f5cf",
              fillColor: "#57f5cf",
              fillOpacity: 0.85,
              weight: 1,
            }}
          />
        ))}

      </MapContainer>

      {/* ================================================
          MAP HUD
      ================================================= */}

      <div className="map-hud map-hud-top">

        <span className="map-live-dot" />

        POLLUTION INTELLIGENCE MAP

      </div>

      <div className="map-hud map-hud-right">

        <span>PM2.5</span>

        <strong>
          {event.pm25.toFixed(1)}
        </strong>

        <small>
          μg/m³
        </small>

      </div>

      <div className="map-hud map-hud-bottom">

        <span>
          AQI
        </span>

        <strong>
          {Math.round(event.aqi)}
        </strong>

        <em>
          {formatRisk(
            risk.risk || event.risk_level
          )}
        </em>

      </div>

      <div className="map-scan-line" />

    </div>
  )
}

export default PollutionMap