import type { EventPassportData } from "../types"

interface EventPassportProps {
  passport: EventPassportData
}

function EventPassport({ passport }: EventPassportProps) {
  return (
    <div className="card passport-card">
      <div className="passport-header">
        <div>
          <span className="card-kicker">STRUCTURED EVENT RECORD</span>
          <h3>{passport.eventId}</h3>
        </div>

        <span className="passport-status">
          {passport.status}
        </span>
      </div>

      <div className="passport-grid">
        <div className="passport-item">
          <span>Location</span>
          <strong>{passport.location}</strong>
        </div>

        <div className="passport-item">
          <span>Detected at</span>
          <strong>{passport.detectedAt}</strong>
        </div>

        <div className="passport-item">
          <span>Pollutant</span>
          <strong>{passport.pollutant}</strong>
        </div>

        <div className="passport-item">
          <span>Source</span>
          <strong>{passport.source}</strong>
        </div>

        <div className="passport-item">
          <span>Confidence</span>
          <strong>
            {(passport.confidence * 100).toFixed(0)}%
          </strong>
        </div>

        <div className="passport-item">
          <span>Predicted movement</span>
          <strong>{passport.predictedMovement}</strong>
        </div>

        <div className="passport-item">
          <span>Exposure</span>
          <strong>{passport.exposure}</strong>
        </div>

        <div className="passport-item">
          <span>Status</span>
          <strong>{passport.status}</strong>
        </div>
      </div>
    </div>
  )
}

export default EventPassport