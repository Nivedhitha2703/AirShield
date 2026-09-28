import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  Circle,
  useMap,
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


/* ============================================================
   AUTO-CENTER / FIT MAP TO LIVE EVENT + TRAJECTORY
============================================================ */

function MapController({
  event,
  trajectory,
}: {
  event: Member1Event
  trajectory: [number, number][]
}) {
  const map = useMap()

  const points: [number, number][] = [
    [event.latitude, event.longitude],
    ...trajectory,
  ]

  if (points.length > 1) {
    const latitudes = points.map((point) => point[0])
    const longitudes = points.map((point) => point[1])

    const south = Math.min(...latitudes)
    const north = Math.max(...latitudes)
    const west = Math.min(...longitudes)
    const east = Math.max(...longitudes)

    map.fitBounds(
      [
        [south, west],
        [north, east],
      ],
      {
        padding: [40, 40],
        maxZoom: 12,
      }
    )
  } else {
    map.setView(
      [event.latitude, event.longitude],
      13
    )
  }

  return null
}


/* ============================================================
   MAP
============================================================ */

function PollutionMap({
  event,
  risk,
}: PollutionMapProps) {

  const center: [number, number] = [
    event.latitude,
    event.longitude,
  ]


  /* ==========================================================
     TRAJECTORY
  ========================================================== */

  const trajectory: [number, number][] =
    risk.trajectory.map(
      (point) =>
        [
          point.latitude,
          point.longitude,
        ] as [number, number]
    )


  /* ==========================================================
     PLUME CENTER LINE
  ========================================================== */

  const plume: [number, number][] =
    risk.plume
      .map((point) => {
        const item = point as {
          latitude: number
          longitude: number
        }

        return [
          item.latitude,
          item.longitude,
        ] as [number, number]
      })


  /* ==========================================================
     COMBINE TRAJECTORY + PLUME
  ========================================================== */

  const predictionPath =
    plume.length > 1
      ? plume
      : trajectory


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


        {/* =====================================================
            AUTOMATIC LIVE MAP POSITION
        ===================================================== */}

        <MapController
          event={event}
          trajectory={predictionPath}
        />


        {/* =====================================================
            OUTER POLLUTION ZONES
        ===================================================== */}

        <Circle
          center={center}
          radius={1800}
          pathOptions={{
            color: "#ff4654",
            fillColor: "#ff4654",
            fillOpacity: 0.035,
            weight: 1,
            className:
              "pollution-zone pollution-zone-one",
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
            className:
              "pollution-zone pollution-zone-two",
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
            className:
              "pollution-zone pollution-zone-three",
          }}
        />


        {/* =====================================================
            LIVE POLLUTION HOTSPOT
        ===================================================== */}

        <CircleMarker
          center={center}
          radius={28}
          pathOptions={{
            color: "#ff3f4d",
            fillColor: "#ff3f4d",
            fillOpacity: 0.16,
            weight: 2,
            className:
              "pollution-hotspot",
          }}
        />


        {/* =====================================================
            POLLUTION CORE
        ===================================================== */}

        <CircleMarker
          center={center}
          radius={12}
          pathOptions={{
            color: "#ff5965",
            fillColor: "#ff3445",
            fillOpacity: 0.9,
            weight: 2,
            className:
              "pollution-core",
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


        {/* =====================================================
            SENSOR SIGNAL RINGS
        ===================================================== */}

        <CircleMarker
          center={center}
          radius={42}
          pathOptions={{
            color: "#ff5662",
            fillOpacity: 0,
            weight: 1,
            dashArray: "4 8",
            className:
              "sensor-ring sensor-ring-one",
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
            className:
              "sensor-ring sensor-ring-two",
          }}
        />


        {/* =====================================================
            AI PREDICTED TRAJECTORY
        ===================================================== */}

        {trajectory.length > 1 && (

          <Polyline
            positions={trajectory}
            pathOptions={{
              color: "#57f5cf",
              weight: 4,
              opacity: 0.9,
              dashArray: "8 12",
              className:
                "pollution-trajectory",
            }}
          >

            <Popup>
              AI predicted pollution trajectory
            </Popup>

          </Polyline>

        )}


        {/* =====================================================
            AI PLUME CENTER
        ===================================================== */}

        {plume.length > 1 && (

          <Polyline
            positions={plume}
            pathOptions={{
              color: "#63ddff",
              weight: 2,
              opacity: 0.75,
              className:
                "pollution-plume-center",
            }}
          >

            <Popup>
              AI predicted pollution plume
            </Popup>

          </Polyline>

        )}


        {/* =====================================================
            PLUME SPREAD ZONES
        ===================================================== */}

        {risk.plume.map((point, index) => {

          const plumePoint = point as {
            latitude: number
            longitude: number
            estimated_width_km: number
            time_minutes: number
          }

          const radius =
            Math.max(
              150,
              (plumePoint.estimated_width_km * 1000) / 2
            )

          return (

            <Circle
              key={`plume-${index}`}
              center={[
                plumePoint.latitude,
                plumePoint.longitude,
              ]}
              radius={radius}
              pathOptions={{
                color: "#63ddff",
                fillColor: "#63ddff",
                fillOpacity: 0.035,
                weight: 1,
                opacity: 0.35,
                className:
                  "pollution-plume-zone",
              }}
            >

              <Popup>

                <div className="map-popup">

                  <strong>
                    PREDICTED PLUME
                  </strong>

                  <div>
                    Time:
                    {" "}
                    {plumePoint.time_minutes}
                    {" "}
                    min
                  </div>

                  <div>
                    Spread:
                    {" "}
                    {plumePoint.estimated_width_km.toFixed(2)}
                    {" "}
                    km
                  </div>

                </div>

              </Popup>

            </Circle>

          )
        })}


        {/* =====================================================
            TRAJECTORY POINTS
        ===================================================== */}

        {risk.trajectory.map(
          (point, index) => (

            <CircleMarker
              key={`trajectory-${index}`}
              center={[
                point.latitude,
                point.longitude,
              ]}
              radius={index === 0 ? 5 : 3}
              pathOptions={{
                color:
                  index === 0
                    ? "#ff4654"
                    : "#57f5cf",
                fillColor:
                  index === 0
                    ? "#ff4654"
                    : "#57f5cf",
                fillOpacity: 0.9,
                weight: 1,
              }}
            >

              <Popup>

                <div className="map-popup">

                  <strong>
                    AI TRAJECTORY
                  </strong>

                  <div>
                    Prediction:
                    {" "}
                    +{point.time_minutes}
                    {" "}
                    minutes
                  </div>

                  <div>
                    Latitude:
                    {" "}
                    {point.latitude.toFixed(5)}
                  </div>

                  <div>
                    Longitude:
                    {" "}
                    {point.longitude.toFixed(5)}
                  </div>

                </div>

              </Popup>

            </CircleMarker>

          )
        )}


        {/* =====================================================
            DEMO SENSOR POINTS
        ===================================================== */}

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
            className:
              "sensor-point",
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
            className:
              "sensor-point",
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
            className:
              "sensor-point",
          }}
        >

          <Popup>
            Monitoring sensor
          </Popup>

        </CircleMarker>

      </MapContainer>


      {/* =======================================================
          MAP HUD
      ======================================================= */}

      <div className="map-hud map-hud-top">

        <span className="map-live-dot" />

        LIVE AI POLLUTION MAP

      </div>


      <div className="map-hud map-hud-right">

        <span>
          PM2.5
        </span>

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


      {/* =======================================================
          AI PREDICTION HUD
      ======================================================= */}

      <div className="map-hud map-hud-prediction">

        <span>
          AI FORECAST
        </span>

        <strong>
          {risk.predicted_pm25.toFixed(1)}
        </strong>

        <small>
          μg/m³ · +1H
        </small>

      </div>


      <div className="map-scan-line" />

    </div>
  )
}


export default PollutionMap