import type { Member1Event, Member2AIResponse } from "../types"

interface EventPassportProps {
  member1: Member1Event
  member2?: Member2AIResponse
}

function EventPassport({
  member1,
  member2,
}: EventPassportProps) {
  const risk = member2?.risk ?? member1.risk_level
  const source = member2?.probable_source ?? "Under analysis"
  const confidence = member2
    ? Math.round(member2.source_confidence * 100)
    : null

  const exposure = member2?.exposure
  const population = exposure?.estimated_exposed_population ?? 0

  const movement =
    member2?.forecast_horizon
      ? `Forecast horizon: ${member2.forecast_horizon}`
      : "Predictive movement unavailable"

  return (
    <section
      id="event-passport"
      className="dashboard-section passport-section"
    >
      {/* HEADER */}

      <div className="passport-heading">
        <div>
          <span className="section-kicker">
            INCIDENT RECORD
          </span>

          <h2>Event Passport</h2>

          <p>
            A consolidated identity record for the detected
            pollution event and its AI-derived intelligence.
          </p>
        </div>

        <div className="passport-event-id">
          <span>EVENT</span>
          <strong>{member1.event_id}</strong>
        </div>
      </div>

      {/* MAIN PASSPORT */}

      <div className="passport-card">

        {/* TOP STATUS */}

        <div className="passport-top">

          <div className="passport-status-block">
            <span className="passport-label">
              CURRENT STATUS
            </span>

            <div className="passport-status">
              <span className="passport-status-dot" />
              Active intelligence
            </div>
          </div>

          <div className="passport-risk">
            <span>RISK LEVEL</span>
            <strong>{risk}</strong>
          </div>

        </div>

        {/* CORE INFORMATION */}

        <div className="passport-grid">

          <div className="passport-info">
            <span className="passport-label">
              DETECTED AT
            </span>

            <strong>
              {member1.timestamp}
            </strong>

            <small>
              Sensor {member1.sensor_id}
            </small>
          </div>

          <div className="passport-info">
            <span className="passport-label">
              LOCATION
            </span>

            <strong>
              {member1.latitude.toFixed(5)},{" "}
              {member1.longitude.toFixed(5)}
            </strong>

            <small>
              Geographic event coordinates
            </small>
          </div>

          <div className="passport-info">
            <span className="passport-label">
              POLLUTANT
            </span>

            <strong>
              PM2.5
            </strong>

            <small>
              {member1.pm25.toFixed(1)} µg/m³ detected
            </small>
          </div>

          <div className="passport-info">
            <span className="passport-label">
              EVENT TYPE
            </span>

            <strong>
              {member1.event_type}
            </strong>

            <small>
              AQI {Math.round(member1.aqi)}
            </small>
          </div>

        </div>

        {/* AI INTELLIGENCE */}

        <div className="passport-intelligence">

          <div className="passport-intelligence-header">
            <div>
              <span className="passport-label">
                AI INTELLIGENCE
              </span>

              <h3>
                Event interpretation
              </h3>
            </div>

            <span className="passport-ai-tag">
              AI ANALYZED
            </span>
          </div>

          <div className="passport-ai-grid">

            <div className="passport-ai-item">
              <span>PROBABLE SOURCE</span>
              <strong>{source}</strong>
            </div>

            <div className="passport-ai-item">
              <span>SOURCE CONFIDENCE</span>

              <strong>
                {confidence !== null
                  ? `${confidence}%`
                  : "Pending"}
              </strong>
            </div>

            <div className="passport-ai-item">
              <span>PREDICTED PM2.5</span>

              <strong>
                {member2
                  ? `${member2.predicted_pm25.toFixed(1)} µg/m³`
                  : "Pending"}
              </strong>
            </div>

            <div className="passport-ai-item">
              <span>EXPOSURE LEVEL</span>

              <strong>
                {exposure?.exposure_level ?? "Pending"}
              </strong>
            </div>

          </div>
        </div>

        {/* MOVEMENT / EXPOSURE */}

        <div className="passport-bottom-grid">

          <div className="passport-detail-card">

            <span className="passport-label">
              PREDICTED MOVEMENT
            </span>

            <h3>
              {member2
                ? `${member2.trajectory.length} trajectory points`
                : "Unavailable"}
            </h3>

            <p>
              {movement}
            </p>

          </div>

          <div className="passport-detail-card">

            <span className="passport-label">
              EXPOSURE INTELLIGENCE
            </span>

            <h3>
              {population.toLocaleString()}
            </h3>

            <p>
              Estimated exposed population
            </p>

            <div className="passport-exposure-meta">
              <span>
                Schools:{" "}
                {exposure?.school_count ?? 0}
              </span>

              <span>
                Hospitals:{" "}
                {exposure?.hospital_count ?? 0}
              </span>
            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="passport-footer">

          <span>
            AIRSHIELD INCIDENT RECORD
          </span>

          <span>
            {member1.event_id}
          </span>

        </div>

      </div>
    </section>
  )
}

export default EventPassport