import type { PollutionEvent, RiskData } from "../types"

interface EventPanelProps {
  event: PollutionEvent
  risk: RiskData
}

function EventPanel({ event, risk }: EventPanelProps) {
  return (
    <div className="card event-card">
      <div className="card-heading">
        <div>
          <span className="card-kicker">EVENT INTELLIGENCE</span>
          <h3>{event.event_id}</h3>
        </div>

        <span className="event-confidence">
          {(event.event_confidence * 100).toFixed(0)}% confidence
        </span>
      </div>

      <div className="event-details">
        <div className="event-detail">
          <span>PM2.5</span>
          <strong>{event.pm25} µg/m³</strong>
        </div>

        <div className="event-detail">
          <span>PM10</span>
          <strong>{event.pm10} µg/m³</strong>
        </div>

        <div className="event-detail">
          <span>NO₂</span>
          <strong>{event.no2} ppb</strong>
        </div>

        <div className="event-detail">
          <span>Temperature</span>
          <strong>{event.temperature}°C</strong>
        </div>

        <div className="event-detail">
          <span>Humidity</span>
          <strong>{event.humidity}%</strong>
        </div>

        <div className="event-detail">
          <span>Wind</span>
          <strong>
            {event.wind_speed} km/h · {event.wind_direction}°
          </strong>
        </div>

        <div className="event-detail">
          <span>Likely source</span>
          <strong>{risk.source}</strong>
        </div>

        <div className="event-detail">
          <span>Risk level</span>
          <strong className="danger-text">{risk.risk}</strong>
        </div>
      </div>
    </div>
  )
}

export default EventPanel