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

function PollutionMap({
  event,
  risk,
}: PollutionMapProps) {

  const center: [number, number] = [
    event.latitude,
    event.longitude,
  ]

  const trajectory = risk.trajectory.map(
    (point) =>
      [
        point.latitude,
        point.longitude,
      ] as [number, number]
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


        {/* =================================================
            OUTER PULSING POLLUTION ZONES
        ================================================= */}

        <Circle
          center={center}
          radius={1800}
          pathOptions={{
            color: "#ff4654",
            fillColor: "#ff4654",
            fillOpacity: 0.035,
            weight: 1,
            className: "pollution-zone pollution-zone-one",
          }}
        />

        <Circle
          center={center}
          radius={1100}
          pathOptions={{
            color: "#ff5965",
            fillColor: "#ff5965",
            fillOpacity: 0.05,
            weight: 1,
            className: "pollution-zone pollution-zone-two",
          }}
        />

        <Circle
          center={center}
          radius={600}
          pathOptions={{
            color: "#ff6b72",
            fillColor: "#ff6b72",
            fillOpacity: 0.08,
            weight: 1,
            className: "pollution-zone pollution-zone-three",
          }}
        />


        {/* =================================================
            MAIN POLLUTION HOTSPOT
        ================================================= */}

        <CircleMarker
          center={center}
          radius={28}
          pathOptions={{
            color: "#ff3f4d",
            fillColor: "#ff3f4d",
            fillOpacity: 0.16,
            weight: 2,
            className: "pollution-hotspot",
          }}
        />


        {/* Inner hotspot */}

        <CircleMarker
          center={center}
          radius={12}
          pathOptions={{
            color: "#ff5965",
            fillColor: "#ff3445",
            fillOpacity: 0.9,
            weight: 2,
            className: "pollution-core",
          }}
        >

          <Popup>

            <div className="map-popup">

              <strong>
                LIVE POLLUTION EVENT
              </strong>

              <div>
                Sensor: {event.sensor_id}
              </div>

              <div>
                Location: {event.location}
              </div>

              <div>
                Event: {event.event_type}
              </div>

              <div>
                Risk: {event.risk_level}
              </div>

              <div>
                AQI: {event.aqi.toFixed(1)}
              </div>

              <div>
                PM2.5: {event.pm25.toFixed(1)}
              </div>

              <div>
                PM10: {event.pm10.toFixed(1)}
              </div>

            </div>

          </Popup>

        </CircleMarker>


        {/* =================================================
            SENSOR SIGNAL RINGS
        ================================================= */}

        <CircleMarker
          center={center}
          radius={42}
          pathOptions={{
            color: "#ff5662",
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
            color: "#ff5662",
            fillOpacity: 0,
            weight: 1,
            dashArray: "3 12",
            className: "sensor-ring sensor-ring-two",
          }}
        />


        {/* =================================================
            PREDICTED TRAJECTORY
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
              Predicted pollution trajectory
            </Popup>

          </Polyline>

        )}


        {/* =================================================
            DEMO SENSOR POINTS
            These are visual indicators only.
        ================================================= */}

        <CircleMarker
          center={[
            event.latitude + 0.025,
            event.longitude - 0.018,
          ]}
          radius={5}
          pathOptions={{
            color: "#52f2c9",
            fillColor: "#52f2c9",
            fillOpacity: 0.9,
            weight: 1,
            className: "sensor-point",
          }}
        >

          <Popup>
            Monitoring sensor
          </Popup>

        </CircleMarker>


        <CircleMarker
          center={[
            event.latitude - 0.018,
            event.longitude + 0.028,
          ]}
          radius={5}
          pathOptions={{
            color: "#52f2c9",
            fillColor: "#52f2c9",
            fillOpacity: 0.9,
            weight: 1,
            className: "sensor-point",
          }}
        >

          <Popup>
            Monitoring sensor
          </Popup>

        </CircleMarker>


        <CircleMarker
          center={[
            event.latitude + 0.015,
            event.longitude + 0.035,
          ]}
          radius={5}
          pathOptions={{
            color: "#63ddff",
            fillColor: "#63ddff",
            fillOpacity: 0.9,
            weight: 1,
            className: "sensor-point",
          }}
        >

          <Popup>
            Monitoring sensor
          </Popup>

        </CircleMarker>

      </MapContainer>


      {/* =================================================
          MAP HUD
      ================================================= */}

      <div className="map-hud map-hud-top">

        <span className="map-live-dot" />

        LIVE POLLUTION MAP

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
          {event.risk_level}
        </em>

      </div>


      <div className="map-scan-line" />

    </div>
  )
}

export default PollutionMap


