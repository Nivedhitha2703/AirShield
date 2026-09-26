import type {
  Member1Event,
  Member2AIResponse,
} from "../types"

interface EventPanelProps {
  event: Member1Event
  risk: Member2AIResponse
}

function EventPanel({
  event,
  risk,
}: EventPanelProps) {

  const anomalyScore = Math.abs(event.anomaly_score)

  const eventDetails = [
    {
      label: "SENSOR",
      value: event.sensor_id,
    },
    {
      label: "EVENT TYPE",
      value: event.event_type,
    },
    {
      label: "RISK LEVEL",
      value: event.risk_level,
    },
    {
      label: "LOCATION",
      value: event.location,
    },
  ]

  const pollutantData = [
    {
      label: "PM2.5",
      value: event.pm25,
      unit: "μg/m³",
    },
    {
      label: "PM10",
      value: event.pm10,
      unit: "μg/m³",
    },
    {
      label: "NO₂",
      value: event.no2,
      unit: "μg/m³",
    },
    {
      label: "SO₂",
      value: event.so2,
      unit: "μg/m³",
    },
    {
      label: "CO",
      value: event.co,
      unit: "mg/m³",
    },
  ]

  return (
    <section className="event-panel">

      <div className="event-panel-header">

        <div>
          <span className="section-kicker">
            EVENT INTELLIGENCE
          </span>

          <h2>
            Pollution Event
          </h2>

          <p>
            Real-time event detected by the AirShield monitoring network
          </p>
        </div>

        <div className="event-live-status">
          <span />
          EVENT ACTIVE
        </div>

      </div>

      <div className="event-panel-grid">

        {/* Event information */}

        <div className="event-information">

          <div className="event-info-heading">
            <span>DETECTION DATA</span>

            <div className="event-scan-indicator">
              <i />
              SCANNING
            </div>
          </div>

          <div className="event-details">

            {eventDetails.map((item) => (

              <div
                className="event-detail-row"
                key={item.label}
              >

                <span>
                  {item.label}
                </span>

                <strong>
                  {item.value}
                </strong>

              </div>

            ))}

          </div>

        </div>

        {/* Pollutant readings */}

        <div className="event-pollutants">

          <div className="event-info-heading">
            <span>POLLUTANT PROFILE</span>
          </div>

          <div className="pollutant-grid">

            {pollutantData.map((pollutant) => (

              <div
                className="pollutant-card"
                key={pollutant.label}
              >

                <span>
                  {pollutant.label}
                </span>

                <strong>
                  {pollutant.value.toFixed(1)}
                </strong>

                <small>
                  {pollutant.unit}
                </small>

                <div className="pollutant-line">
                  <div
                    style={{
                      width: `${Math.min(
                        pollutant.value /
                          (pollutant.label === "CO"
                            ? 2
                            : 3),
                        100
                      )}%`,
                    }}
                  />
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Event intelligence summary */}

      <div className="event-intelligence">

        <div className="event-intelligence-card">

          <div className="event-intelligence-icon">
            AI
          </div>

          <div>

            <span>
              AI RISK ASSESSMENT
            </span>

            <strong>
              {risk.risk}
            </strong>

          </div>

        </div>

        <div className="event-intelligence-card">

          <div className="event-intelligence-icon">
            AQ
          </div>

          <div>

            <span>
              AIR QUALITY INDEX
            </span>

            <strong>
              {Math.round(event.aqi)}
            </strong>

          </div>

        </div>

        <div className="event-intelligence-card">

          <div className="event-intelligence-icon">
            AN
          </div>

          <div>

            <span>
              ANOMALY SIGNAL
            </span>

            <strong>
              {anomalyScore.toFixed(3)}
            </strong>

          </div>

        </div>

        <div className="event-intelligence-card">

          <div className="event-intelligence-icon">
            SR
          </div>

          <div>

            <span>
              PROBABLE SOURCE
            </span>

            <strong>
              {risk.probable_source}
            </strong>

          </div>

        </div>

      </div>

    </section>
  )
}

export default EventPanel