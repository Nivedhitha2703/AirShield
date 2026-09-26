import type {
  Member2AIResponse,
} from "../types"


interface ResponsePanelProps {
  risk: Member2AIResponse
}


function ResponsePanel({
  risk,
}: ResponsePanelProps) {

  const exposedPopulation =
    risk.exposure.estimated_exposed_population


  return (

    <div className="card">

      <div className="card-header">

        <div>

          <span className="card-kicker">
            RESPONSE INTELLIGENCE
          </span>

          <h3>
            Recommended Response
          </h3>

        </div>

      </div>


      <div className="response-content">


        <div className="response-highlight">

          <span>
            Current risk
          </span>

          <strong>
            {risk.risk}
          </strong>

        </div>


        <div className="response-grid">


          <div className="response-item">

            <span>
              Predicted PM2.5
            </span>

            <strong>
              {risk.predicted_pm25.toFixed(1)}
            </strong>

          </div>


          <div className="response-item">

            <span>
              Forecast
            </span>

            <strong>
              {risk.forecast_horizon}
            </strong>

          </div>


          <div className="response-item">

            <span>
              Exposed population
            </span>

            <strong>
              {exposedPopulation.toLocaleString()}
            </strong>

          </div>


          <div className="response-item">

            <span>
              Exposure level
            </span>

            <strong>
              {risk.exposure.exposure_level}
            </strong>

          </div>


          <div className="response-item">

            <span>
              Schools affected
            </span>

            <strong>
              {risk.exposure.school_count}
            </strong>

          </div>


          <div className="response-item">

            <span>
              Hospitals affected
            </span>

            <strong>
              {risk.exposure.hospital_count}
            </strong>

          </div>


        </div>


        <div className="response-recommendation">

          <span className="card-kicker">
            RESPONSE GUIDANCE
          </span>


          <p>

            {risk.risk_score >= 0.7
              ? "High-risk conditions detected. Authorities should review the affected area and consider appropriate protective measures."
              : risk.risk_score >= 0.4
                ? "Elevated pollution conditions detected. Continue monitoring the affected area and review exposure levels."
                : "Pollution conditions are being monitored. Continue observing the latest AI risk assessment."
            }

          </p>

        </div>


      </div>

    </div>

  )
}


export default ResponsePanel