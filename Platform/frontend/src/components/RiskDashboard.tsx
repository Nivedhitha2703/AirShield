import type {
  Member1Event,
  Member2AIResponse,
} from "../types"

interface RiskDashboardProps {
  event: Member1Event
  risk: Member2AIResponse
}

function RiskDashboard({
  event,
  risk,
}: RiskDashboardProps) {

  const riskScore = Math.round(risk.risk_score * 100)

  const metrics = [
    {
      label: "AQI",
      value: Math.round(event.aqi),
      unit: "",
      className: "risk-metric-danger",
    },
    {
      label: "PM2.5",
      value: event.pm25.toFixed(1),
      unit: "μg/m³",
      className: "risk-metric-warning",
    },
    {
      label: "PM10",
      value: event.pm10.toFixed(1),
      unit: "μg/m³",
      className: "risk-metric-warning",
    },
    {
      label: "AI RISK",
      value: riskScore,
      unit: "%",
      className: "risk-metric-ai",
    },
  ]

  return (
    <section className="risk-dashboard">

      <div className="section-heading">

        <div>
          <span className="section-kicker">
            RISK INTELLIGENCE
          </span>

          <h2>
            Environmental Risk
          </h2>

          <p>
            Real-time pollution indicators and AI risk assessment
          </p>
        </div>

        <div className="risk-status">
          <span className="risk-status-dot" />
          LIVE ANALYSIS
        </div>

      </div>

      <div className="risk-grid">

        {metrics.map((metric) => (

          <div
            key={metric.label}
            className={`risk-card ${metric.className}`}
          >

            <div className="risk-card-top">
              <span>{metric.label}</span>
              <i />
            </div>

            <div className="risk-value">
              {metric.value}
              <small>{metric.unit}</small>
            </div>

            <div className="risk-meter">

              <div
                className="risk-meter-fill"
                style={{
                  width: `${
                    Math.min(
                      metric.label === "AI RISK"
                        ? riskScore
                        : metric.label === "AQI"
                          ? Math.min(event.aqi / 3, 100)
                          : metric.label === "PM2.5"
                            ? Math.min(event.pm25 / 2, 100)
                            : Math.min(event.pm10 / 4, 100),
                      100
                    )
                  }%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

      <div className="risk-analysis">

        <div className="risk-analysis-main">

          <div className="risk-analysis-header">

            <div>

              <span className="section-kicker">
                AI ASSESSMENT
              </span>

              <h3>
                Current Risk Level
              </h3>

            </div>

            <div className="risk-badge">
              {risk.risk}
            </div>

          </div>

          <div className="risk-score">

            <div
              className="risk-score-ring"
              style={
                {
                  "--risk-score": riskScore,
                } as React.CSSProperties
              }
            >

              <div className="risk-score-inner">

                <strong>
                  {riskScore}
                </strong>

                <span>
                  RISK
                </span>

              </div>

            </div>

            <div className="risk-score-info">

              <div className="risk-info-row">

                <span>
                  Predicted PM2.5
                </span>

                <strong>
                  {risk.predicted_pm25.toFixed(1)}
                  <small> μg/m³</small>
                </strong>

              </div>

              <div className="risk-info-row">

                <span>
                  Forecast Horizon
                </span>

                <strong>
                  {risk.forecast_horizon.replace("_", " ")}
                </strong>

              </div>

              <div className="risk-info-row">

                <span>
                  Probable Source
                </span>

                <strong>
                  {risk.probable_source}
                </strong>

              </div>

            </div>

          </div>

        </div>

        <div className="risk-environment">

          <div className="environment-title">

            <span className="section-kicker">
              ENVIRONMENT
            </span>

            <span className="environment-live">
              ● LIVE
            </span>

          </div>

          <div className="environment-grid">

            <div>
              <span>
                Temperature
              </span>

              <strong>
                {event.temperature.toFixed(1)}°C
              </strong>
            </div>

            <div>
              <span>
                Humidity
              </span>

              <strong>
                {event.humidity.toFixed(1)}%
              </strong>
            </div>

            <div>
              <span>
                Wind Speed
              </span>

              <strong>
                {event.wind_speed.toFixed(1)} km/h
              </strong>
            </div>

            <div>
              <span>
                Wind Direction
              </span>

              <strong>
                {event.wind_direction.toFixed(0)}°
              </strong>
            </div>

          </div>

          <div className="risk-source">

            <span>
              AI SOURCE CONFIDENCE
            </span>

            <div className="confidence-bar">

              <div
                style={{
                  width: `${Math.min(
                    risk.source_confidence * 100,
                    100
                  )}%`,
                }}
              />

            </div>

            <strong>
              {(risk.source_confidence * 100).toFixed(1)}%
            </strong>

          </div>

        </div>

      </div>

    </section>
  )
}

export default RiskDashboard