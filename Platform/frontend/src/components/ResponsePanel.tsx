import type { Member2AIResponse } from "../types"

interface ResponsePanelProps {
  risk: Member2AIResponse
}

function ResponsePanel({ risk }: ResponsePanelProps) {

  const riskPercentage = Math.round(risk.risk_score * 100)
  const sourceConfidence = Math.round(
    risk.source_confidence * 100
  )

  const exposure = risk.exposure

  return (
    <section className="dashboard-section response-section">

      {/* HEADER */}

      <div className="response-heading">

        <div>
          <span className="section-kicker">
            RESPONSE INTELLIGENCE
          </span>

          <h2>
            Recommended Response
          </h2>

          <p>
            AI-assisted guidance based on current pollution
            conditions and predicted exposure.
          </p>
        </div>

      </div>


      {/* PRIMARY RESPONSE */}

      <div className="response-primary-card">

        <div className="response-primary-icon">
          ✓
        </div>

        <div className="response-primary-content">

          <span className="section-kicker">
            AI ASSESSMENT
          </span>

          <h3>
            Enhanced monitoring recommended
          </h3>

          <p>
            Elevated pollution conditions have been
            detected. Continue monitoring the affected
            area and review exposure levels as the
            forecast develops.
          </p>

        </div>

        <div className="response-risk-badge">
          {risk.risk}
        </div>

      </div>


      {/* AI SNAPSHOT */}

      <div className="response-card">

        <div className="response-card-header">

          <div>
            <span className="section-kicker">
              RISK SNAPSHOT
            </span>

            <h3>
              Current AI assessment
            </h3>
          </div>

          <span className="response-score">
            {riskPercentage}%
          </span>

        </div>


        <div className="response-metrics">

          <div className="response-metric">
            <span>Risk Score</span>
            <strong>
              {riskPercentage}%
            </strong>
          </div>

          <div className="response-metric">
            <span>Predicted PM2.5</span>
            <strong>
              {risk.predicted_pm25.toFixed(1)}
              <small> µg/m³</small>
            </strong>
          </div>

          <div className="response-metric">
            <span>Forecast</span>
            <strong>
              {risk.forecast_horizon === "1_hour"
                ? "1 hour"
                : risk.forecast_horizon}
            </strong>
          </div>

          <div className="response-metric">
            <span>Source</span>
            <strong>
              {risk.probable_source}
            </strong>
          </div>

        </div>

      </div>


      {/* EXPOSURE + SOURCE */}

      <div className="response-two-column">

        {/* EXPOSURE */}

        <div className="response-card">

          <div className="response-card-header">

            <div>
              <span className="section-kicker">
                EXPOSURE
              </span>

              <h3>
                Potentially affected areas
              </h3>
            </div>

            <span className="exposure-badge">
              {exposure.exposure_level}
            </span>

          </div>


          <div className="exposure-main">

            <strong>
              {exposure.estimated_exposed_population.toLocaleString()}
            </strong>

            <span>
              estimated exposed population
            </span>

          </div>


          <div className="exposure-stats">

            <div>
              <span>Schools</span>
              <strong>
                {exposure.school_count}
              </strong>
            </div>

            <div>
              <span>Hospitals</span>
              <strong>
                {exposure.hospital_count}
              </strong>
            </div>

          </div>

        </div>


        {/* SOURCE */}

        <div className="response-card">

          <span className="section-kicker">
            POLLUTION SOURCE
          </span>

          <h3>
            Probable source
          </h3>


          <div className="source-highlight">

            <strong>
              {risk.probable_source}
            </strong>

            <span>
              {sourceConfidence}% model confidence
            </span>

          </div>


          <div className="source-confidence-track">

            <div
              style={{
                width: `${sourceConfidence}%`,
              }}
            />

          </div>


          <p className="source-note">
            Source identification is an AI-derived
            assessment and should be interpreted alongside
            sensor observations.
          </p>

        </div>

      </div>


      {/* GUIDANCE */}

      <div className="response-guidance">

        <div className="guidance-icon">
          !
        </div>

        <div>

          <span className="section-kicker">
            RESPONSE GUIDANCE
          </span>

          <h3>
            Monitor conditions and reassess exposure
          </h3>

          <p>
            Elevated pollution conditions have been
            detected. Continue monitoring the affected
            area and review the forecast as new
            intelligence becomes available.
          </p>

        </div>

      </div>

    </section>
  )
}

export default ResponsePanel