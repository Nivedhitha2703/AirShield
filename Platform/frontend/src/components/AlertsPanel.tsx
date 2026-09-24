import type { Alert } from "../types"

interface AlertsPanelProps {
  alerts: Alert[]
}

function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="card alerts-card">
      <div className="card-heading">
        <div>
          <span className="card-kicker">EARLY WARNING</span>
          <h3>Active Alerts</h3>
        </div>

        <span className="alert-count">{alerts.length} alerts</span>
      </div>

      <div>
        {alerts.map((alert) => (
          <div className="alert" key={alert.id}>
            <div className={`alert-icon ${alert.severity.toLowerCase()}`}>
              {alert.severity === "SEVERE"
                ? "!"
                : alert.severity === "HIGH"
                  ? "⚠"
                  : "i"}
            </div>

            <div className="alert-content">
              <strong>{alert.severity} · {alert.type}</strong>
              <p>{alert.message}</p>
            </div>

            <span className="alert-time">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsPanel