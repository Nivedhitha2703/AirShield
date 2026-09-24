import type { RiskData } from "../types"

interface ResponsePanelProps {
  risk: RiskData
}

function ResponsePanel({ risk }: ResponsePanelProps) {
  const recommendations = [
    `Prepare for elevated pollution conditions within ${risk.predicted_arrival_minutes} minutes.`,
    "Limit prolonged outdoor activity in the predicted exposure zone.",
    "Issue precautionary notifications to nearby schools and hospitals.",
    "Monitor the pollution trajectory for changes in wind direction.",
  ]

  return (
    <div className="card response-card">
      <div className="card-heading">
        <div>
          <span className="card-kicker">ACTION ENGINE</span>
          <h3>Recommended Response</h3>
        </div>
      </div>

      <div className="response-summary">
        <strong>{risk.exposed_population.toLocaleString()}</strong>
        <span>people potentially exposed</span>
      </div>

      <div className="response-list">
        {recommendations.map((recommendation, index) => (
          <div className="response-item" key={index}>
            <p>{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResponsePanel