import type { RiskData } from "../types"

interface RiskDashboardProps {
  risk: RiskData
}

function RiskDashboard({ risk }: RiskDashboardProps) {
  const riskPercentage = Math.round(risk.risk_score * 100)

  return (
    <div className="card risk-card">
      <div className="risk-header">
        <div>
          <span className="card-kicker">RISK ASSESSMENT</span>
          <h3>Pollution Risk</h3>
        </div>

        <span className="risk-badge">{risk.risk}</span>
      </div>

      <div className="risk-score">
        <strong>{riskPercentage}</strong>
        <span>/ 100 risk score</span>
      </div>

      <div className="risk-meter">
        <div
          className="risk-meter-fill"
          style={{ width: `${riskPercentage}%` }}
        />
      </div>

      <div className="risk-details">
        <div className="risk-detail">
          <span>Predicted arrival</span>
          <strong>{risk.predicted_arrival_minutes} min</strong>
        </div>

        <div className="risk-detail">
          <span>Source confidence</span>
          <strong>{Math.round(risk.source_confidence * 100)}%</strong>
        </div>

        <div className="risk-detail">
          <span>Exposed population</span>
          <strong>{risk.exposed_population.toLocaleString()}</strong>
        </div>

        <div className="risk-detail">
          <span>Pollution source</span>
          <strong>{risk.source}</strong>
        </div>
      </div>
    </div>
  )
}

export default RiskDashboard