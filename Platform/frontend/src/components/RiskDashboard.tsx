import type { Member1Event, Member2AIResponse } from "../types"

interface RiskDashboardProps {
  event: Member1Event
  risk: Member2AIResponse
}

function RiskDashboard({
  event,
  risk,
}: RiskDashboardProps) {

  const riskPercentage = Math.round(
    risk.risk_score * 100
  )

  const sourceConfidence = Math.round(
    risk.source_confidence * 100
  )

  return (
    <section
      id="risk-intelligence"
      className="dashboard-section risk-dashboard-section"
    >

      {/* SECTION HEADER */}
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            RISK INTELLIGENCE
          </span>

          <h2>
            Environmental Risk
          </h2>

          <p>
            Pollution indicators and AI-derived risk assessment
          </p>
        </div>
      </div>


      {/* TOP METRICS */}
      <div className="risk-metrics-grid">

        <div className="risk-metric-card">
          <span className="metric-label">
            AQI
          </span>

          <strong>
            {Math.round(event.aqi)}
          </strong>

          <small>
            Air Quality Index
          </small>
        </div>


        <div className="risk-metric-card">
          <span className="metric-label">
            PM2.5
          </span>

          <strong>
            {event.pm25.toFixed(1)}
          </strong>

          <small>
            µg/m³
          </small>
        </div>


        <div className="risk-metric-card">
          <span className="metric-label">
            PM10
          </span>

          <strong>
            {event.pm10.toFixed(1)}
          </strong>

          <small>
            µg/m³
          </small>
        </div>


        <div className="risk-metric-card ai-risk-card">
          <span className="metric-label">
            AI RISK
          </span>

          <strong>
            {riskPercentage}%
          </strong>

          <small>
            Model risk score
          </small>
        </div>

      </div>


      {/* AI ASSESSMENT */}
      <div className="risk-assessment-card">

        <div className="assessment-header">

          <div>
            <span className="section-kicker">
              AI ASSESSMENT
            </span>

            <h3>
              Current Risk Level
            </h3>
          </div>

          <div className="risk-status">
            {risk.risk}
          </div>

        </div>


        <div className="assessment-grid">

          <div className="assessment-item">
            <span>
              AI Risk Score
            </span>

            <strong>
              {riskPercentage}%
            </strong>
          </div>


          <div className="assessment-item">
            <span>
              Predicted PM2.5
            </span>

            <strong>
              {risk.predicted_pm25.toFixed(1)}
              <small> µg/m³</small>
            </strong>
          </div>


          <div className="assessment-item">
            <span>
              Forecast Horizon
            </span>

            <strong>
              {risk.forecast_horizon === "1_hour"
                ? "Next 1 hour"
                : risk.forecast_horizon}
            </strong>
          </div>


          <div className="assessment-item">
            <span>
              Probable Source
            </span>

            <strong>
              {risk.probable_source}
            </strong>
          </div>

        </div>

      </div>


      {/* ENVIRONMENT + SOURCE */}
      <div className="risk-two-column">

        {/* ENVIRONMENT */}
        <div className="risk-info-card">

          <div className="card-title-row">
            <div>
              <span className="section-kicker">
                ENVIRONMENT
              </span>

              <h3>
                Sensor Conditions
              </h3>
            </div>

            <span className="live-indicator">
              ● SENSOR DATA
            </span>
          </div>


          <div className="environment-grid">

            <div>
              <span>Temperature</span>
              <strong>
                {event.temperature.toFixed(1)}°C
              </strong>
            </div>

            <div>
              <span>Humidity</span>
              <strong>
                {event.humidity.toFixed(1)}%
              </strong>
            </div>

            <div>
              <span>Wind Speed</span>
              <strong>
                {event.wind_speed.toFixed(1)} m/s
              </strong>
            </div>

            <div>
              <span>Wind Direction</span>
              <strong>
                {Math.round(event.wind_direction)}°
              </strong>
            </div>

          </div>

        </div>


        {/* SOURCE CONFIDENCE */}
        <div className="risk-info-card">

          <span className="section-kicker">
            AI SOURCE ANALYSIS
          </span>

          <h3>
            Probable Pollution Source
          </h3>


          <div className="source-result">

            <div>
              <strong>
                {risk.probable_source}
              </strong>

              <span>
                Model confidence
              </span>
            </div>

            <strong className="confidence-value">
              {sourceConfidence}%
            </strong>

          </div>


          <div className="confidence-track">
            <div
              className="confidence-fill"
              style={{
                width: `${sourceConfidence}%`,
              }}
            />
          </div>

        </div>

      </div>


      {/* EVENT SUMMARY */}
      <div className="event-summary-card">

        <div className="card-title-row">

          <div>
            <span className="section-kicker">
              DETECTED EVENT
            </span>

            <h3>
              {event.event_id}
            </h3>
          </div>

          <span className="event-risk-badge">
            {risk.risk}
          </span>

        </div>


        <div className="event-summary-grid">

          <div>
            <span>Sensor</span>
            <strong>{event.sensor_id}</strong>
          </div>

          <div>
            <span>Event Type</span>
            <strong>{event.event_type}</strong>
          </div>

          <div>
            <span>PM2.5</span>
            <strong>
              {event.pm25.toFixed(1)} µg/m³
            </strong>
          </div>

          <div>
            <span>PM10</span>
            <strong>
              {event.pm10.toFixed(1)} µg/m³
            </strong>
          </div>

          <div>
            <span>NO₂</span>
            <strong>
              {event.no2.toFixed(1)}
            </strong>
          </div>

          <div>
            <span>AQI</span>
            <strong>
              {Math.round(event.aqi)}
            </strong>
          </div>

          <div className="event-location">
            <span>Event Location</span>
            <strong>
              {event.latitude.toFixed(5)},{" "}
              {event.longitude.toFixed(5)}
            </strong>
          </div>

        </div>

      </div>


      {/* AI SUMMARY */}
      <div className="ai-summary-card">

        <div className="ai-summary-icon">
          ✦
        </div>

        <div>

          <span className="section-kicker">
            AI INTELLIGENCE
          </span>

          <p>
            The model predicts PM2.5 at{" "}
            <strong>
              {risk.predicted_pm25.toFixed(1)} µg/m³
            </strong>{" "}
            over the{" "}
            <strong>
              {risk.forecast_horizon === "1_hour"
                ? "next 1 hour"
                : risk.forecast_horizon}
            </strong>
            . The probable pollution source is{" "}
            <strong>
              {risk.probable_source}
            </strong>{" "}
            with{" "}
            <strong>
              {sourceConfidence}% confidence
            </strong>
            .
          </p>

        </div>

      </div>

    </section>
  )
}

export default RiskDashboard