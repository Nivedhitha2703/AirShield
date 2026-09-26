// ============================================================
// MEMBER 1 — POLLUTION DETECTION API
// GET /events
// ============================================================

export interface Member1Event {
  sensor_id: string

  latitude: number
  longitude: number
  location: string

  pm25: number
  pm10: number
  no2: number
  so2: number
  co: number
  aqi: number

  temperature: number
  humidity: number

  wind_speed: number
  wind_direction: number

  event_type: string
  risk_level: string

  anomaly_score: number
}

export interface Member1EventsResponse {
  total_events: number
  critical: number
  high: number
  moderate: number
  data: Member1Event[]
}


// ============================================================
// MEMBER 2 — AI / RISK INTELLIGENCE API
// ============================================================

export interface TrajectoryPoint {
  latitude: number
  longitude: number
  time_minutes: number
}


// ============================================================
// MEMBER 2 — EXPOSURE
// ============================================================

export interface ExposureData {
  estimated_exposed_population: number
  exposure_level: string

  hospital_count: number
  school_count: number

  affected_hospitals: unknown[]
  affected_schools: unknown[]
}


// ============================================================
// MEMBER 2 — AI RESPONSE
// ============================================================

export interface Member2AIResponse {
  event_id: string

  risk: string
  risk_score: number

  predicted_pm25: number
  forecast_horizon: string

  shap: Record<string, number>

  probable_source: string
  source_confidence: number

  source_scores: Record<string, number>

  trajectory: TrajectoryPoint[]

  // Current tested Member 2 response returns []
  plume: unknown[]

  exposure: ExposureData
}


// ============================================================
// ALERTS
// ============================================================

export interface Alert {
  id: string
  type: string
  message: string
  severity: string
  time: string
}


// ============================================================
// CITIZEN REPORT
// ============================================================

export interface CitizenReportData {
  pollutionType: string
  location: string
  description: string

  image?: File

  id?: string
  timestamp?: string
  status?: string
}


// ============================================================
// EVENT PASSPORT
// ============================================================

export interface EventPassportData {
  eventId: string

  location: string

  detectedAt: string

  pollutant: string

  source: string

  confidence: number

  predictedMovement: string

  exposure: string

  status: string
}


// ============================================================
// COMBINED AIRSHIELD EVENT
// ============================================================

export interface AirShieldEvent {
  member1: Member1Event
  member2?: Member2AIResponse
}