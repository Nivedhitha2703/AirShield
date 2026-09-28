import type {
  Member1Event,
  Member2AIResponse,
} from "../types"

interface EventPanelProps {
  member1: Member1Event
  member2?: Member2AIResponse
}

function EventPanel({
  member1,
  member2,
}: EventPanelProps) {

  const confidence = member2
    ? Math.round(member2.source_confidence * 100)
    : 0

  return (
    <section className="dashboard-section event-panel-section">

      {/* HEADER */}

      <div className="event-panel-heading">

        <div>
          <span className="section-kicker">
            DETECTED POLLUTION EVENT
          </span>

          <div className="event-title-row">

            <h2>
              {member1.event_id}
            </h2>

            <span className="event-status-badge">
              {member2?.risk || member1.risk_level}
            </span>

          </div>

          <p>
            Environmental event detected by sensor
            monitoring.
          </p>
        </div>

      </div>


      {/* EVENT METRICS */}

      <div className="event-data-grid">

        <div className="event-data-item">
          <span>Sensor</span>
          <strong>{member1.sensor_id}</strong>
        </div>

        <div className="event-data-item">
          <span>Event Type</span>
          <strong>{member1.event_type}</strong>
        </div>

        <div className="event-data-item">
          <span>PM2.5</span>
          <strong>
            {member1.pm25.toFixed(1)}
            <small> µg/m³</small>
          </strong>
        </div>

        <div className="event-data-item">
          <span>PM10</span>
          <strong>
            {member1.pm10.toFixed(1)}
            <small> µg/m³</small>
          </strong>
        </div>

        <div className="event-data-item">
          <span>NO₂</span>
          <strong>
            {member1.no2.toFixed(1)}
          </strong>
        </div>

        <div className="event-data-item">
          <span>AQI</span>
          <strong>
            {Math.round(member1.aqi)}
          </strong>
        </div>

        <div className="event-data-item">
          <span>Temperature</span>
          <strong>
            {member1.temperature.toFixed(1)}
            <small> °C</small>
          </strong>
        </div>

        <div className="event-data-item">
          <span>Humidity</span>
          <strong>
            {member1.humidity.toFixed(1)}
            <small> %</small>
          </strong>
        </div>

        <div className="event-data-item">
          <span>Wind Speed</span>
          <strong>
            {member1.wind_speed.toFixed(1)}
            <small> m/s</small>
          </strong>
        </div>

        <div className="event-data-item">
          <span>Wind Direction</span>
          <strong>
            {Math.round(member1.wind_direction)}
            <small>°</small>
          </strong>
        </div>

      </div>


      {/* LOCATION */}

      <div className="event-location-panel">

        <div>
          <span className="section-kicker">
            EVENT LOCATION
          </span>

          <strong>
            {member1.latitude.toFixed(5)},{" "}
            {member1.longitude.toFixed(5)}
          </strong>
        </div>

        <div className="location-coordinates">
          LAT {member1.latitude.toFixed(5)}
          <span>•</span>
          LNG {member1.longitude.toFixed(5)}
        </div>

      </div>


      {/* AI INTELLIGENCE */}

      {member2 && (

        <div className="event-ai-panel">

          <div className="event-ai-icon">
            ✦
          </div>

          <div className="event-ai-content">

            <span className="section-kicker">
              AI INTELLIGENCE
            </span>

            <p>
              Predicted PM2.5:
              <strong>
                {member2.predicted_pm25.toFixed(1)} µg/m³
              </strong>

              <span className="ai-divider">
                •
              </span>

              Source:
              <strong>
                {member2.probable_source}
              </strong>

              <span className="ai-divider">
                •
              </span>

              Confidence:
              <strong>
                {confidence}%
              </strong>
            </p>

          </div>

        </div>

      )}

    </section>
  )
}

export default EventPanel