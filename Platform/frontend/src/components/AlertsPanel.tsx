import type {
  Member1Event,
  Member2AIResponse,
} from "../types"

interface AlertsPanelProps {
  member1: Member1Event
  member2?: Member2AIResponse
}

function AlertsPanel({
  member1,
  member2,
}: AlertsPanelProps) {

  const alerts = [
    {
      type: "POLLUTION",
      severity: "HIGH",
      message: `${member1.event_type} detected with AQI ${Math.round(member1.aqi)}.`,
      time: member1.timestamp,
    },

    {
      type: "PM2.5",
      severity: "CRITICAL",
      message: `PM2.5 concentration reached ${member1.pm25.toFixed(1)} µg/m³.`,
      time: member1.timestamp,
    },

    {
      type: "PM10",
      severity: "CRITICAL",
      message: `PM10 concentration reached ${member1.pm10.toFixed(1)} µg/m³.`,
      time: member1.timestamp,
    },

    ...(member2
      ? [
          {
            type: "AI RISK",
            severity: "HIGH",
            message: `AI classified the event as ${member2.risk} with a ${Math.round(
              member2.risk_score * 100
            )}% risk score.`,
            time: "AI analysis",
          },

          {
            type: "SOURCE",
            severity: "INFO",
            message: `Probable pollution source: ${
              member2.probable_source
            } (${Math.round(
              member2.source_confidence * 100
            )}% confidence).`,
            time: "AI analysis",
          },
        ]
      : []),
  ]

  return (
    <section
      id="alerts"
      className="dashboard-section alerts-section"
    >

      {/* HEADER */}

      <div className="alerts-heading">

        <div>
          <span className="section-kicker">
            AIRSHIELD ALERTS
          </span>

          <h2>
            Pollution Alerts
          </h2>

          <p>
            Important environmental events detected by
            AirShield intelligence.
          </p>
        </div>

        <div className="alert-count">
          <strong>
            {alerts.length}
          </strong>

          <span>
            ACTIVE ALERTS
          </span>
        </div>

      </div>


      {/* ALERT LIST */}

      <div className="alerts-list">

        {alerts.map((alert, index) => (

          <article
            key={`${alert.type}-${index}`}
            className={`alert-card severity-${alert.severity.toLowerCase()}`}
          >

            <div className="alert-indicator">
              <span />
            </div>


            <div className="alert-content">

              <div className="alert-topline">

                <span className="alert-type">
                  {alert.type}
                </span>

                <span className="alert-severity">
                  {alert.severity}
                </span>

              </div>


              <p className="alert-message">
                {alert.message}
              </p>


              <span className="alert-time">
                {alert.time}
              </span>

            </div>

          </article>

        ))}

      </div>

    </section>
  )
}

export default AlertsPanel