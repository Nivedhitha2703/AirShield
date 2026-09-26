import type {
  Member1Event,
  Member2AIResponse,
} from "../types"

interface EventPassportProps {
  member1: Member1Event
  member2: Member2AIResponse
}

function formatTrajectory(member2: Member2AIResponse) {
  if (!member2.trajectory || member2.trajectory.length === 0) {
    return "Trajectory data pending"
  }

  const first = member2.trajectory[0]
  const last = member2.trajectory[member2.trajectory.length - 1]

  const distance = Math.sqrt(
    Math.pow(last.latitude - first.latitude, 2) +
    Math.pow(last.longitude - first.longitude, 2)
  )

  if (distance < 0.0001) {
    return "Minimal movement detected"
  }

  const direction = getDirection(
    first.latitude,
    first.longitude,
    last.latitude,
    last.longitude
  )

  return `${direction} • ${member2.forecast_horizon}`
}

function getDirection(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
) {
  const latDiff = endLat - startLat
  const lngDiff = endLng - startLng

  const vertical =
    Math.abs(latDiff) < 0.00001
      ? ""
      : latDiff > 0
        ? "North"
        : "South"

  const horizontal =
    Math.abs(lngDiff) < 0.00001
      ? ""
      : lngDiff > 0
        ? "East"
        : "West"

  if (vertical && horizontal) {
    return `${vertical}-${horizontal}`
  }

  return vertical || horizontal || "Minimal movement"
}

function formatExposure(member2: Member2AIResponse) {
  const population =
    member2.exposure?.estimated_exposed_population

  const level =
    member2.exposure?.exposure_level

  if (population) {
    return `${level} • ${population.toLocaleString()} people`
  }

  return level || "Unknown"
}

function EventPassport({
  member1,
  member2,
}: EventPassportProps) {

  const confidence =
    member2.source_confidence * 100

  return (
    <div className="card passport-card">

      <div className="passport-header">

        <div>

          <span className="card-kicker">
            STRUCTURED EVENT RECORD
          </span>

          <h3>
            {member2.event_id}
          </h3>

        </div>

        <span className="passport-status">
          {member2.risk}
        </span>

      </div>


      <div className="passport-grid">

        <div className="passport-item">
          <span>Location</span>

          <strong>
            {member1.latitude.toFixed(5)},{" "}
            {member1.longitude.toFixed(5)}
          </strong>
        </div>


        <div className="passport-item">
          <span>Detected at</span>

          <strong>
            Live detection
          </strong>
        </div>


        <div className="passport-item">
          <span>Pollutant</span>

          <strong>
            PM2.5
          </strong>
        </div>


        <div className="passport-item">
          <span>Source</span>

          <strong>
            {member2.probable_source}
          </strong>
        </div>


        <div className="passport-item">
          <span>Confidence</span>

          <strong>
            {confidence.toFixed(1)}%
          </strong>
        </div>


        <div className="passport-item">
          <span>Predicted movement</span>

          <strong>
            {formatTrajectory(member2)}
          </strong>
        </div>


        <div className="passport-item">
          <span>Exposure</span>

          <strong>
            {formatExposure(member2)}
          </strong>
        </div>


        <div className="passport-item">
          <span>Status</span>

          <strong>
            {member2.risk}
          </strong>
        </div>

      </div>

    </div>
  )
}

export default EventPassport